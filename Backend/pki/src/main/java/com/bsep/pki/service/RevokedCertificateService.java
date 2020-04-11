package com.bsep.pki.service;

import com.bsep.pki.dto.OverviewCertificateDTO;
import com.bsep.pki.model.RevokedCertificate;
import com.bsep.pki.repository.RevokedCertificateRepository;
import com.bsep.pki.util.PropertiesConfigurator;
import org.bouncycastle.asn1.x500.X500Name;
import org.bouncycastle.cert.jcajce.JcaX509CertificateHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.cert.Certificate;
import java.security.cert.CertificateEncodingException;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.Enumeration;

@Service
public class RevokedCertificateService {

    @Autowired
    private RevokedCertificateRepository revokedCertificateRepository;

    @Autowired
    private CertificateService certificateService;

    public RevokedCertificateService() { }

    public RevokedCertificate create(RevokedCertificate revokedCertificate) {
        return this.revokedCertificateRepository.save(revokedCertificate);
    }

    public RevokedCertificate revokeCertificate(OverviewCertificateDTO dto) {

        Certificate certificate = this.certificateService.getCertificateFromOverview(dto);
        String alias = this.certificateService.generateAlias(Long.parseLong(dto.serialNum), dto.subjectEmail, dto.issuerEmail);

        if(certificate != null) {
            RevokedCertificate revokedCertificate = new RevokedCertificate(alias);
            RevokedCertificate newRevCert = this.create(revokedCertificate);

            this.revokeAllChildren(dto.subjectEmail);

            return newRevCert;
        }

        return null;
    }

    private void revokeAllChildren(String email) {

        KeyStore keyStore = null;
        String[] fileNames = {PropertiesConfigurator.CA, PropertiesConfigurator.END_ENTITY};

        for(int i = 0; i < fileNames.length; i++) {
            if (fileNames[i].equals(PropertiesConfigurator.CA)) {
                keyStore = this.certificateService.loadCAKeyStore();
            } else {
                keyStore = this.certificateService.loadEndEntityKeyStore();
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

                Certificate certificate = null;
                try {
                    certificate = keyStore.getCertificate(keyAlias);
                } catch (KeyStoreException e) {
                    e.printStackTrace();
                }

                if(certificate == null) {
                    if (fileNames[i].equals(PropertiesConfigurator.CA)) {
                        keyStore = this.certificateService.loadCAKeyStore();
                    } else {
                        keyStore = this.certificateService.loadEndEntityKeyStore();
                    }
                }

                try {
                    certificate = keyStore.getCertificate(keyAlias);
                } catch (KeyStoreException e) {
                    e.printStackTrace();
                }

                X500Name subjectName = null;
                try {
                    subjectName = new JcaX509CertificateHolder((X509Certificate) certificate).getSubject();
                } catch (CertificateEncodingException e) {
                    e.printStackTrace();
                }

                X500Name issuerName = null;
                try {
                    issuerName = new JcaX509CertificateHolder((X509Certificate) certificate).getIssuer();
                } catch (CertificateEncodingException e) {
                    e.printStackTrace();
                }

                String issuerEmail = issuerName.getRDNs()[6].getFirst().getValue().toString();
                String subjectEmail = subjectName.getRDNs()[6].getFirst().getValue().toString();

                if (issuerEmail.equals(email)) {
                    RevokedCertificate revokedCertificate = new RevokedCertificate(keyAlias);
                    RevokedCertificate newRevCert = this.create(revokedCertificate);

                    this.revokeAllChildren(subjectEmail);
                }
            }
        }
    }
}
