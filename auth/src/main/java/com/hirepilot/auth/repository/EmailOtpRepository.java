package com.hirepilot.auth.repository;

import com.hirepilot.auth.entity.EmailOtp;
import com.hirepilot.auth.service.impl.EmailService;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmailOtpRepository
        extends JpaRepository<EmailOtp, Long> {

    Optional<EmailOtp> findByEmail(String email);

    Optional<EmailOtp> findTopByEmailOrderByExpiresAtDesc(
            String email
    );

    void deleteByEmail(String email);


}