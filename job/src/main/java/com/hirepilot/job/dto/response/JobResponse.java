package com.hirepilot.job.dto.response;

import com.hirepilot.job.enums.JobStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobResponse {

    private Long id;

    private Long recruiterId;

    private String title;

    private String company;

    private String location;

    private String jobType;

    private Integer experienceRequired;

    private BigDecimal salary;

    private String description;

    private JobStatus status;

    private Boolean deleted;

    private LocalDateTime createdAt;
}