package com.hirepilot.auth.service.impl;

import com.hirepilot.auth.entity.EmailOtp;
import com.hirepilot.auth.repository.EmailOtpRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class OTPService {

    private final EmailOtpRepository emailOtpRepository;

    private final EmailService emailService;

    @Transactional
    public void sendOtp(String email) {

        String otp = String.valueOf(
                ThreadLocalRandom.current()
                        .nextInt(100000, 999999)
        );

        emailOtpRepository.deleteByEmail(email);

        EmailOtp emailOtp =
                EmailOtp.builder()
                        .email(email)
                        .otp(otp)
                        .createdAt(LocalDateTime.now())
                        .expiresAt(
                                LocalDateTime.now().plusMinutes(10)
                        )
                        .build();

        emailOtpRepository.save(emailOtp);

        emailService.sendOtp(email, otp);
    }

    @Transactional
    public boolean verifyOtp(
            String email,
            String otp
    ) {

        EmailOtp savedOtp =
                emailOtpRepository
                        .findTopByEmailOrderByExpiresAtDesc(email)
                        .orElse(null);

        if (savedOtp == null) {
            return false;
        }

        if (savedOtp.getExpiresAt()
                .isBefore(LocalDateTime.now())) {
            return false;
        }

        if (!savedOtp.getOtp().equals(otp)) {
            return false;
        }

        emailOtpRepository.deleteByEmail(email);

        return true;
    }
}