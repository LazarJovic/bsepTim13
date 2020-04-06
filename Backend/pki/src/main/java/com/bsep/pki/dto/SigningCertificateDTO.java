package com.bsep.pki.dto;

import java.util.ArrayList;

public class SigningCertificateDTO {

    public String issuerCommonName;
    public String issuerEmail;
    public Long issuerId;
    public String validFrom;
    public String validTo;
    public String serialNum;
    public ArrayList<String> keyUsage;

    public SigningCertificateDTO() {}

    public SigningCertificateDTO(String issuerCommonName, String issuerEmail, Long issuerId, String validFrom,
                                 String validTo, String serialNum, ArrayList<String> keyUsage) {
        this.issuerCommonName = issuerCommonName;
        this.issuerEmail = issuerEmail;
        this.issuerId = issuerId;
        this.validFrom = validFrom;
        this.validTo = validTo;
        this.serialNum = serialNum;
        this.keyUsage = keyUsage;
    }
}
