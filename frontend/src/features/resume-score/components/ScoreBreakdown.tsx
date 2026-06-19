import React from 'react';
import { Box, Typography, LinearProgress, Stack, useTheme, alpha } from '@mui/material';

interface Props {
    skillsMatch: number;
    experienceMatch: number;
    educationMatch: number;
}

const ScoreBar: React.FC<{ label: string; value: number }> = ({ label, value }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const getColor = (val: number): string => {
        if (val >= 75) return '#10b981'; // Emerald
        if (val >= 50) return '#f59e0b'; // Amber
        return '#ef4444'; // Crimson
    };

    const color = getColor(value);

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                <Typography variant="body2" fontWeight={700}>
                    {label}
                </Typography>
                <Typography variant="body2" fontWeight={800} sx={{ color }}>
                    {value}%
                </Typography>
            </Box>
            <LinearProgress
                variant="determinate"
                value={value}
                sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.05)',
                    '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        backgroundColor: color,
                    },
                }}
            />
        </Box>
    );
};

export const ScoreBreakdown: React.FC<Props> = ({ skillsMatch, experienceMatch, educationMatch }) => (
    <Stack spacing={2.5}>
        <ScoreBar label="Skills Alignment" value={skillsMatch} />
        <ScoreBar label="Experience Match" value={experienceMatch} />
        <ScoreBar label="Education Check" value={educationMatch} />
    </Stack>
);