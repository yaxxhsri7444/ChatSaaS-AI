import { Component, ElementRef, OnInit } from '@angular/core';
import { ApiService } from '../../../service/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
export interface Message {
  text: string;
  sender: 'user' | 'bot';
  time: Date;
}

@Component({
  selector: 'app-chat-board',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-board.html',
  styleUrl: './chat-board.css',
})
export class ChatBoard {
endChat() {
throw new Error('Method not implemented.');
}messages: Message[] = [];
  userInput: string = '';
  loading: boolean = false;

  constructor(private api: ApiService) {}

  sendMessage() {
    if (!this.userInput.trim()) return;

    const userMsg: Message = {
      sender: 'user',
      text: this.userInput,
      time: new Date(),
    };
    this.messages.push(userMsg);

    this.loading = true;

    // backend expects { text, sessionId } and returns { reply, sourceDocs, intent }
    this.api.chatQuery({ text: this.userInput }).subscribe({
      next: (res: any) => {
        const botMsg: Message = {
          sender: 'bot',
          text: res.reply || 'No response from bot.',
          time: new Date(),
        };
        this.messages.push(botMsg);
        this.loading = false;
      },
      error: () => {
        // show an error bot message instead of duplicating user's message
        this.messages.push({
          text: 'Failed to send message. Please try again.',
          sender: 'bot',
          time: new Date(),
        });

        this.loading = false;
      },
    });

    this.userInput = '';
  }
}
