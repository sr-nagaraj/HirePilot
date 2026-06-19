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

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor

public class ResumeController {

    private final ResumeService resumeService;


    @GetMapping("/debug-auth")
    public ResponseEntity<String> debugAuth(
            Authentication authentication
    ) {

        System.out.println("AUTH = " + authentication);

        if (authentication == null) {
            return ResponseEntity.ok("AUTH IS NULL");
        }

        return ResponseEntity.ok(
                authentication.getName()
        );
    }

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

    @GetMapping("/{resumeId}/file")
    public ResponseEntity<Resource> getResumeFile(
            @PathVariable Long resumeId,
            Authentication authentication
    ) {
        try {
            CustomUserDetails user =
                    (CustomUserDetails)
                            authentication.getPrincipal();
            Long userId = user.getUserId();

            // Get resume metadata
            List<ResumeResponse> resumes =
                    resumeService.getUserResumes(userId);
            ResumeResponse resume = resumes.stream()
                    .filter(r -> r.getId().equals(resumeId))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Resume not found"));

            // Load file from disk
            java.nio.file.Path filePath =
                    java.nio.file.Paths.get(resume.getFileUrl()).toAbsolutePath().normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                throw new RuntimeException("File not found on disk");
            }

            String contentType = resume.getContentType() != null
                    ? resume.getContentType()
                    : "application/octet-stream";

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" + resume.getFileName() + "\"")
                    .body(resource);

        } catch (Exception ex) {
            throw new RuntimeException("Failed to serve resume file", ex);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ResumeResponse>> getResumesByUserId(
            @PathVariable Long userId
    ) {
        return ResponseEntity.ok(resumeService.getUserResumes(userId));
    }
}