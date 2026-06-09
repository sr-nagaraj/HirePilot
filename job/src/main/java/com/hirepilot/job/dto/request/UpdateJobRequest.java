package com.hirepilot.job.dto.request;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateJobRequest {

    private String title;

    private String company;

    private String location;

    private String jobType;

    private Integer experienceRequired;

    private BigDecimal salary;

    private String description;
}