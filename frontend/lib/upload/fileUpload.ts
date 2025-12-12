import { apiClient } from '../api/apiClient';

export interface UploadResponse {
  url: string;
  publicId: string;
  format: string;
  size: number;
  createdAt: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

class FileUploadService {
  /**
   * Upload file to server (local storage)
   */
  async uploadFile(
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return new Promise((resolve, reject) => {
      apiClient.upload('/api/upload', formData, {
        onUploadProgress: (progressEvent: any) => {
          if (onProgress && progressEvent.total) {
            const progress: UploadProgress = {
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total),
            };
            onProgress(progress);
          }
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
    });
  }

  /**
   * Upload multiple files
   */
  async uploadMultipleFiles(
    files: File[],
    onProgress?: (progress: UploadProgress, fileIndex: number) => void
  ): Promise<UploadResponse[]> {
    const uploadPromises = files.map((file, index) => 
      this.uploadFile(file, (progress) => {
        if (onProgress) {
          onProgress(progress, index);
        }
      })
    );

    try {
      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Upload profile image
   */
  async uploadProfileImage(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', 'profile');

    const response = await apiClient.upload('/api/upload/profile', formData);
    return response.data;
  }

  /**
   * Upload course thumbnail
   */
  async uploadCourseThumbnail(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', 'course');

    const response = await apiClient.upload('/api/upload/course', formData);
    return response.data;
  }

  /**
   * Upload assignment file
   */
  async uploadAssignment(file: File, assignmentId: string): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('assignmentId', assignmentId);

    const response = await apiClient.upload('/api/upload/assignment', formData);
    return response.data;
  }

  /**
   * Download file
   */
  async downloadFile(fileUrl: string, filename?: string): Promise<void> {
    try {
      const response = await apiClient.download(`/api/download/${encodeURIComponent(fileUrl)}`);
      
      // Create blob from response
      const blob = new Blob([response.data]);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || 'download';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    }
  }

  /**
   * Validate file before upload
   */
  validateFile(file: File, options: {
    maxSize?: number; // in bytes
    allowedTypes?: string[];
  }): { valid: boolean; error?: string } {
    const { maxSize = 10 * 1024 * 1024, allowedTypes = [] } = options;

    // Check file size
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size exceeds ${maxSize / (1024 * 1024)}MB limit`,
      };
    }

    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} is not allowed`,
      };
    }

    return { valid: true };
  }

  /**
   * Get file preview URL
   */
  getPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  /**
   * Revoke preview URL
   */
  revokePreviewUrl(url: string): void {
    URL.revokeObjectURL(url);
  }
}

export const fileUploadService = new FileUploadService();
export default fileUploadService;
