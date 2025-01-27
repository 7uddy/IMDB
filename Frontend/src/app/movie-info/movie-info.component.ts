import { Component, Input } from '@angular/core';
import { RatingComponent } from "../rating/rating.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-info',
  imports: [RatingComponent, CommonModule],
  templateUrl: './movie-info.component.html',
  styleUrl: './movie-info.component.scss'
})
export class MovieInfoComponent {
  @Input() movie: any;
}
