package com.hirepilot.job.repository;

import com.hirepilot.job.entity.Job;
import com.hirepilot.job.enums.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository
        extends JpaRepository<Job, Long> {

    List<Job> findByRecruiterId(Long recruiterId);

    List<Job> findByRecruiterIdAndStatus(Long recruiterId, JobStatus status);

    List<Job> findByRecruiterIdAndStatusAndDeleted(Long recruiterId, JobStatus status, Boolean deleted);

    List<Job> findByStatus(JobStatus status);

    List<Job> findByStatusAndDeleted(JobStatus status, Boolean deleted);

    List<Job> findByLocationContainingIgnoreCase(String location);

    List<Job> findByTitleContainingIgnoreCase(String title);
}