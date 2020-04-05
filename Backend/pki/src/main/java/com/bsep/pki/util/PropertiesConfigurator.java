package com.bsep.pki.util;

import com.bsep.pki.util.keystore.PasswordGenerator;
import org.springframework.util.DefaultPropertiesPersister;

import java.io.*;
import java.util.Collections;
import java.util.List;
import java.util.Properties;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class PropertiesConfigurator {

    public static final String SELF_SIGNED = "self-signed";
    public static final String CA = "ca";
    public static final String END_ENTITY = "end-entity";
    public static final int PASS_LENGTH = 15;
    public static final String KEY_STORE_PROP = "E:\\BsepPKI\\bsepTim13\\Backend\\pki\\src\\main\\resources\\key-store-pass.properties";

    public PropertiesConfigurator() {}

    public void generateKeyStoreProperties() {
        try {
            Properties props = new Properties();
            props.setProperty(SELF_SIGNED, PasswordGenerator.generateRandomPassword(PASS_LENGTH));
            props.setProperty(CA, PasswordGenerator.generateRandomPassword(PASS_LENGTH));
            props.setProperty(END_ENTITY, PasswordGenerator.generateRandomPassword(PASS_LENGTH));
            File f = new File(KEY_STORE_PROP);
            FileOutputStream out = new FileOutputStream( f );
            DefaultPropertiesPersister p = new DefaultPropertiesPersister();
            p.store(props, out,"");
        } catch (Exception e ) {
            e.printStackTrace();
        }
    }

    public String readValueFromKeyStoreProp(String key) throws IOException {

        InputStream inputStream = null;
        String result = "";
        try {
            Properties prop = new Properties();

            inputStream = getClass().getClassLoader().getResourceAsStream("key-store-pass.properties");

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



}
