package com.bsep.pki.dto;

public class UserDTO {

    public Long id;
    public String givenName;
    public String lastName;
    public String commonName;
    public String country;
    public String organization;
    public String organizationalUnit;
    public String locality;
    public String email;

    public UserDTO() {}

    public UserDTO(Long id, String givenName, String lastName, String commonName, String country, String organization,
                   String organizationalUnit, String locality, String email) {
        this.id = id;
        this.givenName = givenName;
        this.lastName = lastName;
        this.commonName = commonName;
        this.country = country;
        this.organization = organization;
        this.organizationalUnit = organizationalUnit;
        this.locality = locality;
        this.email = email;
    }

}
