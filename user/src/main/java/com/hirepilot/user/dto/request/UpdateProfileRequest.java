package com.hirepilot.user.dto.request;

import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateProfileRequest {
    private String fullName;

    @Size(max = 100, message = "Headline cannot exceed 100 characters")
    private String headline;

    @Size(max = 2000, message = "Bio cannot exceed 2000 characters")
    private String bio;

    private String companyName;

    private String designation;

    private Integer experience;

    private String skills;

    private String linkedinUrl;

    private String githubUrl;

    private String websiteUrl;

    private String profilePicture;
}