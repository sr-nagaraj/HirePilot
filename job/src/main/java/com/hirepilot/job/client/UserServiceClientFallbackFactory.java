package com.hirepilot.job.client;

import com.hirepilot.job.dto.response.ProfileResponse;
import com.hirepilot.job.dto.response.ResumeResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.openfeign.FallbackFactory;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class UserServiceClientFallbackFactory implements FallbackFactory<UserServiceClient> {

    private static final Logger log = LoggerFactory.getLogger(UserServiceClientFallbackFactory.class);

    @Override
    public UserServiceClient create(Throwable cause) {
        return new UserServiceClient() {
            @Override
            public ProfileResponse getProfileByUserId(Long userId) {
                log.error("Failed to fetch profile for userId: {}. Error: {}", userId, cause.getMessage());
                return null;
            }

            @Override
            public List<ResumeResponse> getResumesByUserId(Long userId) {
                log.error("Failed to fetch resumes for userId: {}. Error: {}", userId, cause.getMessage());
                return Collections.emptyList();
            }
        };
    }
}
