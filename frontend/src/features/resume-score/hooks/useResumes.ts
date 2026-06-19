// hooks/useResumes.ts
import { useQuery } from '@tanstack/react-query';
import { fetchResumes } from '../api/resumeScoreApi';
import type { Resume } from '../types/index';

export const useResumes = () =>
    useQuery<Resume[]>({
        queryKey: ['resumes'],
        queryFn: fetchResumes,
        staleTime: 1000 * 60 * 5,
        retry: false,              // ← don't retry on 401
    });