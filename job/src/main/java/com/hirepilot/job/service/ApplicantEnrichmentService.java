package com.hirepilot.job.service;

import com.hirepilot.job.dto.response.ApplicantDetailsResponse;
import java.util.List;

public interface ApplicantEnrichmentService {
    List<ApplicantDetailsResponse> getEnrichedApplicants(Long jobId);
}
