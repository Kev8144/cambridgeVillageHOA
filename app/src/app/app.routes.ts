import { Routes } from '@angular/router';
import { langGuard } from './core/lang-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'en', pathMatch: 'full' },
  {
    path: ':lang',
    canActivate: [langGuard],
    children: [
      { path: '', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
      { path: 'faq', loadComponent: () => import('./pages/faq/faq').then(m => m.Faq) },
      { path: 'documents', loadComponent: () => import('./pages/documents/documents').then(m => m.Documents) },
      { path: 'newsletters', loadComponent: () => import('./pages/newsletters/newsletters').then(m => m.Newsletters) },
      { path: 'meet-the-board', loadComponent: () => import('./pages/meet-the-board/meet-the-board').then(m => m.MeetTheBoard) },
      { path: 'posts', loadComponent: () => import('./pages/posts/post-list/post-list').then(m => m.PostList) },
      { path: 'posts/:slug', loadComponent: () => import('./pages/posts/post-detail/post-detail').then(m => m.PostDetail) }
    ]
  },
  { path: '**', redirectTo: 'en' }
];
