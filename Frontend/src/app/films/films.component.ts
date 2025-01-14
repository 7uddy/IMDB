import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { ApiService } from '../services/api.service';
import { MoviePosterComponent } from "../movie-poster/movie-poster.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-films',
  imports: [HeaderComponent, MoviePosterComponent, CommonModule, FormsModule],
  templateUrl: './films.component.html',
  styleUrl: './films.component.scss'
})
export class FilmsComponent implements OnInit {

  filteredMovies: any;
  searchText: string = '';
  searchSubject: Subject<string> = new Subject();
  isLoading=true;

  selectedGenre: string = 'all';
  selectedSort: string = '';
  page: number = 1;
  hasNextPage: any;

  constructor(private api: ApiService) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(searchText => this.onSearch(searchText))
    ).subscribe(movies => {
      this.filteredMovies = movies;
      this.page++;
      this.onSearch(this.searchText).subscribe((movies) => { this.hasNextPage = movies.length > 1; });
      this.page--;
      this.sortMovies();
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.api.getFilms(this.page).subscribe((movies) => {
      this.filteredMovies = movies;
      this.isLoading = false;
    });
    this.api.getFilms(this.page+1).subscribe((movies) => {
      this.hasNextPage = movies.length > 1;
    });
  }

  onSearchTextChange() {
    this.searchSubject.next(this.searchText);
  }

  onSearch(searchText: string) {
    if (searchText === '') return this.api.getFilms(this.page);
    return this.api.searchFilmsByText(searchText, this.page);
  }

  goToPreviousPage() {
    if (this.page > 1 && this.searchText === '' && this.selectedGenre==='all') {
      this.page--;
      this.api.getFilms(this.page).subscribe((movies) => {
        this.filteredMovies = movies;
        this.hasNextPage = true;
        this.sortMovies();
      });
      this.scrollToTop();
    }
    else if (this.page > 1 && this.searchText !== '' && this.selectedGenre==='all') {
      this.page--;
      this.api.searchFilmsByText(this.searchText, this.page).subscribe((movies) => {
        this.filteredMovies = movies;
        this.hasNextPage = true;
        this.sortMovies();
      });
      this.scrollToTop();
    }
    else if(this.page > 1 && this.selectedGenre!=='all'){
      this.page--;
      this.api.searchFilmsByGenre(this.selectedGenre, this.page,this.selectedSort).subscribe((movies) => {
        this.filteredMovies = movies;
        this.hasNextPage = true;
      });
      this.scrollToTop();
    }
  }

  goToNextPage() {
    if (this.hasNextPage && this.searchText === '' && this.selectedGenre==='all') {
      this.page++;
      this.api.getFilms(this.page).subscribe((movies) => {
        this.filteredMovies = movies;
        this.sortMovies();
      });
      this.api.getFilms(this.page+1).subscribe((movies) => {
        this.hasNextPage = movies.length > 1;
      });
      this.scrollToTop();
    }
    else if (this.hasNextPage && this.searchText !== '' && this.selectedGenre==='all') {
      this.page++;
      this.api.searchFilmsByText(this.searchText, this.page).subscribe((movies) => {
        this.filteredMovies = movies;
        this.sortMovies();
      });
      this.api.searchFilmsByText(this.searchText, this.page+1).subscribe((movies) => {
        this.hasNextPage = movies.length > 1;
      });
      this.scrollToTop();
    }
    else if(this.hasNextPage && this.selectedGenre!=='all'){
      this.page++;
      this.api.searchFilmsByGenre(this.selectedGenre, this.page,this.selectedSort).subscribe((movies) => {
        this.filteredMovies = movies;
      });
      this.api.searchFilmsByGenre(this.selectedGenre, this.page+1,this.selectedSort).subscribe((movies) => {
        this.hasNextPage = movies.length > 1;
      });
      this.scrollToTop();
    }
  }

  onGenreChange() {
    if(this.selectedGenre==='all')
    {
      this.api.getFilms(this.page).subscribe((movies) => {
        this.filteredMovies = movies;
        this.sortMovies();
      });
      this.api.getFilms(this.page+1).subscribe((movies) => {
        this.hasNextPage = movies.length > 1;
      });
      return;
    }
    this.api.searchFilmsByGenre(this.selectedGenre, this.page,this.selectedSort).subscribe((movies) => {
      this.filteredMovies = movies;
    });
    this.api.searchFilmsByGenre(this.selectedGenre, this.page+1,this.selectedSort).subscribe((movies) => {
      this.hasNextPage = movies.length > 1;
    });
  }

  sortMovies() {
    if(this.selectedGenre!=='all')
    {
      this.api.searchFilmsByGenre(this.selectedGenre, this.page,this.selectedSort).subscribe((movies) => {
        this.filteredMovies = movies;
      });
      this.api.searchFilmsByGenre(this.selectedGenre, this.page+1,this.selectedSort).subscribe((movies) => {
        this.hasNextPage = movies.length > 1;
      });
      return;
    }
    if (this.selectedSort === 'year_desc') {
      this.filteredMovies = this.filteredMovies.sort((a: { release_date: string | number | Date; }, b: { release_date: string | number | Date; }) => {
        return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
      });
    }
    else if (this.selectedSort === 'year_asc') {
      this.filteredMovies = this.filteredMovies.sort((a: { release_date: string | number | Date; }, b: { release_date: string | number | Date; }) => {
        return new Date(a.release_date).getTime() - new Date(b.release_date).getTime();
      });
    }
    else if (this.selectedSort === 'title_asc') {
      this.filteredMovies = this.filteredMovies.sort((a: { title: string; }, b: { title: any; }) => {
        return a.title.localeCompare(b.title);
      });
    }
    else if (this.selectedSort === 'title_desc') {
      this.filteredMovies = this.filteredMovies.sort((a: { title: any; }, b: { title: string; }) => {
        return b.title.localeCompare(a.title);
      });
    }
  }
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
