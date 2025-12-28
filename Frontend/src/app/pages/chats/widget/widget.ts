import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../service/auth';

interface WidgetConfig {
  businessId: string;
  theme: 'light' | 'dark';
  position: 'bottom-right' | 'bottom-left';
  primaryColor: string;
  welcomeMessage: string;
}

@Component({
  selector: 'app-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './widget.html',
  styleUrl: './widget.css'
})
export class Widget implements OnInit {
  copySuccess = false;
  businessId = '';
  
  config: WidgetConfig = {
    businessId: '',
    theme: 'dark',
    position: 'bottom-right',
    primaryColor: '#4F46E5',
    welcomeMessage: 'Hi! How can I help you today?'
  };

  constructor(private auth: AuthService) {}

  ngOnInit() {
    // Get businessId from auth service
    this.businessId = this.auth.getBusinessId() || 'YOUR_BUSINESS_ID';
    this.config.businessId = this.businessId;
  }

  get widgetCode(): string {
    return `<script src="https://cdn.chatsaas.ai/widget.js"></script>
<script>
  ChatSaaSWidget.init({
    businessId: "${this.config.businessId}",
    theme: "${this.config.theme}",
    position: "${this.config.position}",
    primaryColor: "${this.config.primaryColor}",
    welcomeMessage: "${this.config.welcomeMessage}"
  });
</script>`;
  }

  async copyCode() {
    try {
      await navigator.clipboard.writeText(this.widgetCode);
      this.copySuccess = true;
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        this.copySuccess = false;
      }, 3000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      this.fallbackCopy();
    }
  }

  private fallbackCopy() {
    const textArea = document.createElement('textarea');
    textArea.value = this.widgetCode;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      document.execCommand('copy');
      this.copySuccess = true;
      setTimeout(() => {
        this.copySuccess = false;
      }, 3000);
    } catch (err) {
      console.error('Fallback copy failed:', err);
    }
    
    document.body.removeChild(textArea);
  }

  updateConfig() {
    // Trigger code regeneration by updating the getter
    console.log('Config updated:', this.config);
  }
}