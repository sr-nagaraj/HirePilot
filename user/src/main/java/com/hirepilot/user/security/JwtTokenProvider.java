package com.hirepilot.user.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;

@Component
public class JwtTokenProvider {

    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
    public Long getUserId(String token) {
        return getClaims(token)
                .get("userId", Long.class);
    }

    public String getRole(String token) {
        return getClaims(token)
                .get("role", String.class);
    }

    public String getEmailFromToken(String token) {
        return getClaims(token).getSubject();
    }



    private static final String SECRET_KEY =
            "mySuperSecretKeyForJwtAuthentication123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    private final SecretKey key =
            Keys.hmacShaKeyFor(SECRET_KEY.getBytes());


    public boolean validateToken(String token) {

        try {

            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);

            return true;

        } catch (Exception ex) {

            System.out.println("JWT Validation Error: "
                    + ex.getMessage());

            return false;
        }
    }

}