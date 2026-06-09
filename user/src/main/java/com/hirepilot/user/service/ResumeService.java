package com.hirepilot.user.service;

import com.hirepilot.user.dto.response.ApiResponse;
import com.hirepilot.user.dto.response.ResumeResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ResumeService {

    ResumeResponse uploadResume(
            Long userId,
            MultipartFile file
    );

    List<ResumeResponse> getUserResumes(Long userId);

    ApiResponse deleteResume(
            Long userId,
            Long resumeId
    );
}