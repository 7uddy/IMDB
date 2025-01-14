import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { ActivatedRoute } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { MovieInfoComponent } from "../movie-info/movie-info.component";

@Component({
  selector: 'app-movie',
  imports: [HeaderComponent, CommonModule, MovieInfoComponent],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.scss'
})
export class MovieComponent implements OnInit {
  category: string = '';
  id: string = '';
  movie:any;
HomeComponent: any;

  constructor(private route:ActivatedRoute,private apiService:ApiService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.category = params['category'];
      this.id = params['id'];
    });
    this.getMovie();
  }
  getMovie() {
    this.apiService.getMovieByID(this.id).subscribe((movie) => {
      this.movie = movie;
    });
  }
}
