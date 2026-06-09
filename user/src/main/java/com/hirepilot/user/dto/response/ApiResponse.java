package com.hirepilot.user.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiResponse {

    private boolean success;

    private String message;
}