import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  getPopularMovies(limit: number = 6): Observable<any> {
    const headers = new HttpHeaders().set('X-Number-Of-Movies', limit.toString());
    return this.http.get(`${this.apiUrl}/movies/trending`, { headers });
  }

  getTopRatedMovies(limit: number = 6): Observable<any> {
    const headers = new HttpHeaders().set('X-Number-Of-Movies', limit.toString());
    return this.http.get(`${this.apiUrl}/movies/top_rated`, { headers });
  }

  getMovieByID(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/movies/${id}`);
  }

  getFilms(page: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/movies/page/${page}`);
  }

  searchFilmsByText(searchText: string, page: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/movies/page/${page}/search/${searchText}`);
  }

  searchFilmsByGenre(genre: string, page: number, sort: string): Observable<any> {
    if (sort === '')
      return this.http.get(`${this.apiUrl}/movies/page/${page}/genre/${genre}/sort/popularity`);
    return this.http.get(`${this.apiUrl}/movies/page/${page}/genre/${genre}/sort/${sort}`);
  }

  addReview(reviewData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/review`, reviewData, { withCredentials: true });
  }

  hasReview(movieId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/review/${movieId}`, { withCredentials: true });
  }

  getUserReviews(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reviews`, { withCredentials: true });
  }

  deleteReview(movieId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/review/delete/${movieId}`, { withCredentials: true });
  }

  sendMessage(username: string, message: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send`, { username, message });
  }

  getAllUsersReviews(movieId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/allreviews/${movieId}`);
  }

  getUsername(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/username/${id}`);
  }
}
