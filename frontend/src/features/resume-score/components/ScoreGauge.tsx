import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme, alpha } from '@mui/material';

interface Props {
    score: number;
}

export const ScoreGauge: React.FC<Props> = ({ score }) => {
    const theme = useTheme();
    const [animatedScore, setAnimatedScore] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedScore(score);
        }, 100);
        return () => clearTimeout(timer);
    }, [score]);

    const getColor = (val: number): string => {
        if (val >= 75) return '#10b981'; // Emerald
        if (val >= 50) return '#f59e0b'; // Amber
        return '#ef4444'; // Crimson
    };

    const color = getColor(score);
    const radius = 56;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 1 }}>
            <Box
                sx={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 150,
                    height: 150,
                }}
            >
                <svg width="150" height="150" style={{ transform: 'rotate(-90deg)' }}>
                    {/* Track */}
                    <circle
                        cx="75"
                        cy="75"
                        r={radius}
                        fill="transparent"
                        stroke={theme.palette.divider}
                        strokeWidth="8"
                    />
                    {/* Fill */}
                    <circle
                        cx="75"
                        cy="75"
                        r={radius}
                        fill="transparent"
                        stroke={color}
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        style={{
                            transition: 'stroke-dashoffset 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                    />
                </svg>
                {/* Absolute inner score */}
                <Box
                    sx={{
                        position: 'absolute',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                    }}
                >
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: '2.5rem',
                            fontWeight: 800,
                            color,
                            lineHeight: 1,
                        }}
                    >
                        {score}
                    </Typography>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={700}
                        sx={{
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            fontSize: '0.625rem',
                            mt: 0.5,
                        }}
                    >
                        ATS SCORE
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};