import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Emitters } from '../emitters/emitters';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private isAuthenticated$ = new BehaviorSubject<boolean>(false);


  constructor() {
    Emitters.authEmitter.subscribe((auth: boolean) => {
      this.isAuthenticated$.next(auth);
    });
  }

  getAuthState() {
    return this.isAuthenticated$.asObservable();
  }
}
