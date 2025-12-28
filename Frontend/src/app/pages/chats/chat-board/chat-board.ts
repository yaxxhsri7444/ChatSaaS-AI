import { Component, ElementRef, ViewChild, AfterViewChecked, OnInit } from '@angular/core';
import { ApiService } from '../../../service/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Message {
  text: string;
  sender: 'user' | 'bot';
  time: Date;
  sourceDocs?: any[]; // Optional: for showing sources
  error?: boolean; // Flag for error messages
}

@Component({
  selector: 'app-chat-board',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-board.html',
  styleUrl: './chat-board.css',
})
export class ChatBoard implements AfterViewChecked {
  @ViewChild('chatMessages') private chatMessagesContainer?: ElementRef;
  
  messages: Message[] = [];
  userInput: string = '';
  loading: boolean = false;
  sessionId: string = '';
  private shouldScrollToBottom = false;

  constructor(private api: ApiService) {
    // Generate a unique session ID for this chat
    this.sessionId = this.generateSessionId();
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private scrollToBottom(): void {
    try {
      if (this.chatMessagesContainer) {
        const element = this.chatMessagesContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  sendMessage() {
    const trimmedInput = this.userInput.trim();
    
    if (!trimmedInput) return;

    // Add user message
    const userMsg: Message = {
      sender: 'user',
      text: trimmedInput,
      time: new Date(),
    };
    this.messages.push(userMsg);
    this.shouldScrollToBottom = true;

    // Clear input immediately for better UX
    this.userInput = '';
    this.loading = true;

    // Send to backend
    this.api.chatQuery({ 
      text: trimmedInput,
      sessionId: this.sessionId 
    }).subscribe({
      next: (res: any) => {
        const botMsg: Message = {
          sender: 'bot',
          text: res.reply || 'No response from bot.',
          time: new Date(),
          sourceDocs: res.sourceDocs || [],
        };
        this.messages.push(botMsg);
        this.loading = false;
        this.shouldScrollToBottom = true;
      },
      error: (err) => {
        console.error('Chat error:', err);
        
        // Add error message
        this.messages.push({
          text: err.error?.error || 'Failed to send message. Please try again.',
          sender: 'bot',
          time: new Date(),
          error: true,
        });
        this.loading = false;
        this.shouldScrollToBottom = true;
      },
    });
  }

  endChat() {
    const confirmEnd = confirm('Are you sure you want to end this chat?');
    if (confirmEnd) {
      this.messages = [];
      this.userInput = '';
      this.sessionId = this.generateSessionId();
      // You can also navigate away or emit an event here
    }
  }

  // Optional: Retry last message if there was an error
  retryLastMessage() {
    // Find the last user message
    for (let i = this.messages.length - 1; i >= 0; i--) {
      if (this.messages[i].sender === 'user') {
        this.userInput = this.messages[i].text;
        // Remove error message if exists
        if (i + 1 < this.messages.length && this.messages[i + 1].error) {
          this.messages.splice(i + 1, 1);
        }
        this.sendMessage();
        break;
      }
    }
  }
}