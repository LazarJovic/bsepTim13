package com.bsep.pki.service;

import com.bsep.pki.dto.OverviewCertificateDTO;
import com.bsep.pki.model.RevokedCertificate;
import com.bsep.pki.repository.RevokedCertificateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RevokedCertificateService {

    @Autowired
    private RevokedCertificateRepository revokedCertificateRepository;

    public RevokedCertificateService() { }

    public RevokedCertificate revokeCertificate(OverviewCertificateDTO dto) {

        


        return null;
    }
}
