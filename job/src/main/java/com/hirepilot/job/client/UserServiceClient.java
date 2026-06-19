package com.hirepilot.job.client;

import com.hirepilot.job.config.FeignConfig;
import com.hirepilot.job.dto.response.ProfileResponse;
import com.hirepilot.job.dto.response.ResumeResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "user-service", url = "${user-service.url:http://localhost:8082}",
             configuration = FeignConfig.class,
             fallbackFactory = UserServiceClientFallbackFactory.class)
public interface UserServiceClient {

    @GetMapping("/api/profile/user/{userId}")
    ProfileResponse getProfileByUserId(@PathVariable("userId") Long userId);

    @GetMapping("/api/resumes/user/{userId}")
    List<ResumeResponse> getResumesByUserId(@PathVariable("userId") Long userId);
}
