import { Component } from '@angular/core';
import { AuthStateService } from '../services/auth-state.service';
import { HeaderComponent } from "../header/header.component";
import { ApiService } from '../services/api.service';
import { MovieInfoComponent } from "../movie-info/movie-info.component";
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-reviews',
  imports: [HeaderComponent, MovieInfoComponent, CommonModule],
  templateUrl: './user-reviews.component.html',
  styleUrl: './user-reviews.component.scss'
})
export class UserReviewsComponent {
  isAuthenticated: boolean = false;
  reviews: any[] = [];

  constructor(private authState: AuthStateService, private api: ApiService,private router:Router) { }

  ngOnInit(): void {
    this.authState.getAuthState().subscribe(val => {
      this.isAuthenticated = val;
    });

    this.api.getUserReviews().subscribe((data: any) => {
      this.reviews = Array.isArray(data) ? data.map(review => ({
        ...review,
        title: review.movie_title,
        release_date: review.created_at,
        overview: review.review_text,
        vote_average: review.rating,
      })) : [];
    });
  }

  goToMovie(id: string) {
    this.router.navigate([`/movie/${id}`]);
  }
}
