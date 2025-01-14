import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { ActivatedRoute } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { RatingComponent } from "../rating/rating.component";

@Component({
  selector: 'app-movie',
  imports: [HeaderComponent, CommonModule, RatingComponent],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.scss'
})
export class MovieComponent implements OnInit {
  type: string = '';
  id: string = '';
  url: string = 'https://api.themoviedb.org/3/find/{external_id}';
  movie:any;
HomeComponent: any;

  constructor(private route:ActivatedRoute,private apiService:ApiService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.type = params['category'];
      this.id = params['id'];
    });
    this.getMovie();
  }
  getMovie() {
    // this.apiService.getMovieByID(this.id).subscribe((movie) => {
    //   this.movie = movie;
    // });
  }
}
