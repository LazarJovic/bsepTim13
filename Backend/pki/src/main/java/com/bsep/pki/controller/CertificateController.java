package com.bsep.pki.controller;

import com.bsep.pki.dto.CreateCertificateDTO;
import com.bsep.pki.dto.SigningCertificateDTO;
import com.bsep.pki.dto.UserDTO;
import com.bsep.pki.service.CertificateService;
import com.bsep.pki.util.PropertiesConfigurator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    @Autowired
    private CertificateService certificateService;

    @PostMapping
    public ResponseEntity<?> createCertificate(@RequestBody CreateCertificateDTO dto) {

        try {
            this.certificateService.create(dto);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/signing-certificates")
    public ResponseEntity<?> getSigningCertificates() {
        ArrayList<SigningCertificateDTO> retVal = null;

        try {
            retVal = this.certificateService.getCertificatesForSigning();
            return new ResponseEntity<>(retVal, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
}
