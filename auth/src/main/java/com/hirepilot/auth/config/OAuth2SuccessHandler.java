package com.hirepilot.auth.config;

import com.hirepilot.auth.entity.User;
import com.hirepilot.auth.enums.AuthProvider;
import com.hirepilot.auth.enums.Role;
import com.hirepilot.auth.repository.UserRepository;
import com.hirepilot.auth.security.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler
        extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;
    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {

        try {
            OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
            String email = oauthUser.getAttribute("email");
            String name  = oauthUser.getAttribute("name");

            // Null safety
            if (email == null) {
                response.sendRedirect(frontendUrl + "/oauth-success?error=oauth");
                return;
            }

            String safeName = (name != null)
                    ? URLEncoder.encode(name, StandardCharsets.UTF_8)
                    : "";

            Optional<User> existingUser = userRepository.findByEmail(email);

            if (existingUser.isPresent()) {
                // Returning user → JWT → dashboard
                User user = existingUser.get();
                String token = jwtTokenProvider.generateToken(
                        user.getId(),
                        user.getEmail(),
                        user.getRole().name()
                );
                response.sendRedirect(
                        frontendUrl + "/oauth-success"
                                + "?token=" + token
                                + "&role=" + user.getRole().name()
                );
            } else {
                // New user → role selection
                response.sendRedirect(
                        frontendUrl + "/oauth-role-selection"
                                + "?email=" + email
                                + "&name=" + safeName
                );
            }

        } catch (Exception e) {
            // Log and redirect to failure — never show Whitelabel
            System.err.println("OAuth2 success handler error: " + e.getMessage());
            e.printStackTrace();
            response.sendRedirect(frontendUrl + "/login?error=oauth_error");
        }
    }
}