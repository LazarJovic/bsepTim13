package com.bsep.pki.util.certificate;

import com.bsep.pki.model.IssuerData;
import com.bsep.pki.model.OtherCertData;
import com.bsep.pki.model.SubjectData;
import com.bsep.pki.model.User;
import com.bsep.pki.util.MyKeyGenerator;
import org.bouncycastle.asn1.x500.X500NameBuilder;
import org.bouncycastle.asn1.x500.style.BCStyle;
import org.bouncycastle.asn1.x509.*;
import org.bouncycastle.cert.X509CertificateHolder;
import org.bouncycastle.cert.X509ExtensionUtils;
import org.bouncycastle.cert.X509v3CertificateBuilder;
import org.bouncycastle.cert.jcajce.JcaX509CertificateConverter;
import org.bouncycastle.cert.jcajce.JcaX509v3CertificateBuilder;
import org.bouncycastle.operator.ContentSigner;
import org.bouncycastle.operator.OperatorCreationException;
import org.bouncycastle.operator.jcajce.JcaContentSignerBuilder;

import java.security.cert.CertificateEncodingException;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.security.cert.X509Extension;

public class CertificateGenerator {

    private MyKeyGenerator myKeyGenerator;

    public CertificateGenerator() {
        this.myKeyGenerator = new MyKeyGenerator();
    }

    public X509Certificate generateCertificate(SubjectData subjectData, IssuerData issuerData, OtherCertData other) {
        try {
            JcaContentSignerBuilder builder = new JcaContentSignerBuilder(other.getSignatureAlgorithm());
            builder = builder.setProvider("BC");

            ContentSigner contentSigner = builder.build(issuerData.getKeyPair().getPrivate());

            X509v3CertificateBuilder certGen = new JcaX509v3CertificateBuilder(issuerData.getX500name(),
                    other.getSerialNumber(),
                    java.sql.Date.valueOf(other.getStartValidationDate()),
                    java.sql.Date.valueOf(other.getEndValidationDate()),
                    subjectData.getX500name(),
                    subjectData.getKeyPair().getPublic());

            int values = 0;
            for (int i = 0; i < other.getKeyUsageExtensions().size(); i++) {
                values = values | other.getKeyUsageExtensions().get(i);
            }

            certGen.addExtension(Extension.keyUsage, true, new KeyUsage(values));
            certGen.addExtension(Extension.extendedKeyUsage, true, new ExtendedKeyUsage(other.getExtendedKeyUsageValues()));

            X509CertificateHolder certHolder = certGen.build(contentSigner);

            JcaX509CertificateConverter certConverter = new JcaX509CertificateConverter();
            certConverter = certConverter.setProvider("BC");

            return certConverter.getCertificate(certHolder);
        } catch (CertificateEncodingException e) {
            e.printStackTrace();
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
        } catch (IllegalStateException e) {
            e.printStackTrace();
        } catch (OperatorCreationException e) {
            e.printStackTrace();
        } catch (CertificateException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public IssuerData generateIssuerData(User user, String keyAlgorithm) {
        X500NameBuilder builder = new X500NameBuilder(BCStyle.INSTANCE);
        builder.addRDN(BCStyle.CN, user.getCommonName());
        builder.addRDN(BCStyle.SURNAME, user.getLastName());
        builder.addRDN(BCStyle.GIVENNAME, user.getGivenName());
        builder.addRDN(BCStyle.O, user.getOrganization());
        builder.addRDN(BCStyle.OU, user.getOrganizationUnit());
        builder.addRDN(BCStyle.C, user.getCountry());
        builder.addRDN(BCStyle.E, user.getEmail());

        return new IssuerData(builder.build(), myKeyGenerator.generateKeyPair(keyAlgorithm));
    }

}
