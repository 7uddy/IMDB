import { Component, Input } from '@angular/core';
import { RatingComponent } from "../rating/rating.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-poster',
  imports: [RatingComponent],
  templateUrl: './movie-poster.component.html',
  styleUrl: './movie-poster.component.scss'
})
export class MoviePosterComponent {
  @Input() movie: any;

  constructor(private router:Router) { }

  onMovieClick(movie: any): void {
    this.router.navigate(['/movie',movie.id]);
  }

}
