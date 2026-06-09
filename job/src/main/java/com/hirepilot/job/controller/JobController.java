package com.hirepilot.job.controller;

import com.hirepilot.job.dto.request.CreateJobRequest;
import com.hirepilot.job.dto.request.UpdateJobRequest;
import com.hirepilot.job.dto.response.ApiResponse;
import com.hirepilot.job.dto.response.JobResponse;
import com.hirepilot.job.entity.Job;
import com.hirepilot.job.security.CustomUserDetails;
import com.hirepilot.job.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor

public class JobController {

    private final JobService jobService;

    @PreAuthorize("hasRole('RECRUITER')")
    @PostMapping
    public ResponseEntity<JobResponse> createJob(
            @Valid @RequestBody CreateJobRequest request,
            Authentication authentication
    ) {

        // Temporary
        CustomUserDetails user =
                (CustomUserDetails)
                        authentication.getPrincipal();



        Long recruiterId = user.getUserId();

        JobResponse response =
                jobService.createJob(
                        recruiterId,
                        request
                );

        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('RECRUITER')")
    @PutMapping("/{jobId}")
    public ResponseEntity<JobResponse> updateJob(
            @PathVariable Long jobId,
            @Valid @RequestBody UpdateJobRequest request,
            Authentication authentication
    ) {

        CustomUserDetails user =
                (CustomUserDetails)
                        authentication.getPrincipal();

        Long recruiterId =
                user.getUserId();

        JobResponse response =
                jobService.updateJob(
                        recruiterId,
                        jobId,
                        request
                );

        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('RECRUITER')")
    @DeleteMapping("/{jobId}")
    public ResponseEntity<ApiResponse> deleteJob(
            @PathVariable Long jobId,
            Authentication authentication
    ) {

        CustomUserDetails user =
                (CustomUserDetails)
                        authentication.getPrincipal();

        Long recruiterId =
                user.getUserId();

        ApiResponse response =
                jobService.deleteJob(
                        recruiterId,
                        jobId
                );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<List<JobResponse>> getAllJobs() {

        return ResponseEntity.ok(
                jobService.getAllJobs()
        );
    }

    @PreAuthorize("hasRole('RECRUITER')")
    @GetMapping("/my-jobs")
    public ResponseEntity<List<JobResponse>> getMyJobs(
            Authentication authentication
    ) {

        CustomUserDetails user =
                (CustomUserDetails)
                        authentication.getPrincipal();

        Long recruiterId =
                user.getUserId();

        return ResponseEntity.ok(
                jobService.getRecruiterJobs(
                        recruiterId
                )
        );
    }

    @GetMapping("/id/{jobId}")
    public ResponseEntity<JobResponse> getJob(
            @PathVariable Long jobId
    ) {

        return ResponseEntity.ok(
                jobService.getJobById(jobId)
        );
    }
}