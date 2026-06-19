import React from 'react';
import { Alert, alpha, useTheme } from '@mui/material';

type Recommendation = 'Excellent Match' | 'Good Match' | 'Moderate Match' | 'Poor Match';

const severityMap: Record<Recommendation, 'success' | 'info' | 'warning' | 'error'> = {
    'Excellent Match': 'success',
    'Good Match': 'info',
    'Moderate Match': 'warning',
    'Poor Match': 'error',
};

export const RecommendationBanner: React.FC<{ recommendation: Recommendation }> = ({
    recommendation,
}) => {
    const theme = useTheme();
    const severity = severityMap[recommendation];
    
    return (
        <Alert 
            severity={severity} 
            sx={{ 
                fontWeight: 700, 
                fontSize: '0.95rem',
                borderRadius: 2.5,
                border: '1px solid',
                borderColor: `${severity}.main`,
                px: 2.5,
                py: 1.5,
                bgcolor: (t) => alpha(t.palette[severity].main, 0.06),
                '& .MuiAlert-icon': {
                    alignItems: 'center',
                    fontSize: 22,
                }
            }}
        >
            ATS Match Result: {recommendation}
        </Alert>
    );
};