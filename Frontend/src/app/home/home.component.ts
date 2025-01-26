import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { Observable, from } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Emitters } from '../emitters/emitters';
import { MoviePosterComponent } from "../movie-poster/movie-poster.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, CommonModule, MoviePosterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  trendingMovies: Observable<any[]> = new Observable();
  topRated: Observable<any[]> = new Observable();


  constructor(private apiService:ApiService,private auth:AuthService,private router:Router) { }

  ngOnInit(): void {
    this.trendingMovies = this.apiService.getPopularMovies();
    this.topRated = this.apiService.getTopRatedMovies();
  }

  onMovieClick(category:string,movie:any):void{
    this.router.navigate(['/movie',category,movie.id]);
  }
}
