import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost/api.php';

  constructor(private http: HttpClient) {}

  getCounterForSession(): Observable<any> {
    return this.http.get(`${this.apiUrl}?action=counter`,{
      withCredentials: true
    });
  }

  getMovieByID(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?action=movie&movie_id=${id}`,{
      withCredentials: true
    });
  }

  checkLogin(): Observable<any> {
    return this.http.get(`${this.apiUrl}?action=check_login`,{
      withCredentials: true
    });
  }
}
