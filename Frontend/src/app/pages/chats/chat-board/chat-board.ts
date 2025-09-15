import { Component, ElementRef, OnInit } from '@angular/core';
import { ApiService } from '../../../service/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Message } from 'postcss';


interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
  time: string;
}

@Component({
  selector: 'app-chat-board',
  imports: [CommonModule,FormsModule],
  templateUrl: './chat-board.html',
  styleUrl: './chat-board.css'
})
export class ChatBoard {
  messages: Message[] = [];
  userInput: string = '';
  loading: boolean = false;

  constructor(private api: ApiService) {}

  sendMessage() {
    if (!this.userInput.trim()) return;

    const userMsg: Message = {
      sender: 'user',
      text: this.userInput,
      time: new Date(),
      type: ''
    };
    this.messages.push(userMsg);

    this.loading = true;

    this.api.chatQuery({ query: this.userInput }).subscribe({
      next: (res: any) => {
        const botMsg: Message = {
          sender: 'bot',
          text: res.answer || 'No response from bot.',
          time: new Date(),
          type: ''
        };
        this.messages.push(botMsg);
        this.loading = false;
      },
      error: () => {
        this.messages.push({
          sender: 'bot',
          text: '⚠️ Error: Unable to get response',
          time: new Date(),
          type: ''
        });
        this.loading = false;
      }
    });

    this.userInput = '';
  }
}

