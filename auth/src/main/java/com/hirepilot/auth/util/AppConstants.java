package com.hirepilot.auth.util;

public class AppConstants {

    private AppConstants() {
    }

    public static final String AUTH_HEADER = "Authorization";

    public static final String TOKEN_PREFIX = "Bearer ";

    public static final String ROLE_PREFIX = "ROLE_";

    public static final long JWT_EXPIRATION = 604800000;

    public static final String DEFAULT_PAGE_NUMBER = "0";

    public static final String DEFAULT_PAGE_SIZE = "10";
}