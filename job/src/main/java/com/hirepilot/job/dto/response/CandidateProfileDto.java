package com.hirepilot.job.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateProfileDto {
    private Long userId;
    private String fullName;
    private String headline;
    private String location;
    private String profilePicture;
    private String phoneNumber;
    private String email;
    private String education;
    private String bio;
    private String skills;
    private String linkedinUrl;
    private String githubUrl;
    private String websiteUrl;
    private String designation;
    private Integer experience;
}
