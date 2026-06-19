import React from 'react';
import { Box, Chip, Typography, alpha, useTheme } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const Strengths: React.FC<{ strengths: string[] }> = ({ strengths }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    
    if (!strengths.length) return null;
    
    return (
        <Box>
            <Typography variant="h3" fontWeight={700} sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon sx={{ color: '#10b981', fontSize: 20 }} />
                Core Strengths
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {strengths.map((s) => (
                    <Chip
                        key={s}
                        label={s}
                        size="medium"
                        sx={{
                            fontWeight: 600,
                            color: '#10b981',
                            borderColor: alpha('#10b981', 0.3),
                            bgcolor: isDark ? alpha('#10b981', 0.08) : alpha('#10b981', 0.04),
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            '& .MuiChip-label': { px: 1.5 }
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
};