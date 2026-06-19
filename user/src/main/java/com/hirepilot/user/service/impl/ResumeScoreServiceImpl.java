package com.hirepilot.user.service.impl;
import com.hirepilot.user.dto.request.ResumeScoreRequest;
import com.hirepilot.user.dto.response.ResumeScoreResponse;
import com.hirepilot.user.entity.Resume;
import com.hirepilot.user.service.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
public class ResumeScoreServiceImpl implements ResumeScoreService {


    private static final Logger log = LoggerFactory.getLogger(ResumeScoreServiceImpl.class);

    private final ResumeValidationService resumeValidationService;
    private final PdfExtractionService pdfExtractionService;
    private final ResumeTextService resumeTextService;
    private final OpenAIResumeService openAIResumeService;

    public ResumeScoreServiceImpl(
            ResumeValidationService resumeValidationService,
            PdfExtractionService pdfExtractionService,
            ResumeTextService resumeTextService,
            OpenAIResumeService openAIResumeService
    ) {
        this.resumeValidationService = resumeValidationService;
        this.pdfExtractionService = pdfExtractionService;
        this.resumeTextService = resumeTextService;
        this.openAIResumeService = openAIResumeService;
    }

    @Override
    public CompletableFuture<ResumeScoreResponse> score(ResumeScoreRequest request, Long userId) {


        log.info("SERVICE THREAD = {}, SecurityContext authentication = {}",
                Thread.currentThread().getName(),
                org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication());
        log.info("Scoring resume {} for user {}", request.resumeId(), userId);

        Resume resume = resumeValidationService.validateAndLoad(request.resumeId(), userId);

        String rawText = pdfExtractionService.extractText(resume.getFileUrl());
        String cleanText = resumeTextService.cleanAndTruncate(rawText);

        if (cleanText.isBlank()) {
            log.warn("Resume {} produced empty text after extraction", request.resumeId());
        }

        return openAIResumeService.score(cleanText, request.jobDescription());
    }
}