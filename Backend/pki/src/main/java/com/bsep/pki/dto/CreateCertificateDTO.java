package com.bsep.pki.dto;

import java.util.ArrayList;

public class CreateCertificateDTO {

    public Long id;
    public Long issuerId;
    public String issuerIssuerEmail;
    public String issuerEmail;
    public String serialNum;
    public String issuerCommonName;
    public String issuerValidFrom;
    public String issuerValidTo;
    public String validFrom;
    public String validTo;
    public Long subjectId;
    public String subjectCommonName;
    public String signatureAlgorithm;
    public String keyAlgorithm;
    public ArrayList<String> keyUsage;
    public ArrayList<String> extendedKeyUsage;

    public CreateCertificateDTO() {}

    public CreateCertificateDTO(Long id, Long issuerId, String issuerIssuerEmail, String issuerEmail, String serialNum, String issuerCommonName,
                                String issuerValidFrom, String issuerValidTo, String validFrom,
                                String validTo, Long subjectId, String subjectCommonName, String signatureAlgorithm,
                                String keyAlgorithm, ArrayList<String> keyUsage, ArrayList<String> extendedKeyUsage) {
        this.id = id;
        this.issuerId = issuerId;
        this.issuerIssuerEmail = issuerIssuerEmail;
        this.issuerEmail = issuerEmail;
        this.serialNum = serialNum;
        this.issuerCommonName = issuerCommonName;
        this.issuerValidFrom = issuerValidFrom;
        this.issuerValidTo = issuerValidTo;
        this.validFrom = validFrom;
        this.validTo = validTo;
        this.subjectId = subjectId;
        this.subjectCommonName = subjectCommonName;
        this.signatureAlgorithm = signatureAlgorithm;
        this.keyAlgorithm = keyAlgorithm;
        this.keyUsage = keyUsage;
        this.extendedKeyUsage = extendedKeyUsage;
    }
}
