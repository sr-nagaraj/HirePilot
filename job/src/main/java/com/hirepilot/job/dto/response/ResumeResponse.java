package com.hirepilot.job.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeResponse {

    private Long id;

    private String fileName;

    private String fileUrl;

    private Long fileSize;

    private String contentType;

    private LocalDateTime uploadedAt;
}
