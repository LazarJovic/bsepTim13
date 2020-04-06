package com.bsep.pki.service;

import com.bsep.pki.dto.SigningCertificateDTO;
import com.bsep.pki.model.IssuerData;
import com.bsep.pki.model.OtherCertData;
import com.bsep.pki.model.SubjectData;
import com.bsep.pki.model.User;
import com.bsep.pki.util.PropertiesConfigurator;
import com.bsep.pki.util.certificate.CertificateGenerator;
import com.bsep.pki.util.keystore.KeyStoreReader;
import com.bsep.pki.util.keystore.KeyStoreWriter;
import com.bsep.pki.util.keystore.PasswordGenerator;
import org.bouncycastle.asn1.x500.X500Name;
import org.bouncycastle.asn1.x509.IssuerSerial;
import org.bouncycastle.asn1.x509.KeyUsage;
import org.bouncycastle.cert.X509ExtensionUtils;
import org.bouncycastle.cert.jcajce.JcaX509CertificateHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigInteger;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.Security;
import java.security.cert.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Enumeration;

@Service
public class CertificateService {

    static
    {
        Security.addProvider(new org.bouncycastle.jce.provider.BouncyCastleProvider());
    }

    private CertificateGenerator certificateGenerator;

    private KeyStoreWriter keyStoreWriter;

    private KeyStoreReader keyStoreReader;

    private PropertiesConfigurator propertiesConfigurator;

    @Autowired
    private UserService userService;

    public CertificateService() {
        this.keyStoreWriter = new KeyStoreWriter();
        this.keyStoreReader = new KeyStoreReader();
        this.certificateGenerator = new CertificateGenerator();
        this.propertiesConfigurator = new PropertiesConfigurator();
    }

    public ArrayList<SigningCertificateDTO> getSelfSignedCertificatesForSigning() {
        ArrayList<SigningCertificateDTO> retVal = new ArrayList<>();
        KeyStore selfSignedKS = this.loadSelfSignedKeyStore();
        Enumeration<String> aliases = null;
        try {
            aliases = selfSignedKS.aliases();
        } catch (KeyStoreException e) {
            e.printStackTrace();
        }

        String keyAlias = null;
        if (aliases.hasMoreElements()) {
            keyAlias = aliases.nextElement();

            Certificate certificate = null;
            try {
                certificate = selfSignedKS.getCertificate(keyAlias);
            } catch (KeyStoreException e) {
                e.printStackTrace();
            }

            X500Name subjectName = null;
            try {
                subjectName = new JcaX509CertificateHolder((X509Certificate) certificate).getSubject();
            } catch (CertificateEncodingException e) {
                e.printStackTrace();
            }

            String issuerCommonName = subjectName.getRDNs()[0].getFirst().getValue().toString();
            String issuerEmail = subjectName.getRDNs()[6].getFirst().getValue().toString();
            String serialNumber = ((X509Certificate) certificate).getSerialNumber().toString();
            String validFrom = ((X509Certificate) certificate).getNotBefore().toString();
            String validTo = ((X509Certificate) certificate).getNotAfter().toString();
            Long issuerId = this.userService.findByEmail(issuerEmail).getId();

            boolean[] keyUsages = ((X509Certificate) certificate).getKeyUsage();

            ArrayList<String> keyUsage = this.getKeyUsagesOfCertificate(keyUsages);

            SigningCertificateDTO dto = new SigningCertificateDTO(issuerCommonName, issuerEmail, issuerId, validFrom, validTo,
                    serialNumber, keyUsage);

            retVal.add(dto);
        }

        return retVal;

    }

    private ArrayList<String> getKeyUsagesOfCertificate(boolean[] keyUsages) {
        ArrayList<String> usages = new ArrayList<>();
        String[] keyUsageNames = {"digitalSignature", "nonRepudiation", "keyEncipherment", "dataEncipherment", "keyAgreement",
                "keyCertSign", "cRLSign", "encipherOnly", "decipherOnly"};
        for(int i = 0; i < keyUsages.length; i++) {
            if(keyUsages[i]) {
                usages.add(keyUsageNames[i]);
            }
        }

        return usages;
    }

    private KeyStore loadSelfSignedKeyStore() {
        String selfSignedPass = null;
        try {
            selfSignedPass = propertiesConfigurator.readValueFromKeyStoreProp(PropertiesConfigurator.SELF_SIGNED);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return this.keyStoreWriter.loadKeyStore(PropertiesConfigurator.SELF_SIGNED + ".jks", selfSignedPass.toCharArray());
    }

    private void loadCAKeyStore() {
        String caPass = null;
        try {
            caPass = propertiesConfigurator.readValueFromKeyStoreProp(PropertiesConfigurator.CA);
        } catch (IOException e) {
            e.printStackTrace();
        }
        this.keyStoreWriter.loadKeyStore(PropertiesConfigurator.CA + ".jks", caPass.toCharArray());
    }

    private void loadEndEntityKeyStore() {
        String endEntityPass = null;
        try {
            endEntityPass = propertiesConfigurator.readValueFromKeyStoreProp(PropertiesConfigurator.END_ENTITY);
        } catch (IOException e) {
            e.printStackTrace();
        }
        this.keyStoreWriter.loadKeyStore(PropertiesConfigurator.END_ENTITY + ".jks", endEntityPass.toCharArray());
    }


    @EventListener(ApplicationReadyEvent.class)
    public void createRootAndFiles() throws IOException {

        User root;
        String rootEmail = "rootCA@maildrop.cc";

        if(this.userService.findByEmail(rootEmail) != null) {
            return;
        }
        else {
           root = new User("","","PKISystem", "Serbia",
                   "PKISystemOrg","PKISystemOrgUnit","Sremska Mitrovica", rootEmail, true);

           this.userService.createEntity(root);

           IssuerData issuerRootData = this.certificateGenerator.generateIssuerData(root, "RSA");
           SubjectData subjectRootData = new SubjectData(issuerRootData.getX500name(), issuerRootData.getKeyPair());

            ArrayList<Integer> keyUsageValues = new ArrayList<>();
                keyUsageValues.add(KeyUsage.digitalSignature);
                keyUsageValues.add(KeyUsage.nonRepudiation);
                keyUsageValues.add(KeyUsage.keyEncipherment);
                keyUsageValues.add(KeyUsage.dataEncipherment);
                keyUsageValues.add(KeyUsage.keyAgreement);
                keyUsageValues.add(KeyUsage.keyCertSign);
                keyUsageValues.add(KeyUsage.cRLSign);
                keyUsageValues.add(KeyUsage.encipherOnly);
                keyUsageValues.add(KeyUsage.decipherOnly);

           OtherCertData otherRootData = new OtherCertData(LocalDate.parse("2015-10-23"), LocalDate.parse("2038-10-23"),
                   "SHA256WithRSAEncryption", new ArrayList<String>(), BigInteger.valueOf(1), keyUsageValues);


            X509Certificate certificate = this.certificateGenerator.generateCertificate(subjectRootData, issuerRootData, otherRootData);

            X500Name subjectName = null;
            try {
                subjectName = new JcaX509CertificateHolder(certificate).getSubject();
            } catch (CertificateEncodingException e) {
                e.printStackTrace();
            }

            this.createKeyStoreFiles();

            String alias = certificate.getSerialNumber().toString() + subjectName.getRDNs()[6].getFirst().getValue();

            String ssPass = propertiesConfigurator.readValueFromKeyStoreProp(PropertiesConfigurator.SELF_SIGNED);

            this.keyStoreWriter.write(alias, issuerRootData.getKeyPair().getPrivate(), ssPass.toCharArray(), certificate);
            this.keyStoreWriter.saveKeyStore(PropertiesConfigurator.SELF_SIGNED + ".jks", ssPass.toCharArray());

            Certificate c = this.keyStoreReader.readCertificate(PropertiesConfigurator.SELF_SIGNED + ".jks", ssPass, alias);


        }

    }

    private void createKeyStoreFiles() throws IOException {

        String selfSignedPass = propertiesConfigurator.readValueFromKeyStoreProp(PropertiesConfigurator.SELF_SIGNED);
        String caPass = propertiesConfigurator.readValueFromKeyStoreProp(PropertiesConfigurator.CA);
        String endEntityPass = propertiesConfigurator.readValueFromKeyStoreProp(PropertiesConfigurator.END_ENTITY);

        this.keyStoreWriter.loadKeyStore(PropertiesConfigurator.SELF_SIGNED + ".jks", selfSignedPass.toCharArray());
        this.keyStoreWriter.loadKeyStore(PropertiesConfigurator.CA + ".jks", caPass.toCharArray());
        this.keyStoreWriter.loadKeyStore(PropertiesConfigurator.END_ENTITY + ".jks", endEntityPass.toCharArray());

        this.keyStoreWriter.saveKeyStore(PropertiesConfigurator.SELF_SIGNED + ".jks", selfSignedPass.toCharArray());
        this.keyStoreWriter.saveKeyStore(PropertiesConfigurator.CA + ".jks", caPass.toCharArray());
        this.keyStoreWriter.saveKeyStore(PropertiesConfigurator.END_ENTITY + ".jks", endEntityPass.toCharArray());
    }

}
