import { Component, Input } from '@angular/core';
import { RatingComponent } from "../rating/rating.component";

@Component({
  selector: 'app-movie-info',
  imports: [RatingComponent],
  templateUrl: './movie-info.component.html',
  styleUrl: './movie-info.component.scss'
})
export class MovieInfoComponent {
  @Input() movie: any;
}
