package com.hirepilot.user.service;


import com.hirepilot.user.entity.Resume;

public interface ResumeValidationService {
    Resume validateAndLoad(Long resumeId, Long authenticatedUserId);
}