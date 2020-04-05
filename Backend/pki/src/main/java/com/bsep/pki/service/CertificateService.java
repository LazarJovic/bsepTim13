package com.bsep.pki.service;

import com.bsep.pki.model.IssuerData;
import com.bsep.pki.model.OtherCertData;
import com.bsep.pki.model.SubjectData;
import com.bsep.pki.model.User;
import com.bsep.pki.util.certificate.CertificateGenerator;
import com.bsep.pki.util.keystore.KeyStoreWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.security.Security;
import java.security.cert.X509Certificate;
import java.time.LocalDate;
import java.util.ArrayList;

@Service
public class CertificateService {

    static
    {
        Security.addProvider(new org.bouncycastle.jce.provider.BouncyCastleProvider());
    }

    private CertificateGenerator certificateGenerator;

    private KeyStoreWriter keyStoreWriter = new KeyStoreWriter();

    public CertificateService() {
        this.certificateGenerator = new CertificateGenerator();
    }

    @Autowired
    private UserService userService;

    @EventListener(ApplicationReadyEvent.class)
    public void createRootAndFiles() {

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
           OtherCertData otherRootData = new OtherCertData(LocalDate.parse("2015-10-23"), LocalDate.parse("2038-10-23"),
                   "SHA256WithRSAEncryption", new ArrayList<String>(), new ArrayList<String>(), BigInteger.valueOf(1));


            X509Certificate certificate = this.certificateGenerator.generateCertificate(subjectRootData, issuerRootData, otherRootData);

        }

    }


}
