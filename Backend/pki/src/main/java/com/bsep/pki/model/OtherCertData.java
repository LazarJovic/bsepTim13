package com.bsep.pki.model;

import org.bouncycastle.asn1.x509.KeyPurposeId;

import java.math.BigInteger;
import java.time.LocalDate;
import java.util.ArrayList;

public class OtherCertData {

    private LocalDate startValidationDate;
    private LocalDate endValidationDate;
    private String signatureAlgorithm;
    private BigInteger serialNumber;
    private ArrayList<Integer> keyUsageValues;
    private KeyPurposeId[] extendedKeyUsageValues;
    private boolean keyUsageChecked;
    private boolean extendedKeyUsageChecked;

    public OtherCertData() {
        this.keyUsageValues = new ArrayList<>();
    }

    public OtherCertData(LocalDate startValidationDate, LocalDate endValidationDate, String signatureAlgorithm,
                         ArrayList<String> extendedKeyUsageExtensions,
                         BigInteger serialNumber, ArrayList<Integer> keyUsageValues, KeyPurposeId[] extendedKeyUsageValues,
                         boolean keyUsageChecked, boolean extendedKeyUsageChecked) {
        this.startValidationDate = startValidationDate;
        this.endValidationDate = endValidationDate;
        this.signatureAlgorithm = signatureAlgorithm;
        this.serialNumber = serialNumber;
        this.keyUsageValues = keyUsageValues;
        this.extendedKeyUsageValues = extendedKeyUsageValues;
        this.keyUsageChecked = keyUsageChecked;
        this.extendedKeyUsageChecked = extendedKeyUsageChecked;
    }

    public OtherCertData(String startValidationDate, String endValidationDate, String signatureAlgorithm,
                         ArrayList<Integer> keyUsageValues, BigInteger serialNumber,
                         KeyPurposeId[] extendedKeyUsageValues, boolean keyUsageChecked, boolean extendedKeyUsageChecked) {
        this.startValidationDate = LocalDate.parse(startValidationDate);
        this.endValidationDate = LocalDate.parse(endValidationDate);
        this.signatureAlgorithm = signatureAlgorithm;
        this.keyUsageValues = keyUsageValues;
        this.serialNumber = serialNumber;
        this.extendedKeyUsageValues = extendedKeyUsageValues;
        this.keyUsageChecked = keyUsageChecked;
        this.extendedKeyUsageChecked = extendedKeyUsageChecked;
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

    public KeyPurposeId[] getExtendedKeyUsageValues() {
        return extendedKeyUsageValues;
    }

    public void setExtendedKeyUsageValues(KeyPurposeId[] extendedKeyUsageValues) {
        this.extendedKeyUsageValues = extendedKeyUsageValues;
    }

    public BigInteger getSerialNumber() {
        return this.serialNumber;
    }

    public void setSerialNumber(BigInteger serialNumber) {
        this.serialNumber = serialNumber;
    }

    public ArrayList<Integer> getKeyUsageValues() {
        return keyUsageValues;
    }

    public void setKeyUsageValues(ArrayList<Integer> keyUsageValues) {
        this.keyUsageValues = keyUsageValues;
    }

    public boolean isKeyUsageChecked() {
        return keyUsageChecked;
    }

    public void setKeyUsageChecked(boolean keyUsageChecked) {
        this.keyUsageChecked = keyUsageChecked;
    }

    public boolean isExtendedKeyUsageChecked() {
        return extendedKeyUsageChecked;
    }

    public void setExtendedKeyUsageChecked(boolean extendedKeyUsageChecked) {
        this.extendedKeyUsageChecked = extendedKeyUsageChecked;
    }
}
