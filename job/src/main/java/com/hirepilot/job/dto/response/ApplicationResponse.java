package com.hirepilot.job.dto.response;

import com.hirepilot.job.enums.ApplicationStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationResponse {

    private Long id;

    private Long jobId;

    private Long candidateId;

    private Long resumeId;

    private ApplicationStatus status;

    private String jobTitle;

    private String companyName;

    private Boolean jobDeleted;

    private LocalDateTime appliedAt;

    private String candidateName;
}