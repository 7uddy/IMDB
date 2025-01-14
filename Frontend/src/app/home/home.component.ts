import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { Observable, from } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { RatingComponent } from "../rating/rating.component";
import { AuthService } from '../services/auth.service';
import { Emitters } from '../emitters/emitters';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, CommonModule, RatingComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  trendingMovies: Observable<any[]> = new Observable();
  topRated: Observable<any[]> = new Observable();


  constructor(private apiService:ApiService,private auth:AuthService,private router:Router) { }

  ngOnInit(): void {

    this.auth.getUser().subscribe({
      next: (user) => {
        Emitters.authEmitter.emit(true);
      },
      error: (error) => {
        Emitters.authEmitter.emit(false);
      }
    });

    this.trendingMovies = this.apiService.getPopularMovies();
    this.topRated = this.apiService.getTopRatedMovies();
  }

  onMovieClick(category:string,movie:any):void{
    console.log('You clicked on:', movie.title);
    this.router.navigate(['/movie',category,movie.id]);
  }


  getMovies(limit: number, url:string): Observable<any[]> {
    const headers = {
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiOGM0MjBkNzJjNWIzODViMWY1YjBiOTIzNWFlNGU2OCIsIm5iZiI6MTczMjU1MDA5Ny4yNzU4MjksInN1YiI6IjY3NDQ5Y2EwN2I4MjVlNjg1YjRlYzBmZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.eEnFkZ9mJQw6FoSmJSQgG8w_OSWb0hZ4IfWfhca-zdI',
      accept: 'application/json',
    };

    return from(
      fetch(url, { headers })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => data.results.slice(0, limit))
    );
  }

}
