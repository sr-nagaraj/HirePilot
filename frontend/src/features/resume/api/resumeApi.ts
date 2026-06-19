import { apiClient } from "../../../services/apiClient";
import type { Resume, ResumeUploadOptions } from "../types/resume";

export async function getResumes() {
  const { data } = await apiClient.get<Resume[]>("/api/resumes");
  return data;
}

export async function uploadResume({ file, onProgress }: ResumeUploadOptions) {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await apiClient.post<Resume>("/api/resumes/upload", formData, {
    onUploadProgress: (event) => {
      if (event.total && onProgress) {
        onProgress(Math.round((event.loaded * 100) / event.total));
      }
    },
  });

  return data;
}

export async function deleteResume(resumeId: number) {
  await apiClient.delete(`/api/resumes/${resumeId}`);
}

export async function getResumeFile(resumeId: number) {
  const { data } = await apiClient.get<Blob>(`/api/resumes/${resumeId}/file`, {
    responseType: "blob",
  });
  return data;
}

export async function previewResume(resumeId: number) {
  const previewWindow = window.open("", "_blank");

  try {
    const file = await getResumeFile(resumeId);
    const fileUrl = URL.createObjectURL(file);

    if (previewWindow) {
      previewWindow.opener = null;
      previewWindow.location.href = fileUrl;
    } else {
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    }

    window.setTimeout(() => URL.revokeObjectURL(fileUrl), 60_000);
  } catch (error) {
    previewWindow?.close();
    throw error;
  }
}

export async function downloadResume(resumeId: number, fileName: string) {
  const file = await getResumeFile(resumeId);
  const fileUrl = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = fileUrl;
  link.download = getResumeDisplayName(fileName);
  link.click();
  URL.revokeObjectURL(fileUrl);
}

export function getResumeDisplayName(fileName: string) {
  return fileName.replace(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}_/i,
    "",
  );
}

export async function replaceResume(resumeId: number, options: ResumeUploadOptions) {
  const uploaded = await uploadResume(options);
  await deleteResume(resumeId);
  return uploaded;
}

export function formatFileSize(bytes?: number) {
  if (!bytes) {
    return "Size unavailable";
  }

  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}
