import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getPopularMovies(): Observable<any> {
    const headers = new HttpHeaders().set('X-Number-Of-Movies', '12');
    return this.http.get(`${this.apiUrl}/movies/trending`, { headers });
  }

  getTopRatedMovies(): Observable<any> {
    const headers = new HttpHeaders().set('X-Number-Of-Movies', '12');
    return this.http.get(`${this.apiUrl}/movies/top_rated`, { headers });
  }

}
