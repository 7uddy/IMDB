import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-rating',
  imports: [CommonModule],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss'
})
export class RatingComponent implements OnChanges{
  @Input() averageRating: number = 0;
  @Input() isReadOnly: boolean = true;
  stars: string[] = [];

  ngOnChanges(): void {
    this.stars = this.getStars(this.averageRating);
  }

  getStars(rating: number): string[] {
    const maxStars = 5;
    const fullStars = Math.floor(rating / 2);
    const halfStar = rating % 2 >= 1 ? 1 : 0;
    const emptyStars = maxStars - fullStars - halfStar;

    this.stars= [
      ...Array(fullStars).fill('bi bi-star-fill text-warning'), // stele pline
      ...Array(halfStar).fill('bi bi-star-half text-warning'),  // stea jumătate
      ...Array(emptyStars).fill('bi bi-star text-muted')        // stele goale
    ];
    return this.stars;
  }
}

