import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Button,
  Card,
  CardContent,
  IconButton,
  LinearProgress,
  Stack,
  Tooltip,
  Typography,
  Box,
  alpha,
  useTheme,
} from "@mui/material";
import { useRef, useState, type ChangeEvent } from "react";
import { getApiErrorMessage } from "../../../services/apiClient";
import { useToast } from "../../../shared/hooks/useToast";
import { formatDate } from "../../../shared/utils/formatters";
import {
  downloadResume,
  formatFileSize,
  getResumeDisplayName,
  previewResume,
} from "../api/resumeApi";
import { useReplaceResumeMutation } from "../hooks/resumeHooks";
import type { Resume } from "../types/resume";

interface ResumeCardProps {
  resume: Resume;
  onDelete: (resumeId: number) => void;
}

export function ResumeCard({ resume, onDelete }: ResumeCardProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [fileAction, setFileAction] = useState<"preview" | "download" | null>(null);
  const { showToast } = useToast();
  const replaceMutation = useReplaceResumeMutation();
  const displayName = getResumeDisplayName(resume.fileName);

  async function handleFileAction(action: "preview" | "download") {
    setFileAction(action);

    try {
      if (action === "preview") {
        await previewResume(resume.id);
      } else {
        await downloadResume(resume.id, resume.fileName);
      }
    } catch (error) {
      showToast(getApiErrorMessage(error), "error");
    } finally {
      setFileAction(null);
    }
  }

  function handleReplace(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      setProgress(0);
      replaceMutation.mutate({
        resumeId: resume.id,
        options: {
          file,
          onProgress: setProgress,
        },
      });
    }

    event.target.value = "";
  }

  return (
    <Card
      variant="outlined"
      className="hover-card"
      sx={{
        height: "100%",
        borderRadius: 3,
        borderColor: "divider",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          borderColor: "primary.main",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2.5}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{
                width: 46,
                height: 46,
                borderRadius: "10px",
                bgcolor: isDark ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.primary.main, 0.05),
                color: "primary.main",
                flexShrink: 0,
                border: "1px solid",
                borderColor: isDark ? "rgba(45,212,191,0.2)" : "rgba(15,118,110,0.15)",
              }}
            >
              <InsertDriveFileIcon sx={{ fontSize: 24 }} />
            </Stack>
            <Stack spacing={0.25} sx={{ minWidth: 0 }}>
              <Typography variant="h4" fontWeight={700} noWrap title={displayName}>
                {displayName}
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                {formatDate(resume.uploadedAt)} · {formatFileSize(resume.fileSize)}
              </Typography>
            </Stack>
          </Stack>

          {replaceMutation.isPending ? (
            <Stack spacing={1} sx={{ px: 0.5 }}>
              <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 3 }} />
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                Replacing file... {progress}%
              </Typography>
            </Stack>
          ) : null}

          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 1 }}>
            <Stack direction="row" spacing={1}>
              <Button
                onClick={() => handleFileAction("preview")}
                disabled={fileAction !== null}
                startIcon={<VisibilityIcon />}
                variant="outlined"
                size="small"
                sx={{ borderRadius: 2, fontWeight: 700 }}
              >
                {fileAction === "preview" ? "Opening..." : "Preview"}
              </Button>
              <Button
                onClick={() => handleFileAction("download")}
                disabled={fileAction !== null}
                startIcon={<DownloadIcon />}
                variant="outlined"
                size="small"
                sx={{ borderRadius: 2, fontWeight: 700 }}
              >
                {fileAction === "download" ? "Downloading..." : "Download"}
              </Button>
            </Stack>

            <Stack direction="row" spacing={0.5}>
              <input
                ref={inputRef}
                type="file"
                hidden
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleReplace}
              />
              <Tooltip title="Replace resume">
                <IconButton
                  color="primary"
                  onClick={() => inputRef.current?.click()}
                  disabled={replaceMutation.isPending}
                  aria-label="replace resume"
                  size="small"
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    p: 1,
                  }}
                >
                  <RefreshIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete resume">
                <IconButton
                  color="error"
                  onClick={() => onDelete(resume.id)}
                  aria-label="delete resume"
                  size="small"
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    p: 1,
                  }}
                >
                  <DeleteIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
