import React from 'react';
import {
    FormControl, InputLabel, Select, MenuItem, CircularProgress, Typography, Stack, Box
} from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import type { Resume } from '../types';

interface Props {
    resumes: Resume[];
    loading: boolean;
    value: number | '';
    onChange: (id: number) => void;
}

export const ResumeSelector: React.FC<Props> = ({ resumes, loading, value, onChange }) => {
    if (loading) {
        return (
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ py: 1 }}>
                <CircularProgress size={20} />
                <Typography variant="body2" color="text.secondary">Loading resumes...</Typography>
            </Stack>
        );
    }

    if (resumes.length === 0) {
        return (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', py: 1 }}>
                No uploaded resumes found. Please upload a resume in the Resume Center first.
            </Typography>
        );
    }

    return (
        <FormControl fullWidth>
            <InputLabel id="resume-selector-label">Select Resume for Analysis</InputLabel>
            <Select
                labelId="resume-selector-label"
                value={value}
                label="Select Resume for Analysis"
                onChange={(e) => onChange(Number(e.target.value))}
                sx={{
                    borderRadius: 2,
                    '& .MuiSelect-select': {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                    }
                }}
            >
                {resumes.map((r) => (
                    <MenuItem key={r.id} value={r.id} sx={{ gap: 1.5 }}>
                        <InsertDriveFileIcon fontSize="small" color="primary" />
                        {r.fileName}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};