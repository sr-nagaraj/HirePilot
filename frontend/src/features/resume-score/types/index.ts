export interface Resume {
    id: number;
    fileName: string;
    contentType: string;
    uploadedAt: string;
}

export interface ResumeScoreRequest {
    resumeId: number;
    jobDescription: string;
}

export interface ResumeScoreResponse {
    overallScore: number;
    skillsMatch: number;
    experienceMatch: number;
    educationMatch: number;
    missingSkills: string[];
    strengths: string[];
    suggestions: string[];
    recommendation: 'Excellent Match' | 'Good Match' | 'Moderate Match' | 'Poor Match';
}