import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { MovieInfoComponent } from "../movie-info/movie-info.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user',
  imports: [HeaderComponent, MovieInfoComponent, CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  username: string = '';
  user: any;
  reviews: any[] = [];
  isLoaded: boolean = false;

  constructor(private api:ApiService,private activeRoute:ActivatedRoute,private router:Router) { }

  ngOnInit(): void {
    this.username = this.activeRoute.snapshot.params['username'];
    this.api.getUserByName(this.username).subscribe((data:any)=>{
      this.user = data;
      this.getReviews();
    });
  }

  getReviews() {
    this.api.getAnotherUserReviews(this.user.user.id).subscribe((data: any) => {
      this.reviews = Array.isArray(data) ? data.map(review => ({
        ...review,
        title: review.movie_title,
        release_date: review.created_at,
        overview: review.review_text,
        vote_average: review.rating,
      })) : [];
      this.isLoaded = true;
    });
  }

  goToMovie(id: string) {
    this.router.navigate([`/movie/${id}`]);
  }

}
