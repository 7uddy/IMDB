import { Routes } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { HomeComponent } from "./home/home.component";
import { ChatComponent } from './chat/chat.component';
import { MovieComponent } from './movie/movie.component';
import { RegisterComponent } from './register/register.component';
import { FilmsComponent } from './films/films.component';
import { ReviewComponent } from './review/review.component';
import { UserReviewsComponent } from './user-reviews/user-reviews.component';

export const routes: Routes = [
  {path:'',redirectTo:'home',pathMatch:'full'},
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'home',component:HomeComponent},
  {path:'chat',component:ChatComponent},
  {path:'films',component:FilmsComponent},
  {path:'movie/:id',component:MovieComponent},
  {path:'movie/:id/review',component:ReviewComponent},
  {path:'reviews',component:UserReviewsComponent},
  {path:"**",component:HomeComponent}
];
