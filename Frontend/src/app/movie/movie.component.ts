import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { ActivatedRoute, Router } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { MovieInfoComponent } from "../movie-info/movie-info.component";
import { AuthStateService } from '../services/auth-state.service';

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
  authenticated: boolean = false;
HomeComponent: any;

  constructor(private route:ActivatedRoute,private apiService:ApiService,private router:Router,private authState:AuthStateService) { }

  ngOnInit(): void {
    this.authState.getAuthState().subscribe(val => {
      this.authenticated = val;
    });
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    this.getMovie();
  }
  getMovie() {
    this.apiService.getMovieByID(this.id).subscribe((movie) => {
      this.movie = movie;
    });
  }

  goToReview(){
    this.router.navigate([`/movie/${this.id}/review`]);
  }
}
