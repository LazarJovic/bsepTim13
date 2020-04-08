package com.bsep.pki.util.keystore;

import java.io.*;
import java.security.*;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;

public class KeyStoreWriter {

    private KeyStore keyStore;

    public KeyStoreWriter() {
        try {
            keyStore = KeyStore.getInstance("JKS", "SUN");
        } catch (KeyStoreException e) {
            e.printStackTrace();
        } catch (NoSuchProviderException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public KeyStore loadKeyStore(String fileName, char[] password) {
        try {
            File f = new File(fileName);
            if(fileName != null && f.exists()) {
                keyStore.load(new FileInputStream(fileName), password);
                return this.keyStore;
            } else {
                keyStore.load(null, password);
                return this.keyStore;
            }
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (CertificateException e) {
            e.printStackTrace();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    public void saveKeyStore(String fileName, char[] password) {
        try {
            keyStore.store(new FileOutputStream(fileName), password);
        } catch (KeyStoreException e) {
            e.printStackTrace();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (CertificateException e) {
            e.printStackTrace();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void write(String alias, PrivateKey privateKey, String password, X509Certificate certificate) {
        try {
            keyStore.setKeyEntry(alias, privateKey, password.toCharArray(), (java.security.cert.X509Certificate[]) new X509Certificate[] {certificate});
        } catch (KeyStoreException e) {
            e.printStackTrace();
        }
    }

    public KeyStore getKeyStore() {
        return this.keyStore;
    }

}
