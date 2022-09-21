import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./view/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'system',
    loadChildren: () => import('./view/system/system.module').then((m) => m.SystemModule),
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: '/system/dashboard',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
