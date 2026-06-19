package com.hirepilot.job.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateResumeDto {
    private Long resumeId;
    private String fileName;
    private String fileUrl;
    private LocalDateTime uploadedAt;
}
