package com.hirepilot.auth.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendOtp(
            String email,
            String otp
    ) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(email);

        message.setSubject(
                "HirePilot Email Verification"
        );

        message.setText(
                """
                Welcome to HirePilot!

                Your OTP is:

                %s

                This OTP is valid for 10 minutes.
                """
                        .formatted(otp)
        );

        mailSender.send(message);
    }
}