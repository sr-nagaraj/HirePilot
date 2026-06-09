package com.hirepilot.job.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateJobRequest {

    @NotBlank(message = "Job title is required")
    private String title;

    @NotBlank(message = "Company name is required")
    private String company;

    private String location;

    private String jobType;

    @NotNull(message = "Experience is required")
    private Integer experienceRequired;

    private BigDecimal salary;

    @NotBlank(message = "Job description is required")
    private String description;
}