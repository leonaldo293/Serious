'use client';

import { useState, useRef } from 'react';
import { uploadService, UploadResponse, UploadProgress } from '@/lib/api/uploads';
import { useToast } from '@/components/Toast';

interface UploadComponentProps {
  type: 'image' | 'video' | 'document';
  onUploadComplete: (response: UploadResponse) => void;
  onUploadError?: (error: Error) => void;
  currentFile?: UploadResponse | null;
  onRemove?: () => void;
  accept?: string;
  maxSize?: number;
  showPreview?: boolean;
  className?: string;
  disabled?: boolean;
}

export default function UploadComponent({
  type,
  onUploadComplete,
  onUploadError,
  currentFile,
  onRemove,
  accept,
  maxSize,
  showPreview = true,
  className = '',
  disabled = false
}: UploadComponentProps) {
  const { showToast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Configurações padrão por tipo
  const defaultConfig = {
    image: {
      accept: 'image/jpeg,image/jpg,image/png,image/webp',
      maxSize: 10 * 1024 * 1024, // 10MB
      label: 'Imagem'
    },
    video: {
      accept: 'video/mp4,video/avi,video/mov,video/wmv',
      maxSize: 50 * 1024 * 1024, // 50MB
      label: 'Vídeo'
    },
    document: {
      accept: 'application/pdf,application/zip,application/x-zip-compressed',
      maxSize: 20 * 1024 * 1024, // 20MB
      label: 'Documento'
    }
  };

  const config = defaultConfig[type];

  const handleFileSelect = async (file: File) => {
    if (disabled) return;

    try {
      // Validar arquivo
      if (!config.accept.split(',').includes(file.type)) {
        throw new Error(`Tipo de arquivo não permitido. Aceitos: ${config.accept}`);
      }

      if (file.size > (maxSize || config.maxSize)) {
        const maxSizeMB = (maxSize || config.maxSize) / (1024 * 1024);
        throw new Error(`Arquivo muito grande. Máximo permitido: ${maxSizeMB}MB`);
      }

      // Gerar preview para imagens
      if (type === 'image' && showPreview) {
        const previewUrl = await uploadService.getImagePreviewUrl(file);
        setPreview(previewUrl);
      }

      // Iniciar upload
      setUploading(true);
      setProgress({ loaded: 0, total: file.size, percentage: 0 });

      const response = await uploadService.uploadFile(file, type, (progress) => {
        setProgress(progress);
      });

      setProgress(null);
      setUploading(false);
      setPreview(null);
      onUploadComplete(response);
      showToast({
        type: 'success',
        title: 'Upload concluído com sucesso!',
        message: `${config.label} enviada com sucesso`
      });

    } catch (err: any) {
      setUploading(false);
      setProgress(null);
      setPreview(null);
      
      const errorMessage = err.message || 'Erro ao fazer upload';
      showToast({
        type: 'error',
        title: 'Erro no upload',
        message: errorMessage
      });
      onUploadError?.(err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = async () => {
    if (currentFile) {
      try {
        await uploadService.deleteFile(currentFile.fileId);
        showToast({
          type: 'success',
          title: 'Arquivo removido',
          message: 'Arquivo removido com sucesso'
        });
      } catch (err) {
        showToast({
          type: 'error',
          title: 'Erro ao remover',
          message: 'Não foi possível remover o arquivo'
        });
      }
    }
    onRemove?.();
  };

  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Se já existe um arquivo
  if (currentFile) {
    return (
      <div className={`relative group ${className}`}>
        <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          {type === 'image' ? (
            <img
              src={currentFile.url}
              alt="Uploaded file"
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="p-6 text-center">
              <div className="text-4xl mb-2">
                {type === 'video' ? '🎥' : '📄'}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {currentFile.originalName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {uploadService.formatFileSize(currentFile.size)}
              </p>
            </div>
          )}
        </div>
        
        {!disabled && (
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            title="Remover arquivo"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  }

  // Upload area
  return (
    <div className={className}>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-african-gold bg-african-gold/10'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept || config.accept}
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
        />

        {uploading && progress ? (
          <div className="space-y-4">
            <div className="text-4xl">⏳</div>
            <div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enviando {config.label.toLowerCase()}... {progress.percentage}%
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-african-gold h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {uploadService.formatFileSize(progress.loaded)} / {uploadService.formatFileSize(progress.total)}
              </div>
            </div>
          </div>
        ) : preview ? (
          <div className="space-y-4">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-32 object-cover rounded"
            />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Preview da imagem
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Clique para selecionar outra imagem
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-4xl">
              {type === 'image' ? '📷' : type === 'video' ? '🎥' : '📄'}
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Arraste e solte {config.label.toLowerCase()} aqui
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ou clique para selecionar
              </p>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500">
              <p>Tamanho máximo: {uploadService.formatFileSize(maxSize || config.maxSize)}</p>
              <p>Formatos: {config.accept.split(',').join(', ')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
