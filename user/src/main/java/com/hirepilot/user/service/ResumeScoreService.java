package com.hirepilot.user.service;


import com.hirepilot.user.dto.request.ResumeScoreRequest;
import com.hirepilot.user.dto.response.ResumeScoreResponse;

import java.util.concurrent.CompletableFuture;

public interface ResumeScoreService {
    CompletableFuture<ResumeScoreResponse> score(ResumeScoreRequest request, Long userId);
}