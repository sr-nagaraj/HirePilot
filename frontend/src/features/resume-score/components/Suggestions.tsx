import React from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, useTheme, alpha } from '@mui/material';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

export const Suggestions: React.FC<{ suggestions: string[] }> = ({ suggestions }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    
    if (!suggestions.length) return null;
    
    return (
        <Box>
            <Typography variant="h3" fontWeight={700} sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LightbulbOutlinedIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                Improvement Suggestions
            </Typography>
            <List dense disablePadding>
                {suggestions.map((s, i) => (
                    <ListItem key={i} sx={{ px: 2, py: 1.25, mb: 1.25, borderRadius: 2, border: '1px solid', borderColor: 'divider', bgcolor: isDark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)', alignItems: 'flex-start' }}>
                        <ListItemIcon sx={{ minWidth: 28, mt: 0.25, color: 'primary.main' }}>
                            <ArrowRightIcon />
                        </ListItemIcon>
                        <ListItemText 
                            primary={s} 
                            primaryTypographyProps={{ 
                                variant: 'body2', 
                                fontWeight: 500,
                                sx: { lineHeight: 1.5 } 
                            }} 
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};