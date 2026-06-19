import { useMutation } from '@tanstack/react-query';
import { scoreResume } from '../api/resumeScoreApi';
import type { ResumeScoreRequest, ResumeScoreResponse } from '../types/index';

export const useResumeScore = () =>
    useMutation<ResumeScoreResponse, Error, ResumeScoreRequest>({
      mutationFn: (payload: ResumeScoreRequest) => scoreResume(payload),
    });