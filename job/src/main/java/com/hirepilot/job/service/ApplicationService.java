package com.hirepilot.job.service;

import com.hirepilot.job.dto.request.ApplyJobRequest;
import com.hirepilot.job.dto.request.UpdateApplicationStatusRequest;
import com.hirepilot.job.dto.response.ApplicationResponse;

import java.util.List;

public interface ApplicationService {


    ApplicationResponse applyJob(
            Long candidateId,
            Long jobId,
            ApplyJobRequest request
    );

    List<ApplicationResponse> getCandidateApplications(
            Long candidateId
    );

    List<ApplicationResponse> getJobApplications(
            Long jobId
    );

    ApplicationResponse updateApplicationStatus(
            Long applicationId,
            UpdateApplicationStatusRequest request
    );

}