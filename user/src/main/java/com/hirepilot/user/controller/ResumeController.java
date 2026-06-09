package com.hirepilot.user.controller;

import com.hirepilot.user.dto.response.ApiResponse;
import com.hirepilot.user.dto.response.ResumeResponse;
import com.hirepilot.user.security.CustomUserDetails;
import com.hirepilot.user.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor

public class ResumeController {

    private final ResumeService resumeService;


    @PostMapping("/upload")
    public ResponseEntity<ResumeResponse> uploadResume(
            @RequestParam("file")
            MultipartFile file,
            Authentication authentication
    ) {

        String email = authentication.getName();

        CustomUserDetails user =
                (CustomUserDetails)
                        authentication.getPrincipal();


        Long userId = user.getUserId();

        ResumeResponse response =
                resumeService.uploadResume(
                        userId,
                        file
                );

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ResumeResponse>>
    getUserResumes(
            Authentication authentication
    ) {

        String email = authentication.getName();

        CustomUserDetails user =
                (CustomUserDetails)
                        authentication.getPrincipal();

        Long userId = user.getUserId();

        List<ResumeResponse> resumes =
                resumeService.getUserResumes(userId);

        return ResponseEntity.ok(resumes);
    }

    @DeleteMapping("/{resumeId}")
    public ResponseEntity<ApiResponse> deleteResume(
            @PathVariable Long resumeId,
            Authentication authentication
    ) {

        String email = authentication.getName();


        CustomUserDetails user =
                (CustomUserDetails)
                        authentication.getPrincipal();


        Long userId = user.getUserId();

        ApiResponse response =
                resumeService.deleteResume(
                        userId,
                        resumeId
                );

        return ResponseEntity.ok(response);
    }
}