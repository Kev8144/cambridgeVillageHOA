import { Routes } from '@angular/router';
import { langGuard } from './core/lang-guard';
import { authGuard, adminGuard, boardGuard } from './core/auth.guard';

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
      { path: 'posts/:slug', loadComponent: () => import('./pages/posts/post-detail/post-detail').then(m => m.PostDetail) },
      { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },
      { path: 'forgot-password', loadComponent: () => import('./pages/forgot-password/forgot-password').then(m => m.ForgotPassword) },
      { path: 'reset-password', loadComponent: () => import('./pages/reset-password/reset-password').then(m => m.ResetPassword) },
      { path: 'set-password', loadComponent: () => import('./pages/reset-password/reset-password').then(m => m.ResetPassword) },
      {
        path: 'resident',
        canActivate: [authGuard],
        children: [
          { path: '', loadComponent: () => import('./pages/resident/dashboard/dashboard').then(m => m.ResidentDashboard) },
          { path: 'profile', loadComponent: () => import('./pages/resident/profile/profile').then(m => m.Profile) },
        ]
      },
      {
        path: 'admin',
        canActivate: [adminGuard],
        children: [
          { path: '', loadComponent: () => import('./pages/admin/dashboard/dashboard').then(m => m.AdminDashboard) },
          { path: 'posts', loadComponent: () => import('./pages/admin/posts-manage/posts-manage').then(m => m.PostsManage) },
          { path: 'newsletters', loadComponent: () => import('./pages/admin/newsletters-manage/newsletters-manage').then(m => m.NewslettersManage) },
          { path: 'documents', loadComponent: () => import('./pages/admin/documents-manage/documents-manage').then(m => m.DocumentsManage) },
          { path: 'faq', loadComponent: () => import('./pages/admin/faq-manage/faq-manage').then(m => m.FaqManage) },
          { path: 'board', loadComponent: () => import('./pages/admin/board-manage/board-manage').then(m => m.BoardManage) },
          { path: 'residents', loadComponent: () => import('./pages/admin/residents-manage/residents-manage').then(m => m.ResidentsManage) },
          { path: 'homes', loadComponent: () => import('./pages/admin/homes-manage/homes-manage').then(m => m.HomesManage) },
          { path: 'financials', loadComponent: () => import('./pages/admin/financials/financials').then(m => m.Financials) },
        ]
      },
      {
        path: 'treasurer',
        canActivate: [boardGuard],
        children: [
          { path: '', loadComponent: () => import('./pages/admin/financials/financials').then(m => m.Financials) },
          { path: 'homes', loadComponent: () => import('./pages/admin/homes-manage/homes-manage').then(m => m.HomesManage) },
          { path: 'residents', loadComponent: () => import('./pages/admin/residents-manage/residents-manage').then(m => m.ResidentsManage) },
        ]
      },
      { path: '**', loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFound) }
    ]
  },
  { path: '**', redirectTo: 'en' }
];
