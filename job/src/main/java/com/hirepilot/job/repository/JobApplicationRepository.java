package com.hirepilot.job.repository;

import com.hirepilot.job.entity.JobApplication;
import com.hirepilot.job.enums.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepository
        extends JpaRepository<JobApplication, Long> {

    List<JobApplication> findByCandidateId(Long candidateId);

    List<JobApplication> findByJobId(Long jobId);

    List<JobApplication> findByStatus(
            ApplicationStatus status
    );

    Optional<JobApplication>
    findByJobIdAndCandidateId(
            Long jobId,
            Long candidateId
    );

    boolean existsByJobIdAndCandidateId(
            Long jobId,
            Long candidateId
    );
}