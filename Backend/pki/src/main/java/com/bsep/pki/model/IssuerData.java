package com.bsep.pki.model;

import org.bouncycastle.asn1.x500.X500Name;

import java.security.KeyPair;
import java.security.PrivateKey;

public class IssuerData {

    private X500Name x500name;
    private KeyPair keyPair;

    public IssuerData() {}

    public IssuerData(X500Name x500name, KeyPair keyPair) {
        this.x500name = x500name;
        this.keyPair = keyPair;
    }

    public X500Name getX500name() {
        return x500name;
    }

    public void setX500name(X500Name x500name) {
        this.x500name = x500name;
    }

    public KeyPair getKeyPair() {
        return keyPair;
    }

    public void setKeyPair(KeyPair keyPair) {
        this.keyPair = keyPair;
    }
}
