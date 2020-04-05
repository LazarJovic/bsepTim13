package com.bsep.pki.util;

import com.bsep.pki.util.keystore.PasswordGenerator;
import org.springframework.util.DefaultPropertiesPersister;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.util.Collections;
import java.util.List;
import java.util.Properties;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class PropertiesConfigurator {

    public PropertiesConfigurator() {}

    public void saveKeyStoreChanges() {
        try {
            Properties props = new Properties();
            props.setProperty("self_signed", PasswordGenerator.generateRandomPassword(15));
            props.setProperty("ca", PasswordGenerator.generateRandomPassword(15));
            props.setProperty("end_entity", PasswordGenerator.generateRandomPassword(15));
            File f = new File("key-store-pass.properties");
            OutputStream out = new FileOutputStream( f );
            DefaultPropertiesPersister p = new DefaultPropertiesPersister();
            p.store(props, out,"");
        } catch (Exception e ) {
            e.printStackTrace();
        }
    }



}
