import { Routes } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { HomeComponent } from "./home/home.component";
import { ChatComponent } from './chat/chat.component';
import { MovieComponent } from './movie/movie.component';
import { RegisterComponent } from './register/register.component';
import { FilmsComponent } from './films/films.component';
import { ReviewComponent } from './review/review.component';
import { UserReviewsComponent } from './user-reviews/user-reviews.component';
import { UserComponent } from './user/user.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  {path:'',redirectTo:'home',pathMatch:'full'},
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'home',component:HomeComponent},
  {path:'films',component:FilmsComponent},
  {path:'movie/:id',component:MovieComponent},
  {path:'movie/:id/review',component:ReviewComponent, canActivate: [AuthGuard]},
  {path:'reviews',component:UserReviewsComponent, canActivate: [AuthGuard]},
  {path:'user/:username',component:UserComponent},
  {path:"**",component:HomeComponent}
];
