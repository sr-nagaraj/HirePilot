package com.hirepilot.user.exception;




public class ResumeNotFoundException extends RuntimeException {
    public ResumeNotFoundException(Long resumeId) {
        super("Resume not found with id: " + resumeId);
    }
}