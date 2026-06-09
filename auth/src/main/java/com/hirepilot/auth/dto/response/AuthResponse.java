package com.hirepilot.auth.dto.response;

import com.hirepilot.auth.enums.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String token;

    private String email;

    private Role role;

    private String message;
}