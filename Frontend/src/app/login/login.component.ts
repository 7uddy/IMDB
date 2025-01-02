import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  user: any;
  username: string = '';
  password: string = '';


  constructor(private auth: AuthService) { }

  ngOnInit(): void {
  }

   {
    this.auth.login(this.username, this.password).subscribe(res=>
    {
      console.log(res);
    }
    );
  }

}
