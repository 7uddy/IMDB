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
  username = ''; // User's name
  rating = ''; // Movie rating
  review_text = ''; // Review text content
  reviews: Review[] = []; // List of reviews
  pusherInstance: any;
  channel: any;
  movieId: string = ''; // Current movie ID
  isLoading = true; // Loading state

  constructor(private api: ApiService, private route: ActivatedRoute,private router:Router) {}

  ngOnInit(): void {
    this.movieId = this.route.snapshot.paramMap.get('id')!; // Get movie ID from URL

    // Fetch reviews from the API
    this.api.getAllUsersReviews(this.movieId).subscribe(
      (reviews: any[]) => {
        // Get all user IDs from the reviews
        const userRequests = reviews.map((review) =>
          this.api.getUsername(review.user_id)
        );

        // Use forkJoin to fetch usernames in parallel
        forkJoin(userRequests).subscribe(
          (usernames: any) => {
            // Combine reviews with the corresponding usernames
            this.reviews = reviews.map((review, index) => ({
              ...review,
              username: usernames[index].username, // Add the username from the API response
            }));
            console.log('Reviews with usernames:', this.reviews);
          },
          (error) => {
            console.error('Error fetching usernames:', error);
          },
          () => {
            // Finally set loading to false after reviews and usernames are combined
            this.isLoading = false;
          }
        );
      },
      (error: any) => {
        console.error('Error fetching reviews:', error);
        this.isLoading = false; // Set loading state to false in case of error
      }
    );

    // Connect to Pusher channel for the movie
    this.pusherInstance = new Pusher('3e4c49a8b24aa3eaf880', {
      cluster: 'eu',
    });

    this.channel = this.pusherInstance.subscribe(`film.${this.movieId}`);

    // Listen for new reviews being added in real-time
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
    // Unsubscribe from the Pusher channel when the component is destroyed
    this.pusherInstance.unsubscribe(`film.${this.movieId}`);
  }

  goToUserProfile(){
    this.router.navigate(['/user/'+this.username]);
  }
}
