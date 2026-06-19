package com.hirepilot.user.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hirepilot.user.exception.OpenAIProcessingException;
import com.hirepilot.user.service.OpenAIResumeService;
import com.hirepilot.user.dto.response.ResumeScoreResponse;
import com.openai.client.OpenAIClient;
import com.openai.models.chat.completions.ChatCompletion;
import com.openai.models.chat.completions.ChatCompletionCreateParams;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class OpenAIResumeServiceImpl implements OpenAIResumeService {



    private static final Logger log = LoggerFactory.getLogger(OpenAIResumeServiceImpl.class);
    private static final Pattern JSON_PATTERN = Pattern.compile("\\{[\\s\\S]*}", Pattern.DOTALL);

    private final OpenAIClient openAIClient;
    private final ObjectMapper objectMapper;

    @Value("${openai.model:gpt-4.1-mini}")
    private String model;

    @Value("${openai.max-tokens:1000}")
    private long maxTokens;

    @Value("${openai.prompt-template}")
    private String promptTemplate;

    public OpenAIResumeServiceImpl(OpenAIClient openAIClient, ObjectMapper objectMapper) {
        this.openAIClient = openAIClient;
        this.objectMapper = objectMapper;
    }

    @Async
    @Override
    public CompletableFuture<ResumeScoreResponse> score(String resumeText, String jobDescription) {
        log.info("Sending resume to OpenAI for scoring");

        log.info("ASYNC THREAD = {}, SecurityContext authentication = {}",
                Thread.currentThread().getName(),
                org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication());
        
        String prompt = promptTemplate
                .replace("{jobDescription}", jobDescription)
                .replace("{resumeText}", resumeText);

        try {
            // openai-java 3.0.0 API
            ChatCompletionCreateParams params = ChatCompletionCreateParams.builder()
                    .model(model)
                    .maxTokens(maxTokens)
                    .addUserMessage(prompt)   // <-- replaces addMessage(ChatCompletionUserMessageParam)
                    .build();

            ChatCompletion completion = openAIClient.chat().completions().create(params);

            String rawResponse = completion.choices().get(0)
                    .message().content()
                    .orElseThrow(() -> new OpenAIProcessingException("Empty response from OpenAI"));

            log.debug("OpenAI raw response: {}", rawResponse);

            ResumeScoreResponse response = parseJson(rawResponse);
            log.info("Resume scored. Overall: {}", response.overallScore());
            return CompletableFuture.completedFuture(response);

        } catch (OpenAIProcessingException e) {
            throw e;
        } catch (Exception e) {
            throw new OpenAIProcessingException("OpenAI API call failed", e);
        }
    }

    private ResumeScoreResponse parseJson(String raw) {
        Matcher matcher = JSON_PATTERN.matcher(raw);
        if (!matcher.find()) {
            log.error("No JSON found in OpenAI response: {}", raw);
            throw new OpenAIProcessingException("OpenAI did not return valid JSON.");
        }
        String json = matcher.group();
        try {
            return objectMapper.readValue(json, ResumeScoreResponse.class);
        } catch (Exception e) {
            log.error("Failed to parse OpenAI JSON: {}", json, e);
            throw new OpenAIProcessingException("Failed to parse ATS score from AI response.", e);
        }
    }
}