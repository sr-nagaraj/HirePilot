package com.hirepilot.user.controller;


import com.hirepilot.user.dto.request.ResumeScoreRequest;
import com.hirepilot.user.dto.response.ResumeScoreResponse;
import com.hirepilot.user.security.JwtTokenProvider;
import com.hirepilot.user.service.ResumeScoreService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/profile/resume")
public class ResumeScoreController {



    private static final Logger log = LoggerFactory.getLogger(ResumeScoreController.class);

    private final ResumeScoreService resumeScoreService;
    private final JwtTokenProvider jwtTokenProvider;

    public ResumeScoreController(ResumeScoreService resumeScoreService,  JwtTokenProvider jwtTokenProvider) {
        this.resumeScoreService = resumeScoreService;
        this.jwtTokenProvider = jwtTokenProvider;

    }

    @PostMapping("/score")
    public CompletableFuture<ResponseEntity<ResumeScoreResponse>> scoreResume(
            @Valid @RequestBody ResumeScoreRequest request,
            HttpServletRequest httpRequest
    ) {
        String token = extractToken(httpRequest);
        Long userId = jwtTokenProvider.getUserId(token);
        log.info("Resume score request: resumeId={}, userId={}", request.resumeId(), userId);

        log.info("CONTROLLER THREAD = {}, SecurityContext authentication = {}",
                Thread.currentThread().getName(),
                org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication());


        return resumeScoreService.score(request, userId)
                .thenApply(ResponseEntity::ok);
    }

    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        throw new IllegalArgumentException("Missing or invalid Authorization header");
    }
}
