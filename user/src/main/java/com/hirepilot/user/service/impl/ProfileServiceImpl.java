package com.hirepilot.user.service.impl;

import com.hirepilot.user.dto.request.UpdateProfileRequest;
import com.hirepilot.user.dto.response.ProfileResponse;
import com.hirepilot.user.entity.Profile;
import com.hirepilot.user.exception.ResourceNotFoundException;
import com.hirepilot.user.repository.ProfileRepository;
import com.hirepilot.user.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

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
    public String uploadProfilePicture(
            Long userId,
            MultipartFile file
    ) {

        Profile profile =
                profileRepository
                        .findByUserId(userId)
                        .orElseGet(
                                () -> profileRepository.save(
                                        Profile.builder()
                                                .userId(userId)
                                                .build()
                                )
                        );

        validateImage(file);

        String filePath =
                saveImage(file);

        profile.setProfilePicture(filePath);

        profileRepository.save(profile);

        return filePath;
    }


    private void validateImage(
            MultipartFile file
    ) {

        if (file.isEmpty()) {
            throw new RuntimeException(
                    "Image is empty"
            );
        }

        String contentType =
                file.getContentType();

        if (contentType == null ||
                !(contentType.equals("image/png")
                        || contentType.equals("image/jpeg")
                        || contentType.equals("image/jpg"))) {

            throw new RuntimeException(
                    "Only PNG/JPG allowed"
            );
        }
    }

    private String saveImage(
            MultipartFile file
    ) {

        try {

            String filename =
                    UUID.randomUUID()
                            + "-"
                            + file.getOriginalFilename();

            Path uploadPath =
                    Paths.get(
                            "uploads/profile-pictures"
                    );

            Files.createDirectories(
                    uploadPath
            );

            Path target =
                    uploadPath.resolve(
                            filename
                    );

            Files.copy(
                    file.getInputStream(),
                    target,
                    StandardCopyOption.REPLACE_EXISTING
            );

            return target.toString().replace("\\", "/");

        } catch (Exception ex) {

            throw new RuntimeException(
                    "Failed to save image",
                    ex
            );
        }
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
        profile.setLocation(request.getLocation());
        profile.setEducation(request.getEducation());
        profile.setPhoneNumber(request.getPhoneNumber());

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
                .location(profile.getLocation())
                .education(profile.getEducation())
                .phoneNumber(profile.getPhoneNumber())
                .build();
    }
}