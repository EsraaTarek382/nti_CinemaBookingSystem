import { Routes } from '@angular/router';
import { MoviesDetailsComponent } from './components/movies-details/movies-details.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { BookingsComponent } from './components/bookings/bookings.component';
import { authGuard } from './guard/auth.guard';



export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'home',component: HomeComponent },
    { path: 'movies/:id', component: MoviesDetailsComponent,
         canActivate: [authGuard]
     },
    { path: 'bookings', component: BookingsComponent,
            canActivate: [authGuard]
     }
   
];
