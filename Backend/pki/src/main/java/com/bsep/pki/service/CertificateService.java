package com.bsep.pki.service;

import com.bsep.pki.dto.CreateCertificateDTO;
import com.bsep.pki.dto.SigningCertificateDTO;
import com.bsep.pki.model.IssuerData;
import com.bsep.pki.model.OtherCertData;
import com.bsep.pki.model.SubjectData;
import com.bsep.pki.model.User;
import com.bsep.pki.util.MyKeyGenerator;
import com.bsep.pki.util.PropertiesConfigurator;
import com.bsep.pki.util.certificate.CertificateGenerator;
import com.bsep.pki.util.keystore.KeyStoreReader;
import com.bsep.pki.util.keystore.KeyStoreWriter;
import com.bsep.pki.util.keystore.PasswordGenerator;
import org.bouncycastle.asn1.x500.X500Name;
import org.bouncycastle.asn1.x509.IssuerSerial;
import org.bouncycastle.asn1.x509.KeyPurposeId;
import org.bouncycastle.asn1.x509.KeyUsage;
import org.bouncycastle.cert.X509ExtensionUtils;
import org.bouncycastle.cert.jcajce.JcaX509CertificateHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigInteger;
import java.security.*;
import java.security.cert.*;
import java.security.cert.Certificate;
import java.time.LocalDate;
import java.util.*;

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

    private MyKeyGenerator myKeyGenerator;

    @Autowired
    private UserService userService;

    public CertificateService() {
        this.keyStoreWriter = new KeyStoreWriter();
        this.keyStoreReader = new KeyStoreReader();
        this.certificateGenerator = new CertificateGenerator();
        this.propertiesConfigurator = new PropertiesConfigurator();
        this.myKeyGenerator = new MyKeyGenerator();
    }

    public CreateCertificateDTO create(CreateCertificateDTO dto) {

        User issuer = this.userService.findEntity(dto.issuerId);
        String issuerAlias = dto.serialNum + dto.issuerEmail;
        IssuerData issuerData = new IssuerData(this.certificateGenerator.generateX500Name(issuer), this.getKayPairOfIssuerByAlias(issuerAlias));
        User subject = this.userService.findEntity(dto.subjectId);
        SubjectData subjectData = new SubjectData(this.certificateGenerator.generateX500Name(subject), this.myKeyGenerator.generateKeyPair(dto.keyAlgorithm));
        // KeyPurposeId[] extendedKeyUsageValues = this.getKeyPurposeArray(dto.extendedKeyUsage);
        ArrayList<Integer> keyUsageValues = this.getIntegersOfKeyUsages(dto.keyUsage);

        return null;
    }

    private KeyPair getKayPairOfIssuerByAlias(String alias) {
        KeyStore selfSignedKS = loadSelfSignedKeyStore();
        try {
            if(selfSignedKS.containsAlias(alias)) {
                String selfSignedPass = null;
                try {
                    selfSignedPass = propertiesConfigurator.readValueFromKeyStoreProp(PropertiesConfigurator.SELF_SIGNED);
                } catch (IOException e) {
                    e.printStackTrace();
                }
                try {
                    Key privateKey = selfSignedKS.getKey(alias, selfSignedPass.toCharArray());
                    if(privateKey instanceof PrivateKey) {
                        PublicKey publicKey = selfSignedKS.getCertificate(alias).getPublicKey();

                        return new KeyPair(publicKey, (PrivateKey) privateKey);
                    }
                } catch (NoSuchAlgorithmException e) {
                    e.printStackTrace();
                } catch (UnrecoverableKeyException e) {
                    e.printStackTrace();
                }
            }
        } catch (KeyStoreException e) {
            e.printStackTrace();
        }

        return null;
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

            List<String> extendedKeyUsageCodes = null;
            try {
                if(((X509Certificate) certificate).getExtendedKeyUsage() != null) {
                    extendedKeyUsageCodes = ((X509Certificate) certificate).getExtendedKeyUsage();
                }
            } catch (CertificateParsingException e) {
                e.printStackTrace();
            }

            ArrayList<String> extendedKeyUsage = this.getExtendedKeyUsagesOfCertificate(extendedKeyUsageCodes);

            SigningCertificateDTO dto = new SigningCertificateDTO(issuerCommonName, issuerEmail, issuerId, validFrom, validTo,
                    serialNumber, keyUsage, extendedKeyUsage);

            retVal.add(dto);
        }

        return retVal;

    }

    private KeyPurposeId[] getKeyPurposeArray(ArrayList<String> usages) {
        HashMap<String, KeyPurposeId> map = new HashMap<>();
        map.put("serverAuth", KeyPurposeId.id_kp_serverAuth);
        map.put("clientAuth", KeyPurposeId.id_kp_clientAuth);
        map.put("codeSigning", KeyPurposeId.id_kp_codeSigning);
        map.put("emailProtection", KeyPurposeId.id_kp_emailProtection);
        map.put("timeStamping", KeyPurposeId.id_kp_timeStamping);
        map.put("ocspSigning", KeyPurposeId.id_kp_OCSPSigning);
        map.put("ipsecEndSystem", KeyPurposeId.id_kp_ipsecEndSystem);
        map.put("ipsecTunnel", KeyPurposeId.id_kp_ipsecTunnel);
        map.put("ipsecUser", KeyPurposeId.id_kp_ipsecUser);

        ArrayList<KeyPurposeId> retVal = new ArrayList<>();

        for (Map.Entry<String, KeyPurposeId> entry : map.entrySet()) {
            if(usages.contains(entry.getKey())) {
                retVal.add(entry.getValue());
            }
        }

        return  retVal.toArray(new KeyPurposeId[retVal.size()]);
    }

    private ArrayList<String> getExtendedKeyUsagesOfCertificate(List<String> codes) {
        HashMap<String, String> map = new HashMap<>();
        map.put("1.3.6.1.5.5.7.3.1", "serverAuth");
        map.put("1.3.6.1.5.5.7.3.2", "clientAuth");
        map.put("1.3.6.1.5.5.7.3.3", "codeSigning");
        map.put("1.3.6.1.5.5.7.3.4", "emailProtection");
        map.put("1.3.6.1.5.5.7.3.8", "timeStamping");
        map.put("1.3.6.1.5.5.7.3.9", "ocspSigning");
        map.put("1.3.6.1.5.5.7.3.5", "ipsecEndSystem");
        map.put("1.3.6.1.5.5.7.3.6", "ipsecTunnel");
        map.put("1.3.6.1.5.5.7.3.7", "ipsecUser");

        ArrayList<String> extendedKeyUsageValues = new ArrayList<>();

        for (Map.Entry<String, String> entry : map.entrySet()) {
            if(codes.contains(entry.getKey())) {
                extendedKeyUsageValues.add(entry.getValue());
            }
        }

        return  extendedKeyUsageValues;
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

    private ArrayList<Integer> getIntegersOfKeyUsages(ArrayList<String> usages) {

        HashMap<String, Integer> map = new HashMap<>();
        map.put("digitalSignature", KeyUsage.digitalSignature);
        map.put("nonRepudiation", KeyUsage.nonRepudiation);
        map.put("keyEncipherment", KeyUsage.keyEncipherment);
        map.put("dataEncipherment", KeyUsage.dataEncipherment);
        map.put("keyAgreement", KeyUsage.keyAgreement);
        map.put("keyCertSign", KeyUsage.keyCertSign);
        map.put("CRLSign", KeyUsage.cRLSign);
        map.put("encipherOnly", KeyUsage.encipherOnly);
        map.put("decipherOnly", KeyUsage.decipherOnly);

        ArrayList<Integer> retVal = new ArrayList<>();

        for (Map.Entry<String, Integer> entry : map.entrySet()) {
            if(usages.contains(entry.getKey())) {
                retVal.add(entry.getValue());
            }
        }

        return retVal;
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

            KeyPurposeId[] extendedKeyUsages = {KeyPurposeId.id_kp_serverAuth, KeyPurposeId.id_kp_clientAuth, KeyPurposeId.id_kp_codeSigning,
                    KeyPurposeId.id_kp_emailProtection, KeyPurposeId.id_kp_timeStamping, KeyPurposeId.id_kp_OCSPSigning,
                    KeyPurposeId.id_kp_ipsecEndSystem, KeyPurposeId.id_kp_ipsecTunnel, KeyPurposeId.id_kp_ipsecUser};

           OtherCertData otherRootData = new OtherCertData(LocalDate.parse("2015-10-23"), LocalDate.parse("2038-10-23"),
                   "SHA256WithRSAEncryption", new ArrayList<String>(), BigInteger.valueOf(1), keyUsageValues, extendedKeyUsages);


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
