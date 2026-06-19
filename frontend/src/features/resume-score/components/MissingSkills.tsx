import React from 'react';
import { Box, Chip, Typography, alpha, useTheme } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export const MissingSkills: React.FC<{ skills: string[] }> = ({ skills }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    
    if (!skills.length) return null;
    
    return (
        <Box>
            <Typography variant="h3" fontWeight={700} sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <WarningAmberIcon sx={{ color: '#ef4444', fontSize: 20 }} />
                Missing Key Skills
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {skills.map((s) => (
                    <Chip
                        key={s}
                        label={s}
                        size="medium"
                        sx={{
                            fontWeight: 600,
                            color: '#ef4444',
                            borderColor: alpha('#ef4444', 0.3),
                            bgcolor: isDark ? alpha('#ef4444', 0.08) : alpha('#ef4444', 0.04),
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