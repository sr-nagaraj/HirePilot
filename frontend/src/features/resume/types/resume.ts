export interface Resume {
  id: number;
  fileName: string;
  fileUrl?: string;
  fileSize?: number;
  contentType?: string;
  uploadedAt?: string;
}

export interface ResumeUploadOptions {
  file: File;
  onProgress?: (percent: number) => void;
}
