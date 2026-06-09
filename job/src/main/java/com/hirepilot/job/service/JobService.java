package com.hirepilot.job.service;

import com.hirepilot.job.dto.request.CreateJobRequest;
import com.hirepilot.job.dto.request.UpdateJobRequest;
import com.hirepilot.job.dto.response.ApiResponse;
import com.hirepilot.job.dto.response.JobResponse;

import java.util.List;

public interface JobService {

    JobResponse createJob(
            Long recruiterId,
            CreateJobRequest request
    );

    JobResponse updateJob(
            Long recruiterId,
            Long jobId,
            UpdateJobRequest request
    );

    ApiResponse deleteJob(
            Long recruiterId,
            Long jobId
    );

    JobResponse getJobById(Long jobId);

    List<JobResponse> getAllJobs();

    List<JobResponse> getRecruiterJobs(
            Long recruiterId
    );
}