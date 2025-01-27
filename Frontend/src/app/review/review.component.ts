import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStateService } from '../services/auth-state.service';

@Component({
  selector: 'app-review',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss'
})
export class ReviewComponent {
  isAuthenticated: boolean = false;
  isLoaded: boolean = false;
  movie: any;
  posterImagePath: string = '';
  movieId: any;
  reviewForm: FormGroup;
  errorMessage: string = '';

  constructor(private api: ApiService, private route: ActivatedRoute, private fb: FormBuilder, private router: Router, private authState: AuthStateService) {
    this.reviewForm = this.fb.group({
      rating: [null, [Validators.required, Validators.min(1), Validators.max(10)]],
      reviewText: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.authState.getAuthState().subscribe(val => {
      this.isAuthenticated = val;
    });
    this.route.paramMap.subscribe(params => {
      this.movieId = params.get('id');
    });

    this.api.getMovieByID(this.movieId).subscribe((movie) => {
      this.movie = movie;
      this.posterImagePath = movie.poster_path;
      this.isLoaded = true;
    });

    this.api.hasReview(this.movieId).subscribe((response: any) => {
      if (response && response.rating) {
        this.reviewForm.patchValue({
          rating: response.rating,
          reviewText: response.review_text
        });
      }
    });
  }

  submitReview() {
    if (this.reviewForm.valid) {
      const reviewData = {
        movie_id: this.movieId,
        movie_title: this.movie.title,
        poster_path: this.posterImagePath,
        rating: this.reviewForm.value.rating,
        review_text: this.reviewForm.value.reviewText
      };
      this.api.addReview(reviewData).subscribe({
        next: (user) => {
          this.router.navigate([`/movie/${this.movieId}`]);
        },
        error: (error) => {
          if (error.error && error.error.error) {
            this.errorMessage = error.error.error;
          } else {
            this.errorMessage = error.error || 'An unknown error occurred';
          }
        }
      });
    }
    else {
      this.errorMessage = 'Please fill in all the fields correctly';
    }
  }

  cancelReview() {
    this.router.navigate([`/movie/${this.movieId}`]);
  }
}
