package com.hirepilot.auth.service;

import com.hirepilot.auth.dto.request.LoginRequest;
import com.hirepilot.auth.dto.request.RegisterRequest;
import com.hirepilot.auth.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

}