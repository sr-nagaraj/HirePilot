package com.hirepilot.user.service;


import com.hirepilot.user.dto.response.ResumeScoreResponse;

import java.util.concurrent.CompletableFuture;

public interface OpenAIResumeService {
    CompletableFuture<ResumeScoreResponse> score(String resumeText, String jobDescription);
}