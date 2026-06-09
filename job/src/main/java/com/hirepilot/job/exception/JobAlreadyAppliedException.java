package com.hirepilot.job.exception;

public class JobAlreadyAppliedException
        extends RuntimeException {

    public JobAlreadyAppliedException(String message) {
        super(message);
    }
}