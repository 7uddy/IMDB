import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  form:FormGroup;
  errorMessage: string = '';

  constructor(private auth: AuthService, private router: Router, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      name: [''],
      email: [''],
      password: [''],
      confirmPassword: ['']});
   }

  submit() {
    if (this.form.invalid) {
      this.errorMessage = "Please fill all the fields";
      return;
    }

    const { email, name, password, confirmPassword} = this.form.value;

    if(password !== confirmPassword) {
      this.errorMessage = "Passwords do not match";
      return;
    }

    this.auth.register(name, email, password).subscribe((response) => {
      this.router.navigate(['/login']);
    });
  }
}
