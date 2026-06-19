package com.hirepilot.auth.dto.request;

import lombok.Data;

@Data
public class VerifyOtpRequest {

    private String email;

    private String otp;
}