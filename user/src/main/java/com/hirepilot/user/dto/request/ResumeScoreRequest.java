package com.hirepilot.user.dto.request;



import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ResumeScoreRequest(

        @NotNull(message = "resumeId is required")
        Long resumeId,

        @NotBlank(message = "jobDescription is required")
        @Size(min = 50, max = 5000, message = "jobDescription must be 50–5000 characters")
        String jobDescription
) {}