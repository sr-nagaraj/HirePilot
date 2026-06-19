package com.hirepilot.user.exception;




public class OpenAIProcessingException extends RuntimeException {
    public OpenAIProcessingException(String message, Throwable cause) {
        super(message, cause);
    }
    public OpenAIProcessingException(String message) {
        super(message);
    }
}
