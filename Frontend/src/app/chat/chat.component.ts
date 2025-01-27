import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebSocketService } from '../services/websocket.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Pusher from 'pusher-js';
import { ApiService } from '../services/api.service';
interface Message {
  username: string;
  message:string;
}

@Component({
  selector: 'app-chat',
  imports: [ CommonModule,FormsModule ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  username = "username";
  message = "";
  messages: Message[] = [];
  users: string[] = [];
  pusherInstance:any;
  channel: any;
  currentUser = "";

  ngOnInit(): void {
    this.username = "username";
    this.users.push(this.username);
    this.pusherInstance = new Pusher("3e4c49a8b24aa3eaf880", {
      cluster: "eu"
    });

    this.channel = this.pusherInstance.subscribe("chat");
    this.channel.bind("message", (data:any) => {
      console.log(JSON.stringify(data))
      this.messages.push(data)
    })
  }
  constructor(private api:ApiService) {}

  send() {
    this.api.sendMessage(this.username, this.message).subscribe((data:any) => {
      console.log(data);
      this.message = "";
    })
  }
}

