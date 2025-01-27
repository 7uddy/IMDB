import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Pusher from 'pusher-js';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';

interface Review {
  username: string;
  rating: string;
  review_text: string;
}

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  username = '';
  rating = '';
  review_text = '';
  reviews: Review[] = [];
  pusherInstance: any;
  channel: any;
  movieId: string = '';
  isLoading = true;

  constructor(private api: ApiService, private route: ActivatedRoute,private router:Router) {}

  ngOnInit(): void {
    this.movieId = this.route.snapshot.paramMap.get('id')!;

    this.api.getAllUsersReviews(this.movieId).subscribe(
      (reviews: any[]) => {
        const userRequests = reviews.map((review) =>
          this.api.getUsername(review.user_id)
        );

        forkJoin(userRequests).subscribe(
          (usernames: any) => {
            this.reviews = reviews.map((review, index) => ({
              ...review,
              username: usernames[index].username,
            }));
            console.log('Reviews with usernames:', this.reviews);
          },
          (error) => {
            console.error('Error fetching usernames:', error);
          },
          () => {
            this.isLoading = false;
          }
        );
      },
      (error: any) => {
        console.error('Error fetching reviews:', error);
        this.isLoading = false;
      }
    );

    this.pusherInstance = new Pusher('3e4c49a8b24aa3eaf880', {
      cluster: 'eu',
    });

    this.channel = this.pusherInstance.subscribe(`film.${this.movieId}`);

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

  goToUserProfile(review: Review) {
    this.router.navigate(['/user/'+review.username]);
  }
}
