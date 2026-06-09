package com.hirepilot.auth.exception;

public class InvalidCredentialsException
        extends RuntimeException {

    public InvalidCredentialsException(String message) {
        super(message);
    }
}