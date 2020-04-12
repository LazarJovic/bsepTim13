package com.bsep.pki.dto;

public class CertificateStatusDTO {

    public boolean isValid;
    public boolean isRevoked;

    public CertificateStatusDTO() {}

    public CertificateStatusDTO(boolean isValid, boolean isRevoked) {
        this.isValid = isValid;
        this.isRevoked = isRevoked;
    }
}
