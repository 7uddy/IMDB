import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  errorMessage: string = '';


  constructor(private auth: AuthService, private router: Router, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      email: [''],
      password: ['']
    });
  }

  ngOnInit(): void {
  }

  submit(): void {
    if (this.form.invalid) {
      this.errorMessage = 'Please fill all the fields';
      return;
    }

    const { email, password } = this.form.value;

    this.auth.login(email, password).subscribe({
      next: (user) => {
        this.router.navigate(['/home']);
      },
      error: (error) => {
        if (error.error && error.error.error) {
          this.errorMessage = error.error.error;
        } else {
          this.errorMessage = error.error || 'An unknown error occurred';
        }
      }
    });
  }
}

