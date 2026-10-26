import React, { useRef, useState } from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  FileCode,
  Sparkles,
  Info,
  RefreshCw,
  Eye,
  EyeOff,
} from 'lucide-react';
import { UploadedFileState } from '../types/resume';
import { SAMPLE_RESUME_TEXT } from '../data/sampleResume';

interface ResumeUploadProps {
  fileState: UploadedFileState | null;
  onFileProcessed: (state: UploadedFileState) => void;
  onClearFile: () => void;
  onLoadSample: () => void;
  disabled?: boolean;
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({
  fileState,
  onFileProcessed,
  onClearFile,
  onLoadSample,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showExtractedPreview, setShowExtractedPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = async (file: File) => {
    setErrorMessage(null);

    // 1. Validate File Size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(
        `File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). The maximum allowed upload size is 5 MB.`
      );
      return;
    }

    if (file.size === 0) {
      setErrorMessage('The selected file is empty (0 bytes). Please select a valid resume.');
      return;
    }

    // 2. Validate Extension and MIME
    const nameLower = file.name.toLowerCase();
    const isPdf = nameLower.endsWith('.pdf') || file.type === 'application/pdf';
    const isDocx =
      nameLower.endsWith('.docx') ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    if (!isPdf && !isDocx) {
      setErrorMessage('Unsupported format. Please upload a PDF (.pdf) or Word document (.docx).');
      return;
    }

    setIsProcessing(true);

    // Set initial loading state
    onFileProcessed({
      name: file.name,
      size: file.size,
      type: isPdf ? 'PDF' : 'DOCX',
      text: '',
      status: 'uploading',
    });

    try {
      // Convert file to base64
      const reader = new FileReader();

      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read file from disk.'));
        reader.readAsDataURL(file);
      });

      const base64Data = await base64Promise;

      // Send to server-side parser
      const response = await fetch('/api/extract-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileBase64: base64Data,
          fileName: file.name,
          mimeType: file.type,
          fileSize: file.size,
        }),
      });

      const responseText = await response.text();
      let result: any;
      try {
        result = JSON.parse(responseText);
      } catch {
        throw new Error(
          `Resume processing endpoint returned a non-JSON response (HTTP ${response.status}). Check the Vercel API route deployment.`
        );
      }

      if (!response.ok) {
        throw new Error(result.error || 'Failed to extract text from document.');
      }

      onFileProcessed({
        name: file.name,
        size: file.size,
        type: isPdf ? 'PDF' : 'DOCX',
        text: result.text,
        wordCount: result.wordCount,
        pageCount: result.pageCount,
        status: 'ready',
      });
      setShowExtractedPreview(false);
    } catch (err: any) {
      console.error('File extraction error:', err);
      const msg = err.message || 'Failed to extract text from document.';
      setErrorMessage(msg);
      onFileProcessed({
        name: file.name,
        size: file.size,
        type: isPdf ? 'PDF' : 'DOCX',
        text: '',
        status: 'error',
        errorMessage: msg,
      });
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
      {/* Title & Guidelines */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <span>1. Upload Your Resume</span>
            <span className="text-xs font-normal text-slate-500">
              (PDF or DOCX • Max 5 MB)
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Selectable-text PDF or Word documents. Used as the factual source of truth.
          </p>
        </div>

        {/* Load Sample Button */}
        {!fileState?.text && (
          <button
            type="button"
            onClick={onLoadSample}
            disabled={disabled || isProcessing}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors w-fit"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Try Sample Resume</span>
          </button>
        )}
      </div>

      {/* Upload Zone or Loaded File Card */}
      {!fileState || fileState.status === 'error' ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && !isProcessing && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50/60 scale-[1.005]'
              : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/70 bg-slate-50/30'
          } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileInputChange}
            disabled={disabled || isProcessing}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shadow-xs">
              {isProcessing ? (
                <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
              ) : (
                <Upload className="w-6 h-6" />
              )}
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">
                {isProcessing
                  ? 'Extracting and parsing resume text...'
                  : 'Click to upload or drag & drop your resume'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Supports PDF (.pdf) and Microsoft Word (.docx) up to 5 MB
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Loaded File Card */
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  fileState.type === 'PDF'
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {fileState.name}
                  </p>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-slate-200 text-slate-700">
                    {fileState.type}
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-xs text-slate-500 mt-0.5">
                  <span>{formatFileSize(fileState.size)}</span>
                  {fileState.wordCount && (
                    <>
                      <span>•</span>
                      <span>{fileState.wordCount.toLocaleString()} words</span>
                    </>
                  )}
                  {fileState.pageCount && (
                    <>
                      <span>•</span>
                      <span>
                        {fileState.pageCount} page
                        {fileState.pageCount > 1 ? 's' : ''}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowExtractedPreview(!showExtractedPreview)}
                className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 transition-colors"
                title={showExtractedPreview ? 'Hide preview' : 'View extracted text'}
              >
                {showExtractedPreview ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold px-2 py-1 rounded-md hover:bg-blue-50 transition-colors"
              >
                Replace
              </button>

              <button
                type="button"
                onClick={onClearFile}
                disabled={disabled}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Remove resume"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileInputChange}
            disabled={disabled || isProcessing}
            className="hidden"
          />

          {/* Success Status Pill */}
          <div className="flex items-center space-x-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200/80">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Resume parsed successfully. Facts locked as source of truth.
            </span>
          </div>

          {/* Extracted text accordion preview */}
          {showExtractedPreview && (
            <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200 max-h-48 overflow-y-auto text-xs text-slate-700 whitespace-pre-wrap font-mono leading-relaxed">
              <div className="text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                Extracted Text Content:
              </div>
              {fileState.text}
            </div>
          )}
        </div>
      )}

      {/* Error Message Display */}
      {errorMessage && (
        <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Unable to process document</p>
            <p className="mt-0.5 text-rose-700">{errorMessage}</p>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-400 hover:text-rose-700"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Privacy Notice Notice Bar */}
      <div className="flex items-center space-x-2 text-[11px] text-slate-500 bg-slate-50/80 px-3 py-2 rounded-lg border border-slate-200/60">
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>
          <strong className="text-slate-700">Privacy Notice:</strong> Resume content is processed in-memory for your active session only. No user accounts, database profiles, or permanent document copies are created.
        </span>
      </div>
    </div>
  );
};
