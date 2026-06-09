package com.hirepilot.user.service.impl;

import com.hirepilot.user.dto.request.UpdateProfileRequest;
import com.hirepilot.user.dto.response.ProfileResponse;
import com.hirepilot.user.entity.Profile;
import com.hirepilot.user.exception.ResourceNotFoundException;
import com.hirepilot.user.repository.ProfileRepository;
import com.hirepilot.user.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl
        implements ProfileService {

    private final ProfileRepository profileRepository;

    @Override
    public ProfileResponse getProfile(Long userId) {

        Profile profile = profileRepository
                .findByUserId(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Profile not found"
                        ));

        return mapToResponse(profile);
    }

    @Override
    public ProfileResponse updateProfile(
            Long userId,
            UpdateProfileRequest request
    ) {

        Profile profile = profileRepository
                .findByUserId(userId)
                .orElseGet(() -> Profile.builder()
                        .userId(userId)
                        .build());

        profile.setFullName(request.getFullName());
        profile.setHeadline(request.getHeadline());
        profile.setBio(request.getBio());
        profile.setCompanyName(request.getCompanyName());
        profile.setDesignation(request.getDesignation());
        profile.setExperience(request.getExperience());
        profile.setSkills(request.getSkills());
        profile.setLinkedinUrl(request.getLinkedinUrl());
        profile.setGithubUrl(request.getGithubUrl());
        profile.setWebsiteUrl(request.getWebsiteUrl());
        profile.setProfilePicture(request.getProfilePicture());

        Profile savedProfile =
                profileRepository.save(profile);

        return mapToResponse(savedProfile);
    }

    private ProfileResponse mapToResponse(
            Profile profile
    ) {

        return ProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUserId())
                .fullName(profile.getFullName())
                .headline(profile.getHeadline())
                .bio(profile.getBio())
                .companyName(profile.getCompanyName())
                .designation(profile.getDesignation())
                .experience(profile.getExperience())
                .skills(profile.getSkills())
                .linkedinUrl(profile.getLinkedinUrl())
                .githubUrl(profile.getGithubUrl())
                .websiteUrl(profile.getWebsiteUrl())
                .profilePicture(profile.getProfilePicture())
                .build();
    }
}