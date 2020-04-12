package com.bsep.pki.model;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;

@Entity
@Table(name = "templates")
public class Template {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column(name = "signature_algorithm")
    private String signatureAlgorithm;

    @Column(name = "key_algorithm")
    private String keyAlgorithm;

    @Column(name = "key_usage")
    private ArrayList<String> keyUsage;

    @Column(name = "extended_key_usage")
    private ArrayList<String> extendedKeyUsage;

    @Column(name = "name")
    private String name;

    @Column(name = "timestamp")
    private LocalDateTime timestamp;

    public Template() {
    }

    public Template(String signatureAlgorithm, String keyAlgorithm, ArrayList<String> keyUsage, ArrayList<String> extendedKeyUsage, String name, LocalDateTime timestamp) {
        this.signatureAlgorithm = signatureAlgorithm;
        this.keyAlgorithm = keyAlgorithm;
        this.keyUsage = keyUsage;
        this.extendedKeyUsage = extendedKeyUsage;
        this.name = name;
        this.timestamp = timestamp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSignatureAlgorithm() {
        return signatureAlgorithm;
    }

    public void setSignatureAlgorithm(String signatureAlgorithm) {
        this.signatureAlgorithm = signatureAlgorithm;
    }

    public String getKeyAlgorithm() {
        return keyAlgorithm;
    }

    public void setKeyAlgorithm(String keyAlgorithm) {
        this.keyAlgorithm = keyAlgorithm;
    }

    public ArrayList<String> getKeyUsage() {
        return keyUsage;
    }

    public void setKeyUsage(ArrayList<String> keyUsage) {
        this.keyUsage = keyUsage;
    }

    public ArrayList<String> getExtendedKeyUsage() {
        return extendedKeyUsage;
    }

    public void setExtendedKeyUsage(ArrayList<String> extendedKeyUsage) {
        this.extendedKeyUsage = extendedKeyUsage;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
