package com.bsep.pki.dto;

import java.util.ArrayList;

public class SigningCertificateDTO {

    public String issuerCommonName;
    public String issuerIssuerEmail;
    public String issuerEmail;
    public Long issuerId;
    public String validFrom;
    public String validTo;
    public String serialNum;
    public ArrayList<String> keyUsage;
    public ArrayList<String> extendedKeyUsage;

    public SigningCertificateDTO() {}

    public SigningCertificateDTO(String issuerCommonName, String issuerIssuerEmail, String issuerEmail, Long issuerId, String validFrom,
                                 String validTo, String serialNum, ArrayList<String> keyUsage, ArrayList<String> extendedKeyUsage) {
        this.issuerCommonName = issuerCommonName;
        this.issuerIssuerEmail = issuerIssuerEmail;
        this.issuerEmail = issuerEmail;
        this.issuerId = issuerId;
        this.validFrom = validFrom;
        this.validTo = validTo;
        this.serialNum = serialNum;
        this.keyUsage = keyUsage;
        this.extendedKeyUsage = extendedKeyUsage;
    }
}
