package com.hirepilot.user.service.impl;

import com.hirepilot.user.dto.response.ApiResponse;
import com.hirepilot.user.dto.response.ResumeResponse;
import com.hirepilot.user.entity.Resume;
import com.hirepilot.user.exception.FileStorageException;
import com.hirepilot.user.exception.ResourceNotFoundException;
import com.hirepilot.user.exception.UnauthorizedException;
import com.hirepilot.user.repository.ResumeRepository;
import com.hirepilot.user.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ResumeServiceImpl implements ResumeService {

    private final ResumeRepository resumeRepository;

    private static final String UPLOAD_DIR =
            "uploads/resumes/";

    @Override
    public ResumeResponse uploadResume(
            Long userId,
            MultipartFile file
    ) {

        try {

            Files.createDirectories(
                    Paths.get(UPLOAD_DIR)
            );

            String fileName =
                    UUID.randomUUID() + "_" +
                            file.getOriginalFilename();

            Path filePath =
                    Paths.get(UPLOAD_DIR, fileName);

            Files.copy(
                    file.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING
            );

            Resume resume = Resume.builder()
                    .userId(userId)
                    .fileName(fileName)
                    .fileUrl(filePath.toString())
                    .fileSize(file.getSize())
                    .contentType(file.getContentType())
                    .build();

            Resume savedResume =
                    resumeRepository.save(resume);

            return mapToResponse(savedResume);

        } catch (IOException ex) {

            throw new FileStorageException(
                    "Failed to upload resume"
            );
        }
    }

    @Override
    public List<ResumeResponse> getUserResumes(
            Long userId
    ) {

        return resumeRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ApiResponse deleteResume(
            Long userId,
            Long resumeId
    ) {

        Resume resume = resumeRepository
                .findById(resumeId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Resume not found"
                        ));

        if (!resume.getUserId().equals(userId)) {

            throw new UnauthorizedException(
                    "Unauthorized access"
            );
        }

        try {

            Files.deleteIfExists(
                    Paths.get(resume.getFileUrl())
            );

        } catch (IOException ex) {

            throw new FileStorageException(
                    "Failed to delete file"
            );
        }

        resumeRepository.delete(resume);

        return ApiResponse.builder()
                .success(true)
                .message("Resume deleted successfully")
                .build();
    }

    private ResumeResponse mapToResponse(
            Resume resume
    ) {

        return ResumeResponse.builder()
                .id(resume.getId())
                .fileName(resume.getFileName())
                .fileUrl(resume.getFileUrl())
                .fileSize(resume.getFileSize())
                .contentType(resume.getContentType())
                .uploadedAt(resume.getUploadedAt())
                .build();
    }
}