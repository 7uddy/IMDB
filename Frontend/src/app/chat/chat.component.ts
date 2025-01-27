import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebSocketService } from '../services/websocket.service';
import { forkJoin, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Pusher from 'pusher-js';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
interface Review {
  username: string;
  rating: string;
  review_text: string;
}

@Component({
  selector: 'app-chat',
  imports: [ CommonModule,FormsModule ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  username = ''; // Numele utilizatorului
  rating = ''; // Rating-ul filmului
  review_text = ''; // Conținutul review-ului
  reviews: Review[] = []; // Lista de review-uri
  pusherInstance: any;
  channel: any;
  movieId: string=''; // ID-ul filmului curent
  isLoading = true; // Variabila pentru loading


  constructor(private api: ApiService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.movieId = '939243';
    //this.route.snapshot.paramMap.get('id')!; // Obține ID-ul filmului din URL

    this.api.getAllUsersReviews(this.movieId).subscribe(
      (reviews: any[]) => {
        // Obține toate user_id-urile din review-uri
        const userRequests = reviews.map((review) =>
          this.api.getUsername(review.user_id)
        );

        // Folosim forkJoin pentru a obține username-urile în paralel
        forkJoin(userRequests).subscribe(
          (usernames: any) => {
            // Combinați review-urile cu username-urile corespunzătoare
            this.reviews = reviews.map((review, index) => ({
              ...review,
              username: usernames[index].username, // Adaugă username-ul din răspunsul API
            }));
            console.log('Review-urile filmului cu username-uri:', this.reviews);
          },
          (error) => {
            console.error('Eroare la obținerea username-urilor:', error);
          }
        );
        this.isLoading = false; // Setează isLoading la false când datele sunt încărcate
      },
      (error: any) => {
        console.error('Eroare la obținerea review-urilor:', error);
        this.isLoading = false; // Setează isLoading la false când datele sunt încărcate
      }
    );

    // Conectează-te la canalul Pusher dedicat filmului
    this.pusherInstance = new Pusher('3e4c49a8b24aa3eaf880', {
      cluster: 'eu',
    });

    this.channel = this.pusherInstance.subscribe(`film.${this.movieId}`);

    // Ascultă evenimentul de review adăugat
    this.channel.bind('review.added', (data: any) => {
      console.log(data);
      this.reviews.push({
        username: data.username,
        rating: data.rating,
        review_text: data.content,
      });
    });
  }

  ngOnDestroy(): void {
    this.pusherInstance.unsubscribe(`film.${this.movieId}`);
  }
}

