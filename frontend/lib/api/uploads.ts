// API service para uploads de arquivos

export interface UploadResponse {
  url: string;
  fileId: string;
  type: 'image' | 'video' | 'document';
  originalName: string;
  size: number;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

class UploadService {
  private baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  // Upload de imagem (thumbnail, banner, etc)
  async uploadImage(
    file: File, 
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResponse> {
    return this.uploadFile(file, 'image', onProgress);
  }

  // Upload de vídeo (lições)
  async uploadVideo(
    file: File, 
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResponse> {
    return this.uploadFile(file, 'video', onProgress);
  }

  // Upload de documentos (PDF, ZIP, etc)
  async uploadDocument(
    file: File, 
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResponse> {
    return this.uploadFile(file, 'document', onProgress);
  }

  // Método genérico de upload
  async uploadFile(
    file: File,
    type: 'image' | 'video' | 'document',
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    // Validar tipo de arquivo
    this.validateFileType(file, type);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Configurar progress
      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress: UploadProgress = {
              loaded: event.loaded,
              total: event.total,
              percentage: Math.round((event.loaded / event.total) * 100)
            };
            onProgress(progress);
          }
        });
      }

      // Configurar completion
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new Error('Erro ao processar resposta do servidor'));
          }
        } else {
          reject(new Error(`Upload falhou: ${xhr.status}`));
        }
      });

      // Configurar error
      xhr.addEventListener('error', () => {
        reject(new Error('Erro de conexão durante upload'));
      });

      // Configurar timeout
      xhr.timeout = 300000; // 5 minutos para vídeos
      xhr.addEventListener('timeout', () => {
        reject(new Error('Timeout durante upload'));
      });

      // Enviar requisição
      xhr.open('POST', `${this.baseURL}/uploads/${type}`);
      
      // Adicionar token de autenticação
      const token = localStorage.getItem('token');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.send(formData);
    });
  }

  // Deletar arquivo
  async deleteFile(fileId: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.baseURL}/uploads/${fileId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao deletar arquivo');
    }
  }

  // Validação de tipos de arquivo
  private validateFileType(file: File, type: 'image' | 'video' | 'document'): void {
    const allowedTypes = {
      image: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      video: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'],
      document: ['application/pdf', 'application/zip', 'application/x-zip-compressed', 
                'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'text/plain', 'text/csv']
    };

    if (!allowedTypes[type].includes(file.type)) {
      throw new Error(`Tipo de arquivo não permitido para ${type}: ${file.type}`);
    }

    // Validar tamanho (máximo 50MB para vídeos, 10MB para imagens, 20MB para documentos)
    const maxSize = type === 'video' ? 50 * 1024 * 1024 : 
                   type === 'image' ? 10 * 1024 * 1024 : 
                   20 * 1024 * 1024;

    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      throw new Error(`Arquivo muito grande. Máximo permitido: ${maxSizeMB}MB`);
    }
  }

  // Gerar URL de preview para imagens
  getImagePreviewUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Arquivo não é uma imagem'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.onerror = () => {
        reject(new Error('Erro ao ler arquivo'));
      };
      reader.readAsDataURL(file);
    });
  }

  // Formatar tamanho do arquivo
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export const uploadService = new UploadService();
