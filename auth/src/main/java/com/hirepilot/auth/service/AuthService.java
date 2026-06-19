package com.hirepilot.auth.service;

import com.hirepilot.auth.dto.request.LoginRequest;
import com.hirepilot.auth.dto.request.OAuthRoleRequest;
import com.hirepilot.auth.dto.request.RegisterRequest;
import com.hirepilot.auth.dto.request.ResetPasswordRequest;
import com.hirepilot.auth.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse completeOAuth(
            OAuthRoleRequest request
    );

    void sendOtp(
            String email
    );

    void sendForgotPasswordOtp(
            String email
    );

    void resetPassword(
            ResetPasswordRequest request
    );



}