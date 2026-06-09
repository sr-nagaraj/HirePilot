package com.hirepilot.auth.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private static final String SECRET_KEY =
            "mySuperSecretKeyForJwtAuthentication123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    private final SecretKey key =
            Keys.hmacShaKeyFor(
                    SECRET_KEY.getBytes()
            );

    public String generateToken(
            Long userId,
            String email,
            String role
    ) {

        return Jwts.builder()
                .subject(email)

                .claim("userId", userId)
                .claim("role", role)

                .issuedAt(new Date())

                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + 86400000
                        )
                )

                .signWith(key)
                .compact();
    }

    private Claims getClaims(
            String token
    ) {

        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String getEmailFromToken(
            String token
    ) {
        return getClaims(token)
                .getSubject();
    }

    public Long getUserId(
            String token
    ) {
        return getClaims(token)
                .get("userId", Long.class);
    }

    public String getRole(
            String token
    ) {
        return getClaims(token)
                .get("role", String.class);
    }

    public boolean validateToken(
            String token
    ) {

        try {

            getClaims(token);

            return true;

        } catch (Exception ex) {

            return false;
        }
    }
}