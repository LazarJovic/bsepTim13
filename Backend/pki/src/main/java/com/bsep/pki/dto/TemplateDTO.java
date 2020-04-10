package com.bsep.pki.dto;

import java.util.ArrayList;

public class TemplateDTO {

    public Long id;
    public String signatureAlgorithm;
    public String keyAlgorithm;
    public ArrayList<String> keyUsage;
    public ArrayList<String> extendedKeyUsage;
    public String name;

    public TemplateDTO() {
    }

    public TemplateDTO(Long id, String signatureAlgorithm, String keyAlgorithm, ArrayList<String> keyUsage, ArrayList<String> extendedKeyUsage, String name) {
        this.id = id;
        this.signatureAlgorithm = signatureAlgorithm;
        this.keyAlgorithm = keyAlgorithm;
        this.keyUsage = keyUsage;
        this.extendedKeyUsage = extendedKeyUsage;
        this.name = name;
    }
}
