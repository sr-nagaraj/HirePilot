package com.hirepilot.user.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileResponse {

    private Long id;

    private Long userId;

    private String fullName;

    private String headline;

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