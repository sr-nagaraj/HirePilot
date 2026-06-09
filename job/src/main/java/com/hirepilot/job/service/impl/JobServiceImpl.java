package com.hirepilot.job.service.impl;

import com.hirepilot.job.dto.request.CreateJobRequest;
import com.hirepilot.job.dto.request.UpdateJobRequest;
import com.hirepilot.job.dto.response.ApiResponse;
import com.hirepilot.job.dto.response.JobResponse;
import com.hirepilot.job.entity.Job;
import com.hirepilot.job.enums.JobStatus;
import com.hirepilot.job.exception.ResourceNotFoundException;
import com.hirepilot.job.exception.UnauthorizedException;
import com.hirepilot.job.repository.JobRepository;
import com.hirepilot.job.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;

    @Override
    public JobResponse createJob(Long recruiterId, CreateJobRequest request) {

        Job job = Job.builder()
                .recruiterId(recruiterId)
                .title(request.getTitle())
                .company(request.getCompany())
                .location(request.getLocation())
                .jobType(request.getJobType())
                .experienceRequired(request.getExperienceRequired())
                .salary(request.getSalary())
                .description(request.getDescription())
                .status(JobStatus.OPEN)
                .build();

        return mapToResponse(jobRepository.save(job));
    }

    @Override
    public JobResponse updateJob(
            Long recruiterId,
            Long jobId,
            UpdateJobRequest request
    ) {

        Job job = getOwnedJob(recruiterId, jobId);

        if (request.getTitle() != null) {
            job.setTitle(request.getTitle());
        }

        if (request.getCompany() != null) {
            job.setCompany(request.getCompany());
        }

        if (request.getLocation() != null) {
            job.setLocation(request.getLocation());
        }

        if (request.getJobType() != null) {
            job.setJobType(request.getJobType());
        }

        if (request.getExperienceRequired() != null) {
            job.setExperienceRequired(request.getExperienceRequired());
        }

        if (request.getSalary() != null) {
            job.setSalary(request.getSalary());
        }

        if (request.getDescription() != null) {
            job.setDescription(request.getDescription());
        }

        return mapToResponse(jobRepository.save(job));
    }

    @Override
    public ApiResponse deleteJob(Long recruiterId, Long jobId) {

        Job job = getOwnedJob(recruiterId, jobId);
        job.setStatus(JobStatus.CLOSED);
        jobRepository.save(job);

        return ApiResponse.builder()
                .success(true)
                .message("Job closed successfully")
                .build();
    }

    @Override
    public JobResponse getJobById(Long jobId) {
        return mapToResponse(findJob(jobId));
    }

    @Override
    public List<JobResponse> getAllJobs() {
        return jobRepository.findByStatus(JobStatus.OPEN)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<JobResponse> getRecruiterJobs(Long recruiterId) {
        return jobRepository.findByRecruiterId(recruiterId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private Job getOwnedJob(Long recruiterId, Long jobId) {

        Job job = findJob(jobId);

        if (!job.getRecruiterId().equals(recruiterId)) {
            throw new UnauthorizedException(
                    "You are not allowed to modify this job"
            );
        }

        return job;
    }

    private Job findJob(Long jobId) {
        return jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Job not found"));
    }

    private JobResponse mapToResponse(Job job) {
        return JobResponse.builder()
                .id(job.getId())
                .recruiterId(job.getRecruiterId())
                .title(job.getTitle())
                .company(job.getCompany())
                .location(job.getLocation())
                .jobType(job.getJobType())
                .experienceRequired(job.getExperienceRequired())
                .salary(job.getSalary())
                .description(job.getDescription())
                .status(job.getStatus())
                .createdAt(job.getCreatedAt())
                .build();
    }
}
