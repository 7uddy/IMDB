import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { ApiService } from '../services/api.service';
import { MoviePosterComponent } from "../movie-poster/movie-poster.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-films',
  imports: [HeaderComponent, MoviePosterComponent, CommonModule, FormsModule],
  templateUrl: './films.component.html',
  styleUrl: './films.component.scss'
})
export class FilmsComponent implements OnInit {
  filteredMovies: any;
  searchText: string = '';
  selectedGenre: string = '';
  selectedRating: string = '';
  selectedSort: string = '';
  page: string = '1';

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.api.getFilms(this.page).subscribe((movies) => {
      this.filteredMovies = movies;
    });
  }

  onSearch() {
    this.api.searchFilmsByText(this.searchText,this.page).subscribe((movies) => {
      this.filteredMovies = movies;
    });

  }

}
