package com.hirepilot.auth.config;

import com.hirepilot.auth.security.*;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    private final JwtAuthenticationEntryPoint authenticationEntryPoint;

    private final OAuth2SuccessHandler
            oAuth2SuccessHandler;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;



    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                .csrf(csrf -> csrf.disable())


                .sessionManagement(
                        session ->
                                session.sessionCreationPolicy(
                                        SessionCreationPolicy.IF_REQUIRED
                                )
                )

                .exceptionHandling(
                        exception ->
                                exception.authenticationEntryPoint(
                                        authenticationEntryPoint
                                )
                )

                .oauth2Login(oauth ->
                        oauth
                                .successHandler(
                                        oAuth2SuccessHandler
                                )
                                .failureUrl(
                                        frontendUrl + "/oauth-success?error=oauth"
                                )
                )

                .authorizeHttpRequests(
                        auth -> auth

                                .requestMatchers(
                                        "/api/auth/**",
                                        "/oauth2/**",
                                        "/login/oauth2/**",
                                        "/swagger-ui/**",
                                        "/v3/api-docs/**"
                                )

                                .permitAll()

                                .anyRequest()

                                .authenticated()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }



    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {

        return config.getAuthenticationManager();
    }
}