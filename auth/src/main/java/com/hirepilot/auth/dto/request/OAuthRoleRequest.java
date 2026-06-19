package com.hirepilot.auth.dto.request;


import com.hirepilot.auth.enums.Role;
import lombok.Data;

@Data
public class OAuthRoleRequest {

    private String email;
    private String fullName;
    private Role role;
}