package com.hirepilot.user.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeUploadRequest {

    private String title;

    private String description;
}