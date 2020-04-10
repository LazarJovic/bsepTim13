package com.bsep.pki.controller;

import com.bsep.pki.dto.CreateCertificateDTO;
import com.bsep.pki.dto.OverviewCertificateDTO;
import com.bsep.pki.dto.SigningCertificateDTO;
import com.bsep.pki.dto.UserDTO;
import com.bsep.pki.model.RevokedCertificate;
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
            return new ResponseEntity<>(retVal, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/signing-certificates-overview")
    public ResponseEntity<?> getSigningCertificatesOverview() {
        ArrayList<OverviewCertificateDTO> retVal = null;
        try {
            retVal = this.certificateService.getSigningCertificatesOverview();
            return new ResponseEntity<>(retVal, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/end-entity-certificates-overview")
    public ResponseEntity<?> getEndEntityCertificatesOverview() {
        ArrayList<OverviewCertificateDTO> retVal = null;
        try {
            retVal = this.certificateService.getEndEntityCertificatesOverview();
            return new ResponseEntity<>(retVal, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/download")
    public ResponseEntity<?> downloadCertificate(@RequestBody OverviewCertificateDTO dto) {
        try {
            boolean retVal = this.certificateService.downloadCertificate(dto);
            return new ResponseEntity<>(retVal, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
}
