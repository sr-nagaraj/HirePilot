package com.hirepilot.job.service.impl;

import com.hirepilot.job.client.UserServiceClient;
import com.hirepilot.job.dto.response.*;
import com.hirepilot.job.entity.JobApplication;
import com.hirepilot.job.repository.JobApplicationRepository;
import com.hirepilot.job.service.ApplicantEnrichmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicantEnrichmentServiceImpl implements ApplicantEnrichmentService {

    private final JobApplicationRepository jobApplicationRepository;
    private final UserServiceClient userServiceClient;

    @Override
    public List<ApplicantDetailsResponse> getEnrichedApplicants(Long jobId) {
        List<JobApplication> applications = jobApplicationRepository.findByJobId(jobId);
        if (applications.isEmpty()) {
            return Collections.emptyList();
        }

        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

        // Start async calls for all applications
        List<CompletableFuture<ApplicantDetailsResponse>> futures = applications.stream()
                .map(app -> {
                    Long candidateId = app.getCandidateId();
                    Long resumeId = app.getResumeId();

                    CompletableFuture<ProfileResponse> profileFuture = CompletableFuture.supplyAsync(() -> {
                        if (attributes != null) {
                            RequestContextHolder.setRequestAttributes(attributes, true);
                        }
                        try {
                            return userServiceClient.getProfileByUserId(candidateId);
                        } finally {
                            RequestContextHolder.resetRequestAttributes();
                        }
                    }).exceptionally(ex -> null);

                    CompletableFuture<List<ResumeResponse>> resumesFuture = CompletableFuture.supplyAsync(() -> {
                        if (attributes != null) {
                            RequestContextHolder.setRequestAttributes(attributes, true);
                        }
                        try {
                            return userServiceClient.getResumesByUserId(candidateId);
                        } finally {
                            RequestContextHolder.resetRequestAttributes();
                        }
                    }).exceptionally(ex -> Collections.emptyList());

                    return CompletableFuture.allOf(profileFuture, resumesFuture).thenApply(v -> {
                        ProfileResponse profileRes = profileFuture.join();
                        List<ResumeResponse> resumesRes = resumesFuture.join();

                        CandidateProfileDto profileDto = null;
                        if (profileRes != null) {
                            profileDto = CandidateProfileDto.builder()
                                    .userId(profileRes.getUserId())
                                    .fullName(profileRes.getFullName())
                                    .headline(profileRes.getHeadline())
                                    .location(profileRes.getLocation())
                                    .profilePicture(profileRes.getProfilePicture())
                                    .phoneNumber(profileRes.getPhoneNumber())
                                    .education(profileRes.getEducation())
                                    .bio(profileRes.getBio())
                                    .skills(profileRes.getSkills())
                                    .linkedinUrl(profileRes.getLinkedinUrl())
                                    .githubUrl(profileRes.getGithubUrl())
                                    .websiteUrl(profileRes.getWebsiteUrl())
                                    .designation(profileRes.getDesignation())
                                    .experience(profileRes.getExperience())
                                    .build();
                        }

                        CandidateResumeDto resumeDto = null;
                        if (resumesRes != null && !resumesRes.isEmpty()) {
                            ResumeResponse matchedResume = resumesRes.stream()
                                    .filter(r -> r.getId().equals(resumeId))
                                    .findFirst()
                                    .orElse(null);

                            if (matchedResume == null && !resumesRes.isEmpty()) {
                                matchedResume = resumesRes.get(0); // fallback to first resume if matching not found
                            }

                            if (matchedResume != null) {
                                resumeDto = CandidateResumeDto.builder()
                                        .resumeId(matchedResume.getId())
                                        .fileName(matchedResume.getFileName())
                                        .fileUrl(matchedResume.getFileUrl())
                                        .uploadedAt(matchedResume.getUploadedAt())
                                        .build();
                            }
                        }

                        return ApplicantDetailsResponse.builder()
                                .applicationId(app.getId())
                                .userId(candidateId)
                                .profile(profileDto)
                                .resume(resumeDto)
                                .resumeScore(null) // ATS Score is not persisted, Option A
                                .applicationStatus(app.getStatus())
                                .appliedDate(app.getAppliedAt())
                                .build();
                    });
                })
                .collect(Collectors.toList());

        // Wait for all to complete
        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();

        return futures.stream()
                .map(CompletableFuture::join)
                .collect(Collectors.toList());
    }
}
