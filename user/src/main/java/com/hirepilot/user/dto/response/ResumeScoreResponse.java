package com.hirepilot.user.dto.response;



import java.util.List;

public record ResumeScoreResponse(
        int overallScore,
        int skillsMatch,
        int experienceMatch,
        int educationMatch,
        List<String> missingSkills,
        List<String> strengths,
        List<String> suggestions,
        String recommendation
) {}
