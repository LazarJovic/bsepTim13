package com.bsep.pki.util;

import java.security.*;

public class MyKeyGenerator {

    public KeyPair generateKeyPair(String keyAlgorithm) {
        try {
            KeyPairGenerator keyGen = KeyPairGenerator.getInstance(keyAlgorithm);
            SecureRandom random = SecureRandom.getInstance("SHA1PRNG", "SUN");
            keyGen.initialize(2048, random);
            return keyGen.generateKeyPair();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (NoSuchProviderException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

}
