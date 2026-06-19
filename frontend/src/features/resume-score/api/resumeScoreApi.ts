import { apiClient } from '../../../services/apiClient';
import type { Resume, ResumeScoreRequest, ResumeScoreResponse } from '../types/index';

export async function fetchResumes(): Promise<Resume[]> {
    const { data } = await apiClient.get<Resume[]>('/api/resumes', {
        skipAuthRedirect: true,    // ← don't redirect to login if resumes 401
    });
    return data;
}

export async function scoreResume(payload: ResumeScoreRequest): Promise<ResumeScoreResponse> {
    const { data } = await apiClient.post<ResumeScoreResponse>(
        '/api/profile/resume/score',
        {
            resumeId: payload.resumeId,
            jobDescription: payload.jobDescription,
        },
        {
            skipAuthRedirect: true,   // ← third argument = axios config, correct position
        }
    );
    return data;
}