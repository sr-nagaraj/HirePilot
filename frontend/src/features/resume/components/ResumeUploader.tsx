import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Box, Button, LinearProgress, Stack, Typography, alpha, useTheme } from "@mui/material";
import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { useResumeUploadMutation } from "../hooks/resumeHooks";

const acceptedTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function isAllowedResume(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  return acceptedTypes.includes(file.type) || ["pdf", "doc", "docx"].includes(extension ?? "");
}

interface ResumeUploaderProps {
  compact?: boolean;
}

export function ResumeUploader({ compact = false }: ResumeUploaderProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const uploadMutation = useResumeUploadMutation();

  function uploadFile(file?: File) {
    if (!file || !isAllowedResume(file)) {
      return;
    }

    setProgress(0);
    uploadMutation.mutate({
      file,
      onProgress: setProgress,
    });
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    uploadFile(event.dataTransfer.files[0]);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    uploadFile(event.target.files?.[0]);
    event.target.value = "";
  }

  return (
    <Box
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      sx={{
        border: "2px dashed",
        borderColor: isDragging ? "primary.main" : "divider",
        bgcolor: isDragging
          ? isDark
            ? alpha(theme.palette.primary.main, 0.08)
            : alpha(theme.palette.primary.main, 0.03)
          : isDark
            ? "rgba(255,255,255,0.01)"
            : "rgba(0,0,0,0.01)",
        borderRadius: 3,
        p: compact ? 3 : { xs: 4, md: 5 },
        cursor: "pointer",
        transition: "all 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          borderColor: "primary.main",
          bgcolor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
        },
      }}
      onClick={() => inputRef.current?.click()}
    >
      <Stack spacing={2.5} alignItems="center" textAlign="center" sx={{ width: "100%" }}>
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{
            width: 56,
            height: 56,
            borderRadius: "12px",
            bgcolor: isDark ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.primary.main, 0.05),
            color: "primary.main",
            border: "1px solid",
            borderColor: isDark ? "rgba(45,212,191,0.2)" : "rgba(15,118,110,0.15)",
          }}
        >
          <CloudUploadIcon sx={{ fontSize: 28 }} />
        </Stack>
        <Stack spacing={0.75}>
          <Typography variant="h3" fontWeight={700}>
            Drag & Drop your Resume
          </Typography>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            or click to browse your files (PDF, DOC, DOCX up to 10MB)
          </Typography>
        </Stack>
        <input
          ref={inputRef}
          type="file"
          hidden
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileChange}
        />
        <Button
          variant="outlined"
          onClick={(e) => {
            e.stopPropagation(); // Prevent duplicate file select click trigger
            inputRef.current?.click();
          }}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            fontWeight: 700,
            pointerEvents: "none", // Button click is intercepted by outer Box, so make it visual-only
          }}
        >
          Choose File
        </Button>
        {uploadMutation.isPending ? (
          <Box sx={{ width: "100%", maxWidth: 360, mt: 1 }} onClick={(e) => e.stopPropagation()}>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 3, mb: 1 }} />
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              Uploading and analyzing... {progress}%
            </Typography>
          </Box>
        ) : null}
      </Stack>
    </Box>
  );
}
