import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'exam-selection',
    loadChildren: () => import('./exam-selection/exam-selection.module').then(m => m.ExamSelectionPageModule),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'papers',
    loadChildren: () => import('./papers/papers.module').then(m => m.PapersModule),
    canActivate: [authGuard]
  },
  {
    path: 'exam-selection',
    loadChildren: () => import('./exam-selection/exam-selection.module').then( m => m.ExamSelectionPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
