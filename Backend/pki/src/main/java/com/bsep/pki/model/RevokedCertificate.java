package com.bsep.pki.model;

import javax.persistence.*;

@Entity
@Table(name = "revoked-certificates")
public class RevokedCertificate {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column(name = "alias")
    private String alias;

    public RevokedCertificate() { }

    public RevokedCertificate(Long id, String alias) {
        this.id = id;
        this.alias = alias;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAlias() {
        return alias;
    }

    public void setAlias(String alias) {
        this.alias = alias;
    }
}
