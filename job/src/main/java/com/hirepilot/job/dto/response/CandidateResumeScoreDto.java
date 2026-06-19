package com.hirepilot.job.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateResumeScoreDto {
    private Integer overallScore;
    private Integer skillsMatch;
    private Integer experienceMatch;
    private Integer educationMatch;
}
