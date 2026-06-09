package com.hirepilot.job.service.impl;


import com.hirepilot.job.dto.request.ApplyJobRequest;
import com.hirepilot.job.dto.request.UpdateApplicationStatusRequest;
import com.hirepilot.job.dto.response.ApplicationResponse;
import com.hirepilot.job.entity.JobApplication;
import com.hirepilot.job.exception.JobAlreadyAppliedException;
import com.hirepilot.job.exception.ResourceNotFoundException;

import com.hirepilot.job.repository.JobApplicationRepository;
import com.hirepilot.job.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl
        implements ApplicationService {




    private final JobApplicationRepository
            applicationRepository;

    @Override
    public ApplicationResponse applyJob(
            Long candidateId,
            Long jobId,
            ApplyJobRequest request
    ) {

        if (applicationRepository
                .existsByJobIdAndCandidateId(
                        jobId,
                        candidateId
                )) {

            throw new JobAlreadyAppliedException(
                    "You already applied for this job"
            );
        }

        JobApplication application =
                JobApplication.builder()
                        .jobId(jobId)
                        .candidateId(candidateId)
                        .resumeId(
                                request.getResumeId()
                        )
                        .build();

        return mapToResponse(
                applicationRepository.save(
                        application
                )
        );
    }

    @Override
    public List<ApplicationResponse>
    getCandidateApplications(
            Long candidateId
    ) {

        return applicationRepository
                .findByCandidateId(candidateId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<ApplicationResponse>
    getJobApplications(
            Long jobId
    ) {

        return applicationRepository
                .findByJobId(jobId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ApplicationResponse
    updateApplicationStatus(
            Long applicationId,
            UpdateApplicationStatusRequest request
    ) {

        JobApplication application =
                applicationRepository
                        .findById(applicationId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Application not found"
                                ));

        application.setStatus(
                request.getStatus()
        );

        return mapToResponse(
                applicationRepository.save(
                        application
                )
        );
    }

    private ApplicationResponse mapToResponse(
            JobApplication application
    ) {

        return ApplicationResponse.builder()
                .id(application.getId())
                .jobId(application.getJobId())
                .candidateId(
                        application.getCandidateId()
                )
                .resumeId(application.getResumeId())
                .status(application.getStatus())
                .appliedAt(
                        application.getAppliedAt()
                )
                .build();
    }
}