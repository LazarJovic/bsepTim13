package com.bsep.pki.controller;

import com.bsep.pki.dto.SigningCertificateDTO;
import com.bsep.pki.dto.UserDTO;
import com.bsep.pki.service.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    @Autowired
    private CertificateService certificateService;

    @GetMapping("/signing-certificates")
    public ResponseEntity<?> getSigningCertificates() {
        ArrayList<SigningCertificateDTO> retVal = null;

        try {
            retVal = this.certificateService.getSelfSignedCertificatesForSigning();
            return new ResponseEntity<>(retVal, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
}
