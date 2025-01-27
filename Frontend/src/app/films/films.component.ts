import { Component, OnInit, HostListener } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { ApiService } from '../services/api.service';
import { MoviePosterComponent } from "../movie-poster/movie-poster.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface Movie {
  id: string;
  title: string;
  release_date: string;
  genre: string;
  [key: string]: any;
}

@Component({
  selector: 'app-films',
  imports: [HeaderComponent, MoviePosterComponent, CommonModule, FormsModule],
  templateUrl: './films.component.html',
  styleUrl: './films.component.scss'
})
export class FilmsComponent implements OnInit {

  filteredMovies: Movie[] = [];
  searchText: string = '';
  searchSubject: Subject<string> = new Subject();
  isLoaded: boolean = false;

  selectedGenre: string = 'all';
  selectedSort: string = '';
  page: number = 1;
  hasNextPage: boolean = false;

  constructor(private api: ApiService) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(searchText => this.onSearch(searchText))
    ).subscribe(movies => {
      this.filteredMovies = movies;
      this.updateHasNextPage();
      this.sortMovies();
    });
  }

  ngOnInit(): void {
    this.isLoaded = false;
    this.fetchMovies().subscribe(movies => {
      this.filteredMovies = movies;
      this.isLoaded = true;
      this.updateHasNextPage();
    });
  }

  fetchMovies() {
    if (this.searchText) {
      return this.api.searchFilmsByText(this.searchText, this.page).pipe(
        catchError(err => {
          console.error('Error on film loading ', err);
          return of([]);
        })
      );
    } else if (this.selectedGenre !== 'all') {
      return this.api.searchFilmsByGenre(this.selectedGenre, this.page, this.selectedSort).pipe(
        catchError(err => {
          console.error('Error on film loading ', err);
          return of([]);
        })
      );
    } else {
      return this.api.getFilms(this.page).pipe(
        catchError(err => {
          console.error('Error on film loading ', err);
          return of([]);
        })
      );
    }
  }

  updateHasNextPage() {
    this.page++;
    const nextPage$ = this.fetchMovies();
    nextPage$.subscribe(movies => {
      this.hasNextPage = movies.length > 1;
      this.page--;
    });
  }

  onSearchTextChange() {
    this.searchSubject.next(this.searchText);
  }

  onSearch(searchText: string) {
    this.page = 1;
    return this.fetchMovies();
  }

  navigatePage(direction: 'next' | 'previous') {
    const increment = direction === 'next' ? 1 : -1;
    this.page += increment;

    this.fetchMovies().subscribe(movies => {
      this.filteredMovies = movies;
      this.sortMovies();
      this.updateHasNextPage();
      this.scrollToTop();
    });
  }

  goToPreviousPage() {
    if (this.page > 1) this.navigatePage('previous');
  }

  goToNextPage() {
    if (this.hasNextPage) this.navigatePage('next');
  }

  onGenreChange() {
    this.searchText = '';
    this.page = 1;
    this.fetchMovies().subscribe(movies => {
      this.filteredMovies = movies;
      this.updateHasNextPage();
    });
  }

  sortMovies() {
    if (this.selectedGenre !== 'all' && this.page == 1) {
      this.fetchMovies().subscribe(movies => {
        this.filteredMovies = movies;
        this.updateHasNextPage();
      });
      return;
    }
    else if (!this.selectedSort || this.selectedGenre !== 'all') return;

    const sortMap: { [key: string]: (a: Movie, b: Movie) => number } = {
      'year_desc': (a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime(),
      'year_asc': (a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime(),
      'title_asc': (a, b) => a.title.localeCompare(b.title),
      'title_desc': (a, b) => b.title.localeCompare(a.title),
    };

    const sortFn = sortMap[this.selectedSort];
    if (sortFn) {
      this.filteredMovies = this.filteredMovies.sort(sortFn);
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
