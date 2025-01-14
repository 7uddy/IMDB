import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Emitters } from '../emitters/emitters';
import { CommonModule } from '@angular/common';
import { AuthStateService } from '../services/auth-state.service';


@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  authenticated: boolean = false;
  constructor(private router: Router, private auth: AuthService,private authState:AuthStateService) { }

  ngOnInit(): void {
    this.authState.getAuthState().subscribe((auth) => {
      this.authenticated = auth;
    });
  }

  logout() {
    this.auth.logout().subscribe({
      next: (data) => {
        this.authenticated = false;
        Emitters.authEmitter.emit(false);
      },
      error: (error) => {
        if (error.error && error.error.error) {
          console.error(error.error);
        }
      }
    });
  }

  goTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }
}
