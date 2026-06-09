package com.hirepilot.job.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplyJobRequest {

    @NotNull(message = "Resume ID is required")
    private Long resumeId;
}