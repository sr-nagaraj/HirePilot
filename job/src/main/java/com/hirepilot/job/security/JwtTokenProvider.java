package com.hirepilot.job.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;

@Component
public class JwtTokenProvider {

    private static final String SECRET_KEY =
            "mySuperSecretKeyForJwtAuthentication123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    private final SecretKey key =
            Keys.hmacShaKeyFor(
                    SECRET_KEY.getBytes()
            );

    private Claims getClaims(String token) {

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

        Number userId =
                getClaims(token)
                        .get("userId", Number.class);

        return userId.longValue();
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

            ex.printStackTrace();

            return false;
        }
    }
}