package com.hirepilot.job.controller;

import com.hirepilot.job.dto.request.ApplyJobRequest;
import com.hirepilot.job.dto.request.UpdateApplicationStatusRequest;
import com.hirepilot.job.dto.response.ApplicationResponse;
import com.hirepilot.job.security.CustomUserDetails;
import com.hirepilot.job.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor

public class ApplicationController {

    private final ApplicationService applicationService;

    @PreAuthorize("hasRole('CANDIDATE')")
    @PostMapping("/api/jobs/{jobId}/apply")
    public ResponseEntity<ApplicationResponse> applyJob(
            @PathVariable Long jobId,
            @Valid @RequestBody ApplyJobRequest request,
            Authentication authentication
    ) {

        CustomUserDetails user =
                (CustomUserDetails)
                        authentication.getPrincipal();

        Long candidateId =
                user.getUserId();

        ApplicationResponse response =
                applicationService.applyJob(
                        candidateId,
                        jobId,
                        request
                );

        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('CANDIDATE')")
    @GetMapping("/api/applications/my")
    public ResponseEntity<List<ApplicationResponse>>
    getMyApplications(
            Authentication authentication
    ) {

        CustomUserDetails user =
                (CustomUserDetails)
                        authentication.getPrincipal();

        Long candidateId =
                user.getUserId();

        return ResponseEntity.ok(
                applicationService
                        .getCandidateApplications(
                                candidateId
                        )
        );
    }

    @PreAuthorize("hasRole('RECRUITER')")
    @GetMapping("/api/jobs/{jobId}/applications")
    public ResponseEntity<List<ApplicationResponse>>
    getJobApplications(
            @PathVariable Long jobId
    ) {

        return ResponseEntity.ok(
                applicationService
                        .getJobApplications(jobId)
        );
    }



    @PreAuthorize("hasRole('RECRUITER')")
    @PutMapping("/api/applications/{applicationId}/status")
    public ResponseEntity<ApplicationResponse>
    updateApplicationStatus(
            @PathVariable Long applicationId,
            @Valid @RequestBody
            UpdateApplicationStatusRequest request
    ) {

        return ResponseEntity.ok(
                applicationService
                        .updateApplicationStatus(
                                applicationId,
                                request
                        )
        );
    }
}