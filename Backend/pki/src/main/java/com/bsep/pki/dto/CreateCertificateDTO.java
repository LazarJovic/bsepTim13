package com.bsep.pki.dto;

import java.util.ArrayList;

public class CreateCertificateDTO {

    public Long id;
    public Long issuerId;
    public String issuerEmail;
    public String serialNum;
    public String issuerCommonName;
    public String validFrom;
    public String validTo;
    public Long subjectId;
    public String subjectCommonName;
    public String signatureAlgorithm;
    public String keyAlgorithm;
    public ArrayList<String> keyUsage;

    public CreateCertificateDTO() {}

    public CreateCertificateDTO(Long id, Long issuerId, String issuerEmail, String serialNum, String issuerCommonName, String validFrom,
                                String validTo, Long subjectId, String subjectCommonName, String signatureAlgorithm,
                                String keyAlgorithm, ArrayList<String> keyUsage) {
        this.id = id;
        this.issuerId = issuerId;
        this.issuerEmail = issuerEmail;
        this.serialNum = serialNum;
        this.issuerCommonName = issuerCommonName;
        this.validFrom = validFrom;
        this.validTo = validTo;
        this.subjectId = subjectId;
        this.subjectCommonName = subjectCommonName;
        this.signatureAlgorithm = signatureAlgorithm;
        this.keyAlgorithm = keyAlgorithm;
        this.keyUsage = keyUsage;
    }
}
