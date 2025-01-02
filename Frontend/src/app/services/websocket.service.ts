import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket | null = null;

  private readonly WS_ENDPOINT = 'ws://localhost:8080';

  private messageSubject: Subject<any> = new Subject<any>();


  constructor() {}

  connect(): void {
    if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
      this.socket = new WebSocket(this.WS_ENDPOINT);

      this.socket.onopen = () => {
        console.log('Connected to WebSocket server');
      };

      this.socket.onmessage = (event) => {
        console.log('Message received:', event.data);
        this.messageSubject.next(event.data);
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.socket.onclose = () => {
        console.log('Disconnected from WebSocket server');
        this.messageSubject.complete();
      };
    }
  }

  sendMessage(message: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error('WebSocket connection is not open');
    }
  }

  getMessages(): Observable<any> {
    if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
      throw new Error('WebSocket connection is not established');
    }
    console.log('Listening for messages from WebSocket server');
    return this.messageSubject.asObservable();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      console.log('Disconnected from WebSocket server');
    }
  }
}
