import { Component } from '@angular/core';
import { ApiService } from '../../service/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload',
  imports: [CommonModule],
  templateUrl: './upload.html',
  styleUrl: './upload.css'
})
export class Upload {
  selectedFile: File | null = null;
  uploading: boolean = false;
  message: string = '';

  constructor(private api: ApiService) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    if (!this.selectedFile) {
      this.message = '⚠️ Please select a file first!';
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.uploading = true;
    this.api.uploadDoc(formData).subscribe({
      next: (res: any) => {
        this.message = '✅ File uploaded successfully!';
        this.uploading = false;
        this.selectedFile = null;
      },
      error: () => {
        this.message = '❌ Error uploading file. Try again.';
        this.uploading = false;
      }
    });
  }
}
