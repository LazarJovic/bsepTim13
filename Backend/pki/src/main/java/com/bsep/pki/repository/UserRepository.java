package com.bsep.pki.repository;

import com.bsep.pki.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
