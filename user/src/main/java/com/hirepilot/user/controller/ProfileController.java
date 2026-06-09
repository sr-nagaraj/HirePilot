package com.hirepilot.user.controller;

import com.hirepilot.user.dto.request.UpdateProfileRequest;
import com.hirepilot.user.dto.response.ProfileResponse;
import com.hirepilot.user.security.CustomUserDetails;
import com.hirepilot.user.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor

public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> getMyProfile(
            Authentication authentication
    ) {
        System.out.println(authentication);
        System.out.println(authentication.getPrincipal());

        CustomUserDetails user =
                (CustomUserDetails) authentication.getPrincipal();

        System.out.println("User ID = " + user.getUserId());

        Long userId = user.getUserId();

        ProfileResponse response =
                profileService.getProfile(userId);

        return ResponseEntity.ok(response);
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<ProfileResponse> getProfileByUserId(
            @PathVariable Long userId
    ) {

        return ResponseEntity.ok(
                profileService.getProfile(userId)
        );
    }

    @PutMapping("/me")
    public ResponseEntity<ProfileResponse> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            Authentication authentication
    ) {

        CustomUserDetails user =
                (CustomUserDetails)
                        authentication.getPrincipal();

        Long userId = user.getUserId();

        ProfileResponse response =
                profileService.updateProfile(
                        userId,
                        request
                );

        return ResponseEntity.ok(response);
    }
}