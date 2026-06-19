package com.hirepilot.user.service.impl;





import com.hirepilot.user.service.ResumeTextService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ResumeTextServiceImpl implements ResumeTextService {

    private static final Logger log = LoggerFactory.getLogger(ResumeTextServiceImpl.class);

    @Value("${openai.max-text-chars:12000}")
    private int maxTextChars;

    @Override
    public String cleanAndTruncate(String rawText) {
        if (rawText == null || rawText.isBlank()) {
            return "";
        }

        // Normalize whitespace: collapse multiple blank lines, trim each line
        String cleaned = rawText
                .replaceAll("[ \\t]+", " ")          // collapse horizontal whitespace
                .replaceAll("(?m)^\\s+$", "")         // blank lines
                .replaceAll("\\n{3,}", "\n\n")        // max 2 consecutive newlines
                .trim();

        if (cleaned.length() > maxTextChars) {
            log.warn("Resume text truncated from {} to {} chars", cleaned.length(), maxTextChars);
            cleaned = cleaned.substring(0, maxTextChars);
        }

        return cleaned;
    }
}
