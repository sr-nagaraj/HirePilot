package com.hirepilot.job.entity;

import com.hirepilot.job.enums.ApplicationStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "job_applications",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {
                                "job_id",
                                "candidate_id"
                        }
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Job ID from jobs table
     */
    @Column(name = "job_id", nullable = false)
    private Long jobId;

    /**
     * User ID from auth-service
     */
    @Column(name = "candidate_id", nullable = false)
    private Long candidateId;

    /**
     * Resume ID from user-service
     */
    @Column(name = "resume_id", nullable = false)
    private Long resumeId;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false)
    private ApplicationStatus status =
            ApplicationStatus.APPLIED;

    @CreationTimestamp
    @Column(name = "applied_at", updatable = false)
    private LocalDateTime appliedAt;
}