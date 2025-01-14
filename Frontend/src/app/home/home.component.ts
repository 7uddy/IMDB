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
    this.router.navigate(['/movie',category,movie.id]);
  }
}
