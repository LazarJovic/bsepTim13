package com.bsep.pki.dto;

public class OverviewCertificateDTO {

    public String issuerCommonName;
    public String issuerEmail;
    public Long issuerId;
    public String subjectCommonName;
    public String subjectEmail;
    public Long subjectId;
    public String serialNum;
    public String validFrom;
    public String validTo;
    public boolean isCA;
    public String hashAlgorithm;
    public String issuerNameHash;
    public String issuerKeyHash;

    public boolean isValid;
    public boolean isRevoked;

    public OverviewCertificateDTO() { }

    public OverviewCertificateDTO(String issuerCommonName, String issuerEmail, Long issuerId, String subjectCommonName,
                                  String subjectEmail, Long subjectId, String serialNum, String validFrom,
                                  String validTo, boolean isCA, String hashAlgorithm,
                                  String issuerNameHash, String issuerKeyHash, boolean isValid, boolean isRevoked) {
        this.issuerCommonName = issuerCommonName;
        this.issuerEmail = issuerEmail;
        this.issuerId = issuerId;
        this.subjectCommonName = subjectCommonName;
        this.subjectEmail = subjectEmail;
        this.subjectId = subjectId;
        this.serialNum = serialNum;
        this.validFrom = validFrom;
        this.validTo = validTo;
        this.isCA = isCA;
        this.hashAlgorithm = hashAlgorithm;
        this.issuerNameHash = issuerNameHash;
        this.issuerKeyHash = issuerKeyHash;
        this.isValid = isValid;
        this.isRevoked = isRevoked;
    }
}
