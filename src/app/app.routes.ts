import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login.component').then(m => m.LoginComponent)
  },

  {
    path: 'register',
    loadComponent: () => import('./features/auth/pages/register/register.component').then(m => m.RegisterComponent)
  },

  {
    path: 'forgot-pass',
    loadComponent: () => import('./features/auth/pages/forgot-pass/forgot-pass.component').then(m => m.ForgotPassComponent)
  },

  {
    path: 'reset-password',
    loadComponent: () => import('./features/auth/pages/reset-pass/reset-pass.component').then(m => m.ResetPass)
  },

  {
    path: 'animes',
    loadComponent: () => import('./features/animes/animes.component').then(m => m.AnimesComponent)
  },

  {
    path: 'animes/category/:id',
    loadComponent: () => import('./features/animes/animes.component').then(m => m.AnimesComponent)
  },

  {
    path: 'anime/description/:id',
    loadComponent: () => import('./features/anime-description/anime-description').then(m => m.AnimeDescriptionComponent)
  },

  {
    path: 'categorys',
    loadComponent: () => import('./features/categorys/categorys.component').then(m => m.CategorysComponent)
  }

];
