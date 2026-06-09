package com.hirepilot.auth.service.impl;

import com.hirepilot.auth.dto.request.LoginRequest;
import com.hirepilot.auth.dto.request.RegisterRequest;
import com.hirepilot.auth.dto.response.AuthResponse;
import com.hirepilot.auth.entity.User;
import com.hirepilot.auth.enums.Role;
import com.hirepilot.auth.exception.InvalidCredentialsException;
import com.hirepilot.auth.exception.UserAlreadyExistsException;
import com.hirepilot.auth.repository.UserRepository;
import com.hirepilot.auth.security.JwtTokenProvider;
import com.hirepilot.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException(
                    "User already exists with email: " + request.getEmail()
            );
        }

        User savedUser = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .role(request.getRole())
                .build();

        userRepository.save(savedUser);

        String token =
                jwtTokenProvider.generateToken(
                        savedUser.getId(),
                        savedUser.getEmail(),
                        savedUser.getRole().name()
                );
        return AuthResponse.builder()
                .token(token)
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .message("User registered successfully")
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new InvalidCredentialsException(
                                "Invalid email or password"
                        ));

        boolean passwordMatches =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );

        if (!passwordMatches) {
            throw new InvalidCredentialsException(
                    "Invalid email or password"
            );
        }

        String token =
                jwtTokenProvider.generateToken(
                        user.getId(),
                        user.getEmail(),
                        user.getRole().name()
                );

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .role(user.getRole())
                .message("Login successful")
                .build();
    }
}
