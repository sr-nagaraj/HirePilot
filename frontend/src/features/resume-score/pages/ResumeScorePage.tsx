import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Button, Card, CardContent, CircularProgress,
    Divider, Stack, TextField, Typography, Alert, Tooltip, Chip,
    useTheme, Grid, alpha
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PsychologyIcon from '@mui/icons-material/Psychology';
import { useResumes } from '../hooks/useResumes';
import { useResumeScore } from '../hooks/useResumeScore';
import { useAtsStorage } from '../hooks/useAtsStorage';
import { downloadAtsResultAsPdf } from '../utils/downloadAtsPdf';
import { ResumeSelector } from '../components/ResumeSelector';
import { ScoreGauge } from '../components/ScoreGauge';
import { ScoreBreakdown } from '../components/ScoreBreakdown';
import { MissingSkills } from '../components/MissingSkills';
import { Strengths } from '../components/Strengths';
import { Suggestions } from '../components/Suggestions';
import { RecommendationBanner } from '../components/RecommendationBanner';
import type { Resume } from '../types/index';

/** Format a saved ISO timestamp as a human-readable string. */
function formatSavedAt(iso: string): string {
    try {
        const d = new Date(iso);
        return d.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return iso;
    }
}

export const ResumeScorePage: React.FC = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [selectedResumeId, setSelectedResumeId] = useState<number | ''>('');
    const [jobDescription, setJobDescription] = useState('');

    const { data: resumes = [], isLoading: resumesLoading } = useResumes();
    const { mutate: score, data: freshResult, isPending, isError, error, reset } = useResumeScore();
    const { stored, persist, clear } = useAtsStorage();

    // Restore the stored job description and resume selection on mount
    useEffect(() => {
        if (stored) {
            setJobDescription(stored.request.jobDescription);
            setSelectedResumeId(stored.request.resumeId);
        }
    }, []); // intentionally run only once on mount

    // Persist whenever the React Query mutation produces a new result
    useEffect(() => {
        if (freshResult && selectedResumeId !== '') {
            persist(freshResult, {
                resumeId: selectedResumeId as number,
                jobDescription: jobDescription.trim(),
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [freshResult]);

    // Decide which result to render: fresh mutation result takes priority
    const displayResult = freshResult ?? stored?.result ?? null;
    const isRestoredFromCache = !freshResult && !!stored;

    const canAnalyze =
        selectedResumeId !== '' &&
        jobDescription.trim().length >= 50 &&
        !isPending;

    const handleAnalyze = () => {
        if (selectedResumeId === '') return;
        score({ resumeId: selectedResumeId as number, jobDescription: jobDescription.trim() });
    };

    const handleClearResults = () => {
        clear();
        reset();
        setSelectedResumeId('');
        setJobDescription('');
    };

    /** Find the filename of the currently displayed result's resume. */
    const resultResumeFile = (): string | undefined => {
        const resumeId = freshResult
            ? selectedResumeId
            : stored?.request.resumeId;
        if (!resumeId) return undefined;
        return resumes.find((r: Resume) => r.id === resumeId)?.fileName;
    };

    const handleDownloadPdf = () => {
        if (!displayResult) return;
        downloadAtsResultAsPdf(displayResult, resultResumeFile());
    };

    return (
        <Box sx={{ maxWidth: 1100, mx: 'auto', p: { xs: 1.5, md: 3 }, width: '100%' }}>
            {/* Header section */}
            <Stack spacing={0.5} sx={{ mb: 4 }}>
                <Typography variant="h1" sx={{ fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' }, fontWeight: 800 }}>
                    AI Resume ATS Score
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Compare your resume against any job description to get alignment scores, strengths, and smart suggestions.
                </Typography>
            </Stack>

            {/* Input Form Card */}
            <Card variant="outlined" sx={{ mb: 4, borderRadius: 3 }}>
                <CardContent sx={{ p: { xs: 2, sm: 3, md: 3.5 } }}>
                    <Stack spacing={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <PsychologyIcon color="primary" sx={{ fontSize: 24 }} />
                            <Typography variant="h3" fontWeight={700}>
                                Analysis Settings
                            </Typography>
                        </Box>
                        <Divider />
                        
                        <ResumeSelector
                            resumes={resumes}
                            loading={resumesLoading}
                            value={selectedResumeId}
                            onChange={setSelectedResumeId}
                        />

                        <TextField
                            label="Job Description"
                            multiline
                            rows={6}
                            fullWidth
                            placeholder="Paste the target job description here (minimum 50 characters required for detailed matching)..."
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            helperText={`${jobDescription.length} / 5000 characters`}
                            inputProps={{ maxLength: 5000 }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2.5
                                }
                            }}
                        />

                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleAnalyze}
                            disabled={!canAnalyze}
                            startIcon={isPending ? <CircularProgress size={18} color="inherit" /> : null}
                            sx={{
                                py: 1.5,
                                borderRadius: 2.5,
                                fontWeight: 700,
                                fontSize: '1rem',
                                boxShadow: isPending ? 'none' : `0 4px 14px ${alpha(theme.palette.primary.main, 0.25)}`,
                            }}
                        >
                            {isPending ? 'Analyzing Resume...' : 'Analyze Compatibility'}
                        </Button>

                        {isError && (
                            <Alert severity="error" sx={{ borderRadius: 2 }}>
                                {(error as any)?.response?.data?.message ?? 'Analysis failed. Please check your network or try again.'}
                            </Alert>
                        )}
                    </Stack>
                </CardContent>
            </Card>

            {/* Results Grid Dashboard */}
            {displayResult && (
                <Stack spacing={3}>
                    {/* Results Control Toolbar */}
                    <Card variant="outlined" sx={{ borderRadius: 3 }}>
                        <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1 }}>
                                <Typography variant="h4" fontWeight={700}>
                                    Analysis Results
                                </Typography>
                                {isRestoredFromCache && stored?.savedAt && (
                                    <Tooltip title={`Restored from local cache — last analyzed on ${formatSavedAt(stored.savedAt)}`}>
                                        <Chip
                                            icon={<AccessTimeIcon sx={{ fontSize: 13 }} />}
                                            label={`Cached · ${formatSavedAt(stored.savedAt)}`}
                                            size="small"
                                            variant="outlined"
                                            color="info"
                                            sx={{ fontWeight: 600, height: 22 }}
                                        />
                                    </Tooltip>
                                )}
                            </Box>

                            <Stack direction="row" spacing={1}>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<DownloadIcon />}
                                    onClick={handleDownloadPdf}
                                    sx={{ borderRadius: 2, fontWeight: 700 }}
                                >
                                    Download PDF Report
                                </Button>
                                <Button
                                    size="small"
                                    variant="text"
                                    color="inherit"
                                    startIcon={<RefreshIcon />}
                                    onClick={handleClearResults}
                                    sx={{ color: 'text.secondary', fontWeight: 600 }}
                                >
                                    Clear
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>

                    {/* Main Dashboard Details Split Panels */}
                    <Grid container spacing={{ xs: 2, md: 3 }}>
                        {/* Left Side: Score & Breakdown */}
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
                                <CardContent sx={{ p: { xs: 2, sm: 3, md: 3.5 } }}>
                                    <Stack spacing={3.5}>
                                        <RecommendationBanner recommendation={displayResult.recommendation} />
                                        <Box sx={{ py: 1 }}>
                                            <ScoreGauge score={displayResult.overallScore} />
                                        </Box>
                                        
                                        <Divider />
                                        
                                        <Typography variant="h3" fontWeight={700}>
                                            Alignment Metrics
                                        </Typography>
                                        
                                        <ScoreBreakdown
                                            skillsMatch={displayResult.skillsMatch}
                                            experienceMatch={displayResult.experienceMatch}
                                            educationMatch={displayResult.educationMatch}
                                        />
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Right Side: Key Findings */}
                        <Grid size={{ xs: 12, md: 8 }}>
                            <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
                                <CardContent sx={{ p: { xs: 2, sm: 3, md: 3.5 } }}>
                                    <Stack spacing={4}>
                                        <Strengths strengths={displayResult.strengths} />
                                        
                                        <Divider />
                                        
                                        <MissingSkills skills={displayResult.missingSkills} />
                                        
                                        <Divider />
                                        
                                        <Suggestions suggestions={displayResult.suggestions} />
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Stack>
            )}
        </Box>
    );
};