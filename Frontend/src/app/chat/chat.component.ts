import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebSocketService } from '../services/websocket.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  imports: [ CommonModule,FormsModule ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: string[] = [];
  message: string = '';
  private wsSubscription!: Subscription;

  constructor(private wsService: WebSocketService) {}

  ngOnInit(): void {
    this.wsService.connect();
    this.wsSubscription = this.wsService.getMessages().subscribe({
      next: (msg: string) => this.messages.push(msg),
      error: (err) => console.error('WebSocket error:', err)
    });
  }

  sendMessage(): void {
    if (this.message.trim()) {
      this.wsService.sendMessage(this.message);
      this.message = '';
    }
  }

  ngOnDestroy(): void {
    this.wsService.disconnect();
    if (this.wsSubscription) {
      this.wsSubscription.unsubscribe();
    }
  }
}

