package com.hirepilot.auth.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import jakarta.annotation.PostConstruct;

@Component
public class JwtTokenProvider {

        @Value("${app.jwt.secret}")
        private String secretKey;

        private SecretKey key;

        @PostConstruct
        public void init() {
                this.key = Keys.hmacShaKeyFor(
                                secretKey.getBytes());
        }

        public String generateToken(
                        Long userId,
                        String email,
                        String role) {

                return Jwts.builder()
                                .subject(email)

                                .claim("userId", userId)
                                .claim("role", role)

                                .issuedAt(new Date())

                                .expiration(
                                                new Date(
                                                                System.currentTimeMillis()
                                                                                + 604800000L // 1 week
                                                ))

                                .signWith(key)
                                .compact();
        }

        private Claims getClaims(
                        String token) {

                return Jwts.parser()
                                .verifyWith(key)
                                .build()
                                .parseSignedClaims(token)
                                .getPayload();
        }

        public String getEmailFromToken(
                        String token) {
                return getClaims(token)
                                .getSubject();
        }

        public Long getUserId(String token) {
                Number userId = getClaims(token).get("userId", Number.class);
                return userId != null ? userId.longValue() : null;
        }

        public String getRole(
                        String token) {
                return getClaims(token)
                                .get("role", String.class);
        }

        public boolean validateToken(
                        String token) {

                try {

                        getClaims(token);

                        return true;

                } catch (Exception ex) {

                        return false;
                }
        }
}