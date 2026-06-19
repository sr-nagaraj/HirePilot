package com.hirepilot.job.dto.response;

import com.hirepilot.job.enums.ApplicationStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicantDetailsResponse {
    private Long applicationId;
    private Long userId;
    private CandidateProfileDto profile;
    private CandidateResumeDto resume;
    private CandidateResumeScoreDto resumeScore;
    private ApplicationStatus applicationStatus;
    private LocalDateTime appliedDate;
}
