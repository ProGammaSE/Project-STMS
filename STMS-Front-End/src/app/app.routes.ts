import { Routes } from '@angular/router';
import { LoginPageComponent } from './Components/login-page/login-page.component';
import { NavigationPageComponent } from './Components/navigation-page/navigation-page.component';
import { WelcomePageComponent } from './Components/welcome-page/welcome-page.component';
import { MainPageComponent } from './Components/main-page/main-page.component';
import { RegisterPageComponent } from './Components/register-page/register-page.component';
import { ProfilePageComponent } from './Components/profile-page/profile-page.component';
import { TicketingPageComponent } from './Components/ticketing-page/ticketing-page.component';

export const routes: Routes = [
    { path: '', redirectTo: "welcome", pathMatch: 'full' },
    { path: 'welcome', component: WelcomePageComponent },
    { path: 'login', component: LoginPageComponent },
    { path: 'register', component: RegisterPageComponent },
    { path: 'navigation', component: NavigationPageComponent, children: [
        { path: '', redirectTo: "home", pathMatch: 'full' },
        { path: 'home', component: MainPageComponent },
        { path: 'profile', component: ProfilePageComponent },
        { path: 'ticket', component: TicketingPageComponent },
    ] }
];