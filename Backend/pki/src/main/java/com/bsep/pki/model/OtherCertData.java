package com.bsep.pki.model;

import java.math.BigInteger;
import java.time.LocalDate;
import java.util.ArrayList;

public class OtherCertData {

    private LocalDate startValidationDate;
    private LocalDate endValidationDate;
    private String signatureAlgorithm;
    private ArrayList<String> extendedKeyUsageExtensions;
    private BigInteger serialNumber;
    private ArrayList<Integer> keyUsageValues;

    public OtherCertData() {
        this.keyUsageValues = new ArrayList<>();
    }

    public OtherCertData(LocalDate startValidationDate, LocalDate endValidationDate, String signatureAlgorithm,
                         ArrayList<String> extendedKeyUsageExtensions,
                         BigInteger serialNumber, ArrayList<Integer> keyUsageValues) {
        this.startValidationDate = startValidationDate;
        this.endValidationDate = endValidationDate;
        this.signatureAlgorithm = signatureAlgorithm;
        this.extendedKeyUsageExtensions = extendedKeyUsageExtensions;
        this.serialNumber = serialNumber;
        this.keyUsageValues = keyUsageValues;
    }

    public OtherCertData(String startValidationDate, String endValidationDate, String signatureAlgorithm,
                         ArrayList<Integer> keyUsageValues, ArrayList<String> extendedKeyUsageExtensions, BigInteger serialNumber) {
        this.startValidationDate = LocalDate.parse(startValidationDate);
        this.endValidationDate = LocalDate.parse(endValidationDate);
        this.signatureAlgorithm = signatureAlgorithm;
        this.keyUsageValues = keyUsageValues;
        this.extendedKeyUsageExtensions = extendedKeyUsageExtensions;
        this.serialNumber = serialNumber;
    }

    public LocalDate getStartValidationDate() {
        return startValidationDate;
    }

    public void setStartValidationDate(LocalDate startValidationDate) {
        this.startValidationDate = startValidationDate;
    }

    public LocalDate getEndValidationDate() {
        return endValidationDate;
    }

    public void setEndValidationDate(LocalDate endValidationDate) {
        this.endValidationDate = endValidationDate;
    }

    public String getSignatureAlgorithm() {
        return signatureAlgorithm;
    }

    public void setSignatureAlgorithm(String signatureAlgorithm) {
        this.signatureAlgorithm = signatureAlgorithm;
    }

    public ArrayList<Integer> getKeyUsageExtensions() {
        return keyUsageValues;
    }

    public void setKeyUsageExtensions(ArrayList<Integer> keyUsageValues) {
        this.keyUsageValues = keyUsageValues;
    }

    public ArrayList<String> getExtendedKeyUsageExtensions() {
        return extendedKeyUsageExtensions;
    }

    public void setExtendedKeyUsageExtensions(ArrayList<String> extendedKeyUsageExtensions) {
        this.extendedKeyUsageExtensions = extendedKeyUsageExtensions;
    }

    public BigInteger getSerialNumber() {
        return this.serialNumber;
    }

    public void setSerialNumber(BigInteger serialNumber) {
        this.serialNumber = serialNumber;
    }
}
