package com.hirepilot.user.service.impl;




import com.hirepilot.user.entity.Resume;
import com.hirepilot.user.exception.ResumeNotFoundException;
import com.hirepilot.user.exception.ResumeValidationException;
import com.hirepilot.user.repository.ResumeRepository;
import com.hirepilot.user.service.ResumeValidationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class ResumeValidationServiceImpl implements ResumeValidationService {

    private static final Logger log = LoggerFactory.getLogger(ResumeValidationServiceImpl.class);
    private final ResumeRepository resumeRepository;

    public ResumeValidationServiceImpl(ResumeRepository resumeRepository) {
        this.resumeRepository = resumeRepository;
    }

    @Override
    public Resume validateAndLoad(Long resumeId, Long authenticatedUserId) {
        log.debug("Loading resume {} for user {}", resumeId, authenticatedUserId);

        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new ResumeNotFoundException(resumeId));

        if (!resume.getUserId().equals(authenticatedUserId)) {
            log.warn("User {} attempted to access resume {} owned by {}",
                    authenticatedUserId, resumeId, resume.getUserId());
            throw new ResumeValidationException("Access denied: resume does not belong to authenticated user.");
        }

        return resume;
    }
}
