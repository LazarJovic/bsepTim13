package com.bsep.pki.model;

import javax.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column(name = "given_name")
    private String givenName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "common_name")
    private String commonName;

    @Column(name = "country")
    private String country;

    @Column(name = "organization")
    private String organization;

    @Column(name = "organization_unit")
    private String organizationUnit;

    @Column(name = "locality")
    private String locality;

    @Column(name = "email")
    private String email;

    @Column(name = "isCA")
    private boolean isCA;

    @Column( name = "numberOfCert")
    private Long numberOfCert;

    public User() {}

    public User(String givenName, String lastName, String commonName, String country, String organization,
                String organizationUnit, String locality, String email, boolean isCA, Long numberOfCert) {
        this.givenName = givenName;
        this.lastName = lastName;
        this.commonName = commonName;
        this.country = country;
        this.organization = organization;
        this.organizationUnit = organizationUnit;
        this.locality = locality;
        this.email = email;
        this.isCA = isCA;
        this.numberOfCert = numberOfCert;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGivenName() {
        return givenName;
    }

    public void setGivenName(String givenName) {
        this.givenName = givenName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getCommonName() {
        return commonName;
    }

    public void setCommonName(String commonName) {
        this.commonName = commonName;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getOrganization() {
        return organization;
    }

    public void setOrganization(String organization) {
        this.organization = organization;
    }

    public String getOrganizationUnit() {
        return organizationUnit;
    }

    public void setOrganizationUnit(String organizationUnit) {
        this.organizationUnit = organizationUnit;
    }

    public String getLocality() {
        return locality;
    }

    public void setLocality(String locality) {
        this.locality = locality;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isCA() {
        return isCA;
    }

    public void setCA(boolean CA) {
        isCA = CA;
    }

    public Long getNumberOfCert() {
        return numberOfCert;
    }

    public void setNumberOfCert(Long numberOfCert) {
        this.numberOfCert = numberOfCert;
    }
}
