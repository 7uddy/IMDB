import { Routes } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { HomeComponent } from "./home/home.component";
import { ChatComponent } from './chat/chat.component';
import { MovieComponent } from './movie/movie.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
  {path:'',redirectTo:'login',pathMatch:'full'},
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'home',component:HomeComponent},
  {path:'chat',component:ChatComponent},
  {path:'movie/:category/:id',component:MovieComponent},
  {path:"**",component:LoginComponent}
];
