package com.bsep.pki.controller;

import com.bsep.pki.dto.*;
import com.bsep.pki.service.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.websocket.server.PathParam;
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

    @PutMapping
    public ResponseEntity<?> certificateStatus(@RequestBody String alias) {
        try {
            CertificateStatusDTO certificateStatus = this.certificateService.checkStatus(alias);
            return new ResponseEntity<>(certificateStatus, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
}
