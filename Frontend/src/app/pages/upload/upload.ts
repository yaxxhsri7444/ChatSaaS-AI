import { Component } from '@angular/core';
import { ApiService } from '../../service/api';
import { CommonModule } from '@angular/common';

interface UploadedFile {
  name: string;
  size: number;
  uploadedAt: Date;
  id?: string;
}

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload.html',
  styleUrl: './upload.css'
})
export class Upload {
  selectedFile: File | null = null;
  uploading = false;
  uploadProgress = 0;
  message = '';
  messageType: 'success' | 'error' | 'info' = 'info';
  isDragOver = false;
  uploadedFiles: UploadedFile[] = [];

  // File validation constants
  readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  readonly ALLOWED_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  readonly ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.txt'];

  constructor(private api: ApiService) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.validateAndSetFile(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.validateAndSetFile(files[0]);
    }
  }

  validateAndSetFile(file: File) {
    // Reset previous messages
    this.message = '';

    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      this.showMessage(
        `❌ File too large. Maximum size is ${this.MAX_FILE_SIZE / 1024 / 1024}MB`,
        'error'
      );
      return;
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!this.ALLOWED_EXTENSIONS.includes(fileExtension || '')) {
      this.showMessage(
        '❌ Invalid file type. Only PDF, DOCX, and TXT files are allowed.',
        'error'
      );
      return;
    }

    // File is valid
    this.selectedFile = file;
    this.showMessage(
      `✅ File "${file.name}" selected and ready to upload`,
      'success'
    );
  }

  removeFile() {
    this.selectedFile = null;
    this.message = '';
    this.uploadProgress = 0;
  }

  uploadFile() {
    if (!this.selectedFile) {
      this.showMessage('⚠️ Please select a file first!', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.uploading = true;
    this.uploadProgress = 0;
    this.showMessage('📤 Uploading...', 'info');

    // Simulate progress (you can use HttpClient progress events for real progress)
    const progressInterval = setInterval(() => {
      if (this.uploadProgress < 90) {
        this.uploadProgress += 10;
      }
    }, 200);

    this.api.uploadDoc(formData).subscribe({
      next: (res: any) => {
        clearInterval(progressInterval);
        this.uploadProgress = 100;
        this.uploading = false;

        // Add to uploaded files list
        this.uploadedFiles.unshift({
          name: this.selectedFile!.name,
          size: this.selectedFile!.size,
          uploadedAt: new Date(),
          id: res.documentId || res.id
        });

        this.showMessage('✅ File uploaded and processed successfully!', 'success');
        
        // Reset form after 2 seconds
        setTimeout(() => {
          this.selectedFile = null;
          this.uploadProgress = 0;
        }, 2000);
      },
      error: (err) => {
        clearInterval(progressInterval);
        this.uploading = false;
        this.uploadProgress = 0;
        
        const errorMsg = err.error?.error || err.error?.message || 'Unknown error occurred';
        this.showMessage(`❌ Upload failed: ${errorMsg}`, 'error');
        
        console.error('Upload error:', err);
      }
    });
  }

  private showMessage(msg: string, type: 'success' | 'error' | 'info') {
    this.message = msg;
    this.messageType = type;

    // Auto-hide success/info messages after 5 seconds
    if (type !== 'error') {
      setTimeout(() => {
        if (this.messageType !== 'error') {
          this.message = '';
        }
      }, 5000);
    }
  }

  getFileIcon(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return '📕';
      case 'docx': return '📘';
      case 'txt': return '📄';
      default: return '📁';
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)} hours ago`;
    return date.toLocaleDateString();
  }
}