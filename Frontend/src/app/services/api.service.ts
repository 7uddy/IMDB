import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getPopularMovies(limit:number=6): Observable<any> {
    const headers = new HttpHeaders().set('X-Number-Of-Movies', limit.toString());
    return this.http.get(`${this.apiUrl}/movies/trending`, { headers });
  }

  getTopRatedMovies(limit:number=6): Observable<any> {
    const headers = new HttpHeaders().set('X-Number-Of-Movies', limit.toString());
    return this.http.get(`${this.apiUrl}/movies/top_rated`, { headers });
  }

  getMovieByID(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/movies/${id}`);
  }

}
