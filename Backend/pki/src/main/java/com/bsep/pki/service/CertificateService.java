package com.bsep.pki.service;

import com.bsep.pki.dto.CreateCertificateDTO;
import com.bsep.pki.dto.OverviewCertificateDTO;
import com.bsep.pki.dto.SigningCertificateDTO;
import com.bsep.pki.model.*;
import com.bsep.pki.repository.UserRepository;
import com.bsep.pki.util.MyKeyGenerator;
import com.bsep.pki.util.PropertiesConfigurator;
import com.bsep.pki.util.certificate.CertificateGenerator;
import com.bsep.pki.util.keystore.KeyStoreReader;
import com.bsep.pki.util.keystore.KeyStoreWriter;
import com.bsep.pki.util.keystore.PasswordGenerator;
import org.bouncycastle.asn1.x500.X500Name;
import org.bouncycastle.asn1.x509.KeyPurposeId;
import org.bouncycastle.asn1.x509.KeyUsage;
import org.bouncycastle.cert.jcajce.JcaX509CertificateHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.math.BigInteger;
import java.security.*;
import java.security.cert.*;
import java.security.cert.Certificate;
import java.text.SimpleDateFormat;
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

    @Autowired
    private UserRepository userRepository;

    public CertificateService() {
        this.keyStoreWriter = new KeyStoreWriter();
        this.keyStoreReader = new KeyStoreReader();
        this.certificateGenerator = new CertificateGenerator();
        this.propertiesConfigurator = new PropertiesConfigurator();
        this.myKeyGenerator = new MyKeyGenerator();
    }

    public void create(CreateCertificateDTO dto) throws Exception {

        if (!validateCertificateData(dto).equals("OK")) {
            throw new Exception(validateCertificateData(dto));
        }

        User issuer = this.userService.findEntity(dto.issuerId);
        String issuerAlias = dto.serialNum + dto.issuerEmail + dto.issuerIssuerEmail;
        KeyPair issuerKeyPair = null;
        if(dto.issuerEmail.equals(dto.issuerIssuerEmail)) {
            issuerKeyPair = this.getKeyPairOfIssuerByAlias(issuerAlias, true);
        }
        else {
            issuerKeyPair = this.getKeyPairOfIssuerByAlias(issuerAlias, false);
        }
        IssuerData issuerData = new IssuerData(this.certificateGenerator.generateX500Name(issuer), issuerKeyPair);

        User subject = this.userService.findEntity(dto.subjectId);
        KeyPair subjectKeyPair = this.myKeyGenerator.generateKeyPair(dto.keyAlgorithm);
        SubjectData subjectData = new SubjectData(this.certificateGenerator.generateX500Name(subject), subjectKeyPair);

        KeyPurposeId[] extendedKeyUsageValues = this.getKeyPurposeArray(dto.extendedKeyUsage);
        ArrayList<Integer> keyUsageValues = this.getIntegersOfKeyUsages(dto.keyUsage);
        BigInteger serialNumber = this.generateSerialNumber(issuer);
        OtherCertData otherCertData = new OtherCertData(dto.validFrom, dto.validTo, dto.signatureAlgorithm, keyUsageValues,
                serialNumber, extendedKeyUsageValues);

        X509Certificate certificate = this.certificateGenerator.generateCertificate(subjectData, issuerData, otherCertData);

        String certAlias = this.generateAlias(serialNumber.longValue(), subject.getEmail(), dto.issuerEmail);
        String privateKeyPass = PasswordGenerator.generateRandomPassword(15);

        this.writeInKeyStore(certificate, certAlias, subjectKeyPair.getPrivate(), privateKeyPass, subject.getEmail(), dto.issuerEmail, issuerAlias);

        try {
            this.propertiesConfigurator.putAliasKeyPass(certAlias, privateKeyPass);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void writeInKeyStore(X509Certificate certificate, String certAlias, PrivateKey privateKey, String privateKeyPass,
                                 String subjectEmail, String issuerEmail, String issuerAlias) {
        String fileName = null;
        String filePass = null;
        try {
            if(subjectEmail.equals(issuerEmail) && this.isCA(certificate)) {
                this.loadSelfSignedKeyStore();
                fileName = PropertiesConfigurator.SELF_SIGNED + ".jks";
                filePass = this.propertiesConfigurator.readValueFromKeyStoreProp(PropertiesConfigurator.SELF_SIGNED);
            }
            else if(this.isCA(certificate)) {
                this.loadCAKeyStore();
                fileName = PropertiesConfigurator.CA + ".jks";
                filePass = this.propertiesConfigurator.readValueFromKeyStoreProp(PropertiesConfigurator.CA);
            }
            else {
                this.loadEndEntityKeyStore();
                fileName = PropertiesConfigurator.END_ENTITY + ".jks";
                filePass = this.propertiesConfigurator.readValueFromKeyStoreProp(PropertiesConfigurator.END_ENTITY);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        KeyStore issuerKeyStore = this.findKeyStoreByAlias(issuerAlias);
        Certificate[] issuerChain = null;
        try {
            issuerChain = issuerKeyStore.getCertificateChain(issuerAlias);
            this.keyStoreWriter.write(certAlias, privateKey, privateKeyPass, certificate, issuerChain);
            this.keyStoreWriter.saveKeyStore(fileName, filePass.toCharArray());
        } catch (KeyStoreException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private KeyStore findKeyStoreByAlias(String alias) {

        KeyStore keyStore = null;
        String[] fileNames = {PropertiesConfigurator.SELF_SIGNED, PropertiesConfigurator.CA, PropertiesConfigurator.END_ENTITY};
        try {
            for(int i = 0; i < fileNames.length; i++) {
                if (fileNames[i].equals(PropertiesConfigurator.SELF_SIGNED)) {
                    keyStore = this.loadSelfSignedKeyStore();
                        if(keyStore.containsAlias(alias)) {
                            return keyStore;
                        }
                } else if(fileNames[i].equals(PropertiesConfigurator.CA)){
                    keyStore = this.loadCAKeyStore();
                    if(keyStore.containsAlias(alias)) {
                        return keyStore;
                    }
                } else {
                    keyStore = this.loadEndEntityKeyStore();
                    if(keyStore.containsAlias(alias)) {
                        return keyStore;
                    }
                }
            }
        } catch (KeyStoreException e) {
            e.printStackTrace();
        }

        return keyStore;
    }

    private boolean isCA(X509Certificate certificate) {
        return certificate.getKeyUsage()[5];
    }

    private KeyPair getKeyPairOfIssuerByAlias(String alias, boolean isSelfSigned) {
        KeyStore keyStore = null;
        if(isSelfSigned) {
            keyStore = loadSelfSignedKeyStore();
        }
        else {
            keyStore = loadCAKeyStore();
        }
        try {
            if(keyStore.containsAlias(alias)) {
                try {
                    Key privateKey = null;
                    try {
                        privateKey = keyStore.getKey(alias, this.propertiesConfigurator.readValueFromAliasPassProp(alias).toCharArray());
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    if(privateKey instanceof PrivateKey) {
                        PublicKey publicKey = keyStore.getCertificate(alias).getPublicKey();

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

    public ArrayList<SigningCertificateDTO> getCertificatesForSigning() {
        ArrayList<SigningCertificateDTO> retVal = new ArrayList<>();
        KeyStore keyStore = null;
        String[] fileNames = {PropertiesConfigurator.SELF_SIGNED, PropertiesConfigurator.CA};
        ArrayList<String> usedAliases = new ArrayList<>();
        for(int i = 0; i < fileNames.length; i++) {
            if(fileNames[i].equals(PropertiesConfigurator.SELF_SIGNED)) {
                keyStore = this.loadSelfSignedKeyStore();
            }
            else {
                keyStore = this.loadCAKeyStore();
            }
            Enumeration<String> aliases = null;
            try {
                aliases = keyStore.aliases();
            } catch (KeyStoreException e) {
                e.printStackTrace();
            }

            String keyAlias = null;
            while (aliases.hasMoreElements()) {
                keyAlias = aliases.nextElement();

                if(usedAliases.contains(keyAlias)) {
                    continue;
                }

                Certificate certificate = null;
                try {
                    certificate = keyStore.getCertificate(keyAlias);
                } catch (KeyStoreException e) {
                    e.printStackTrace();
                }

                X500Name issuerName = null;
                try {
                    issuerName = new JcaX509CertificateHolder((X509Certificate) certificate).getIssuer();
                } catch (CertificateEncodingException e) {
                    e.printStackTrace();
                }
                String issuerIssuerEmail = issuerName.getRDNs()[6].getFirst().getValue().toString();

                X500Name subjectName = null;
                try {
                    subjectName = new JcaX509CertificateHolder((X509Certificate) certificate).getSubject();
                } catch (CertificateEncodingException e) {
                    e.printStackTrace();
                }

                SimpleDateFormat sdf = new SimpleDateFormat(
                        "YYYY-MM-dd");

                String issuerCommonName = subjectName.getRDNs()[0].getFirst().getValue().toString();
                String issuerEmail = subjectName.getRDNs()[6].getFirst().getValue().toString();
                String serialNumber = ((X509Certificate) certificate).getSerialNumber().toString();
                Date validFromDate = ((X509Certificate) certificate).getNotBefore();
                String validFrom = sdf.format(validFromDate);
                Date validToDate = ((X509Certificate) certificate).getNotAfter();
                String validTo = sdf.format(validToDate);
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

                SigningCertificateDTO dto = new SigningCertificateDTO(issuerCommonName, issuerIssuerEmail, issuerEmail, issuerId, validFrom, validTo,
                        serialNumber, keyUsage, extendedKeyUsage);

                retVal.add(dto);
                usedAliases.add(keyAlias);
            }

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

    public KeyStore loadSelfSignedKeyStore() {
        String selfSignedPass = null;
        try {
            selfSignedPass = propertiesConfigurator.readValueFromKeyStoreProp(PropertiesConfigurator.SELF_SIGNED);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return this.keyStoreWriter.loadKeyStore(PropertiesConfigurator.SELF_SIGNED + ".jks", selfSignedPass.toCharArray());
    }

    public KeyStore loadCAKeyStore() {
        String caPass = null;
        try {
            caPass = propertiesConfigurator.readValueFromKeyStoreProp(PropertiesConfigurator.CA);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return this.keyStoreWriter.loadKeyStore(PropertiesConfigurator.CA + ".jks", caPass.toCharArray());
    }

    public KeyStore loadEndEntityKeyStore() {
        String endEntityPass = null;
        try {
            endEntityPass = propertiesConfigurator.readValueFromKeyStoreProp(PropertiesConfigurator.END_ENTITY);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return this.keyStoreWriter.loadKeyStore(PropertiesConfigurator.END_ENTITY + ".jks", endEntityPass.toCharArray());
    }

    public String generateAlias(Long serialNumber, String subjectEmail, String issuerEmail) {
        return serialNumber.toString() + subjectEmail + issuerEmail;
    }

    private BigInteger generateSerialNumber(User user) {
        BigInteger serialNum = BigInteger.valueOf(user.getNumberOfCert() + 1);
        user.setNumberOfCert(serialNum.longValue());
        this.userRepository.save(user);

        return serialNum;
    }

    private String validateCertificateData(CreateCertificateDTO dto) {
        if(!this.validIssuerData(dto)) {
            return "Issuer is not chosen correctly!";
        }
        else if(!this.validSubjectData(dto)) {
            return "Subject is not chosen correctly!";
        }
        else if(notValidSingleData(dto.signatureAlgorithm)) {
            return "Signature algorithm is not chosen correctly!";
        }
        else if(notValidSingleData(dto.keyAlgorithm)) {
            return "Key algorithm is not chosen correctly!";
        }
        else if(!validDate(dto.validFrom)) {
            return "Starting validity date is not chosen correctly!";
        }
        else if(!validDate(dto.validTo)) {
            return "Ending validity date is not chosen correctly!";
        }
        else if(dto.keyUsage == null) {
            return "Key usages are not chosen correctly!";
        }
        else if(dto.extendedKeyUsage == null) {
            return "Extended key usages are not chosen correctly!";
        }
        else if(!areDatesInRightOrder(dto.validFrom, dto.validTo)) {
            return "Start validity date must be before end validity date!";
        }
        else if(!isInsideIssuerDate(dto)) {
            return "Validation period must be inside issuer certificate validation period!";
        }

        return "OK";
    }

    private boolean areDatesInRightOrder(String from, String to) {
        LocalDate validFrom = LocalDate.parse(from);
        LocalDate validTo = LocalDate.parse(to);

        if(validFrom.isBefore(validTo)) {
            return true;
        }

        return false;
    }

    private boolean isInsideIssuerDate(CreateCertificateDTO dto) {
        LocalDate issuerValidFrom = LocalDate.parse(dto.issuerValidFrom);
        LocalDate issuerValidTo = LocalDate.parse(dto.issuerValidTo);
        LocalDate validFrom = LocalDate.parse(dto.validFrom);
        LocalDate validTo = LocalDate.parse(dto.validTo);

        if(issuerValidFrom.isBefore(validFrom) &&  issuerValidTo.isAfter(validTo)) {
            return true;
        }

        return false;
    }

    private boolean validDate(String date) {
        if(!notValidSingleData(date)) {
            try {
                LocalDate.parse(date);
                return true;
            } catch (Exception e) {
                return false;
            }
        }

        return false;
    }

    private boolean validIssuerData(CreateCertificateDTO dto) {
        if(notValidSingleData(dto.issuerEmail) || notValidSingleData(dto.issuerIssuerEmail) || notValidSingleData(dto.issuerCommonName) ||
         notValidSingleData(dto.serialNum) || dto.issuerId == null) {
            return false;
        }

        return true;
    }

    private boolean validSubjectData(CreateCertificateDTO dto) {
        if(notValidSingleData(dto.subjectCommonName) || dto.subjectId == null) {
            return false;
        }

        return true;
    }

    private boolean notValidSingleData(String data) {
        if(data == null || data.equals("")) {
            return true;
        }

        return false;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void createRootAndFiles() throws IOException {

        User root;
        String rootEmail = "rootca@maildrop.cc";

        if(this.userService.findByEmail(rootEmail) != null) {
            return;
        }
        else {
           root = new User("","","PKISystem", "Serbia",
                   "PKISystemOrg","PKISystemOrgUnit","Sremska Mitrovica", rootEmail, true, (long) 0);

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

           OtherCertData otherRootData = new OtherCertData(LocalDate.parse("2015-10-23"), LocalDate.parse("2035-10-23"),
                   "SHA256WithRSAEncryption", new ArrayList<String>(), this.generateSerialNumber(root), keyUsageValues, extendedKeyUsages);


            X509Certificate certificate = this.certificateGenerator.generateCertificate(subjectRootData, issuerRootData, otherRootData);

            this.createKeyStoreFiles();

            String keyPass = PasswordGenerator.generateRandomPassword(15);
            String alias = this.generateAlias(certificate.getSerialNumber().longValue(), rootEmail, rootEmail);

            this.propertiesConfigurator.firstAliasKeyPass(alias, keyPass);

            String ssPass = propertiesConfigurator.readValueFromKeyStoreProp(PropertiesConfigurator.SELF_SIGNED);

            this.keyStoreWriter.write(alias, issuerRootData.getKeyPair().getPrivate(), keyPass, certificate, new X509Certificate[0]);
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

    public ArrayList<OverviewCertificateDTO> getSigningCertificatesOverview() {
        ArrayList<OverviewCertificateDTO> retVal = new ArrayList<>();
        KeyStore keyStore = null;
        String[] fileNames = {PropertiesConfigurator.SELF_SIGNED, PropertiesConfigurator.CA};
        ArrayList<String> usedAliases = new ArrayList<>();
        for(int i = 0; i < fileNames.length; i++) {
            if(fileNames[i].equals(PropertiesConfigurator.SELF_SIGNED)) {
                keyStore = this.loadSelfSignedKeyStore();
            }
            else {
                keyStore = this.loadCAKeyStore();
            }
            Enumeration<String> aliases = null;
            try {
                aliases = keyStore.aliases();
            } catch (KeyStoreException e) {
                e.printStackTrace();
            }

            String keyAlias = null;
            while (aliases.hasMoreElements()) {
                keyAlias = aliases.nextElement();

                if(usedAliases.contains(keyAlias)) {
                    continue;
                }

                Certificate certificate = null;
                try {
                    certificate = keyStore.getCertificate(keyAlias);
                } catch (KeyStoreException e) {
                    e.printStackTrace();
                }

                X500Name issuerName = null;
                try {
                    issuerName = new JcaX509CertificateHolder((X509Certificate) certificate).getIssuer();
                } catch (CertificateEncodingException e) {
                    e.printStackTrace();
                }

                X500Name subjectName = null;
                try {
                    subjectName = new JcaX509CertificateHolder((X509Certificate) certificate).getSubject();
                } catch (CertificateEncodingException e) {
                    e.printStackTrace();
                }

                String issuerCommonName = issuerName.getRDNs()[0].getFirst().getValue().toString();
                String issuerEmail = issuerName.getRDNs()[6].getFirst().getValue().toString();
                Long issuerId = this.userService.findByEmail(issuerEmail).getId();

                String subjectCommonName = subjectName.getRDNs()[0].getFirst().getValue().toString();
                String subjectEmail = subjectName.getRDNs()[6].getFirst().getValue().toString();
                Long subjectId = this.userService.findByEmail(subjectEmail).getId();

                String serialNumber = ((X509Certificate) certificate).getSerialNumber().toString();

                String validFrom = ((X509Certificate) certificate).getNotBefore().toString();
                String validTo = ((X509Certificate) certificate).getNotAfter().toString();

                String issuerNameHash = this.encryptIssuerDN(issuerName);
                String issuerKeyHash = this.encryptIssuerPublicKey(this.getIssuerCertificate(keyAlias, keyStore).getPublicKey());

                OverviewCertificateDTO dto = new OverviewCertificateDTO(issuerCommonName, issuerEmail, issuerId,
                        subjectCommonName, subjectEmail, subjectId, serialNumber, validFrom, validTo, true,
                        "sha1", issuerNameHash, issuerKeyHash);

                retVal.add(dto);
                usedAliases.add(keyAlias);
            }

        }
        return retVal;
    }

    public ArrayList<OverviewCertificateDTO> getEndEntityCertificatesOverview() {
        ArrayList<OverviewCertificateDTO> retVal = new ArrayList<>();
        KeyStore keyStore = this.loadEndEntityKeyStore();
        Enumeration<String> aliases = null;
        try {
            aliases = keyStore.aliases();
        } catch (KeyStoreException e) {
            e.printStackTrace();
        }

        String keyAlias = null;
        while (aliases.hasMoreElements()) {
            keyAlias = aliases.nextElement();

            Certificate certificate = null;
            try {
                certificate = keyStore.getCertificate(keyAlias);
            } catch (KeyStoreException e) {
                e.printStackTrace();
            }

            if(this.isCA((X509Certificate) certificate)) {
                continue;
            }

            X500Name issuerName = null;
            try {
                issuerName = new JcaX509CertificateHolder((X509Certificate) certificate).getIssuer();
            } catch (CertificateEncodingException e) {
                e.printStackTrace();
            }

            X500Name subjectName = null;
            try {
                subjectName = new JcaX509CertificateHolder((X509Certificate) certificate).getSubject();
            } catch (CertificateEncodingException e) {
                e.printStackTrace();
            }

            String issuerCommonName = issuerName.getRDNs()[0].getFirst().getValue().toString();
            String issuerEmail = issuerName.getRDNs()[6].getFirst().getValue().toString();
            Long issuerId = this.userService.findByEmail(issuerEmail).getId();

            String subjectCommonName = subjectName.getRDNs()[0].getFirst().getValue().toString();
            String subjectEmail = subjectName.getRDNs()[6].getFirst().getValue().toString();
            Long subjectId = this.userService.findByEmail(subjectEmail).getId();

            String serialNumber = ((X509Certificate) certificate).getSerialNumber().toString();

            String validFrom = ((X509Certificate) certificate).getNotBefore().toString();
            String validTo = ((X509Certificate) certificate).getNotAfter().toString();

            String issuerNameHash = this.encryptIssuerDN(issuerName);
            String issuerKeyHash = this.encryptIssuerPublicKey(this.getIssuerCertificate(keyAlias, keyStore).getPublicKey());

            OverviewCertificateDTO dto = new OverviewCertificateDTO(issuerCommonName, issuerEmail, issuerId,
                    subjectCommonName, subjectEmail, subjectId, serialNumber, validFrom, validTo, false,
                    "sha1", issuerNameHash, issuerKeyHash);

            retVal.add(dto);
        }
        return retVal;
    }

    private Certificate getIssuerCertificate(String alias, KeyStore keyStore) {
        try {
            if(keyStore.containsAlias(alias)) {
                Certificate[] certs = keyStore.getCertificateChain(alias);
                if(certs.length == 1) {
                    return certs[0];
                } else {
                    return certs[1];
                }
            }
        } catch (KeyStoreException e) {
            e.printStackTrace();
        }

        return null;
    }

    private String encryptIssuerDN(X500Name input)
    {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-1");

            byte[] messageDigest = md.digest(input.getEncoded());

            BigInteger no = new BigInteger(1, messageDigest);

            String hashtext = no.toString(16);

            while (hashtext.length() < 32) {
                hashtext = "0" + hashtext;
            }

            return hashtext;
        }

        catch (NoSuchAlgorithmException | IOException e) {
            throw new RuntimeException(e);
        }
    }

    private String encryptIssuerPublicKey(PublicKey input)
    {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-1");

            byte[] messageDigest = md.digest(input.getEncoded());

            BigInteger no = new BigInteger(1, messageDigest);

            String hashtext = no.toString(16);

            while (hashtext.length() < 32) {
                hashtext = "0" + hashtext;
            }

            return hashtext;
        }

        catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    public boolean downloadCertificate(OverviewCertificateDTO dto) {

        String certFileName = System.getProperty("user.home") + "\\Downloads\\" + dto.issuerCommonName + dto.serialNum + ".cer";
        Certificate certificate = this.getCertificateFromOverview(dto);

        if(certificate != null) {
            byte[] certByte = null;
            FileOutputStream outputStream = null;

            try {
                File f = new File(certFileName);
                if (f.exists()) {
                    return true;
                }
                outputStream = new FileOutputStream(f);

                try {
                    certByte = certificate.getEncoded();
                } catch (CertificateEncodingException e) {
                    e.printStackTrace();
                }

                try {
                    outputStream.write(certByte);
                    outputStream.close();
                    return true;

                } catch (IOException e) {
                    e.printStackTrace();
                }

            } catch (FileNotFoundException e) {
                e.printStackTrace();
            }
        }

        return false;
    }

    public Certificate getCertificateFromOverview(OverviewCertificateDTO dto) {

        String alias = this.generateAlias(Long.parseLong(dto.serialNum), dto.subjectEmail, dto.issuerEmail);
        String file = null;
        String filePass = null;
        Certificate certificate = null;

        try {
            if(dto.isCA) {
                if(dto.issuerEmail.equals(dto.subjectEmail)) {
                    this.loadSelfSignedKeyStore();
                    file = PropertiesConfigurator.SELF_SIGNED + ".jks";
                    filePass = propertiesConfigurator.readValueFromKeyStoreProp(PropertiesConfigurator.SELF_SIGNED);
                } else {
                    this.loadCAKeyStore();
                    file = PropertiesConfigurator.CA + ".jks";
                    filePass = propertiesConfigurator.readValueFromKeyStoreProp(PropertiesConfigurator.CA);
                }
            } else {
                this.loadEndEntityKeyStore();
                file = PropertiesConfigurator.END_ENTITY + ".jks";
                filePass = propertiesConfigurator.readValueFromKeyStoreProp(PropertiesConfigurator.END_ENTITY);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        if(file != null && filePass != null) {
            certificate = this.keyStoreReader.readCertificate(file, filePass, alias);
        }

        return certificate;
    }

}
