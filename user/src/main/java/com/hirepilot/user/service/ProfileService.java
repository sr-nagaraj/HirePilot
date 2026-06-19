package com.hirepilot.user.service;

import com.hirepilot.user.dto.request.UpdateProfileRequest;
import com.hirepilot.user.dto.response.ProfileResponse;
import org.springframework.web.multipart.MultipartFile;

public interface ProfileService {

    ProfileResponse getProfile(Long userId);

    ProfileResponse updateProfile(
            Long userId,
            UpdateProfileRequest request
    );

    String uploadProfilePicture(
            Long userId,
            MultipartFile file
    );
}