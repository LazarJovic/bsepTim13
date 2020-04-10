package com.bsep.pki.repository;

import com.bsep.pki.model.RevokedCertificate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RevokedCertificateRepository extends JpaRepository<RevokedCertificate, Long> {
}
