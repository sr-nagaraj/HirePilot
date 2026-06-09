package com.hirepilot.auth.util;

public class JwtUtil {

    private JwtUtil() {
    }

    public static String extractTokenFromHeader(
            String authHeader
    ) {

        if (authHeader != null &&
                authHeader.startsWith("Bearer ")) {

            return authHeader.substring(7);
        }

        return null;
    }
}