package com.hirepilot.auth.controller;

import com.hirepilot.auth.dto.request.*;
import com.hirepilot.auth.dto.response.AuthResponse;
import com.hirepilot.auth.service.AuthService;
import com.hirepilot.auth.service.impl.OTPService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor

public class AuthController {

    private final AuthService authService;
    private final OTPService otpService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {

        AuthResponse response =
                authService.register(request);

        return new ResponseEntity<>(
                response,
                HttpStatus.CREATED
        );
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {

        AuthResponse response =
                authService.login(request);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {

        return ResponseEntity.ok(
                "Auth Service is running successfully"
        );
    }


    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(
            @RequestBody SendOtpRequest request
    ) {

        authService.sendOtp(
                request.getEmail()
        );

        return ResponseEntity.ok(
                "OTP sent successfully"
        );
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Boolean> verifyOtp(
            @RequestBody VerifyOtpRequest request
    ) {

        boolean verified =
              otpService.verifyOtp(
                        request.getEmail(),
                        request.getOtp()
                );

        return ResponseEntity.ok(
                verified
        );
    }

    @PostMapping("/forgot-password/send-otp")
    public ResponseEntity<String> sendForgotPasswordOtp(
            @RequestBody SendOtpRequest request
    ) {

        authService.sendForgotPasswordOtp(
                request.getEmail()
        );

        return ResponseEntity.ok(
                "OTP sent successfully"
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestBody ResetPasswordRequest request
    ) {

        authService.resetPassword(
                request
        );

        return ResponseEntity.ok(
                "Password reset successful"
        );
    }

    @PostMapping("/oauth/complete")
    public ResponseEntity<AuthResponse> completeOAuth(
            @RequestBody OAuthRoleRequest request
    ) {

        AuthResponse response =
                authService.completeOAuth(request);

        return ResponseEntity.ok(response);
    }
}