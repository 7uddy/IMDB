import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Emitters } from '../emitters/emitters';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  authenticated: boolean = false;
  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit(): void {
    Emitters.authEmitter.subscribe((auth: boolean) => {
      this.authenticated = auth;
    });
  }

  goToHome() {
    this.router.navigate(['/home']);
  }
  
  logout() {
    this.auth.logout().subscribe({
      next: (data) => {
        this.authenticated = false;
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
