package com.hirepilot.job.dto.request;

import com.hirepilot.job.enums.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateApplicationStatusRequest {

    @NotNull(message = "Status is required")
    private ApplicationStatus status;
}