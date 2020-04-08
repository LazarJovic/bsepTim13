package com.bsep.pki.util;

import com.bsep.pki.util.keystore.PasswordGenerator;
import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.configuration.PropertiesConfiguration;
import org.springframework.util.DefaultPropertiesPersister;

import java.io.*;
import java.util.Properties;

public class PropertiesConfigurator {

    public static final String SELF_SIGNED = "self-signed";
    public static final String CA = "ca";
    public static final String END_ENTITY = "end-entity";
    public static final int PASS_LENGTH = 15;
    public static final String KEY_STORE_PROP = "key-store-pass.properties";
    public static final String ALIAS_PASS_PROP = "alias-pass.properties";

    public PropertiesConfigurator() {}

//    public void generateKeyStoreProperties() {
//        try {
//            Properties props = new Properties();
//            props.setProperty(SELF_SIGNED, PasswordGenerator.generateRandomPassword(PASS_LENGTH));
//            props.setProperty(CA, PasswordGenerator.generateRandomPassword(PASS_LENGTH));
//            props.setProperty(END_ENTITY, PasswordGenerator.generateRandomPassword(PASS_LENGTH));
//            File f = new File(KEY_STORE_PROP);
//            FileOutputStream out = new FileOutputStream(f);
//            DefaultPropertiesPersister p = new DefaultPropertiesPersister();
//            p.store(props, out,"");
//        } catch (Exception e ) {
//            e.printStackTrace();
//        }
//    }

        public void firstAliasKeyPass(String alias, String keyPass) {
        try {
            Properties props = new Properties();
            props.setProperty(alias, keyPass);
            File f = new File(ALIAS_PASS_PROP);
            FileOutputStream out = new FileOutputStream(f);
            DefaultPropertiesPersister p = new DefaultPropertiesPersister();
            p.store(props, out,"");
        } catch (Exception e ) {
            e.printStackTrace();
        }
    }

    public void putAliasKeyPass(String alias, String keyPass) throws IOException {

        try {
            PropertiesConfiguration properties = new PropertiesConfiguration(ALIAS_PASS_PROP);
            properties.setProperty(alias, keyPass);
            properties.save();
        } catch (ConfigurationException e) {
            e.printStackTrace();
        }
    }



    public String readValueFromKeyStoreProp(String key) throws IOException {

        InputStream inputStream = null;
        String result = "";
        try {
            Properties prop = new Properties();

            inputStream = getClass().getClassLoader().getResourceAsStream(KEY_STORE_PROP);

            if (inputStream != null) {
                prop.load(inputStream);
            } else {
                throw new FileNotFoundException("property file '" + KEY_STORE_PROP + "' not found in the classpath");
            }

            result = prop.getProperty(key);

        } catch (Exception e) {
            System.out.println("Exception: " + e);
        } finally {
            inputStream.close();
        }
        return result;
    }

    public String readValueFromAliasPassProp(String key) throws IOException {

        FileInputStream inputStream = null;
        String result = "";
        try {
            File f = new File(ALIAS_PASS_PROP);
            inputStream = new FileInputStream(f);
            Properties prop = new Properties();

            if (inputStream != null) {
                prop.load(inputStream);
            } else {
                throw new FileNotFoundException("property file '" + ALIAS_PASS_PROP + "' not found in the classpath");
            }

            result = prop.getProperty(key);

        } catch (Exception e) {
            System.out.println("Exception: " + e);
        } finally {
            inputStream.close();
        }
        return result;
    }



}
