package com.hirepilot.user.service;

import com.hirepilot.user.dto.request.UpdateProfileRequest;
import com.hirepilot.user.dto.response.ProfileResponse;

public interface ProfileService {

    ProfileResponse getProfile(Long userId);

    ProfileResponse updateProfile(
            Long userId,
            UpdateProfileRequest request
    );
}