import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardGuard } from './guards/auth-guard.guard';
import { IntroGuardGuard } from './guards/intro-guard.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then((m) => m.LoginModule),
    /* canLoad:[IntroGuardGuard] */

  },
  {
    path: 'sign-up',
    loadChildren: () => import('./pages/sign-up/sign-up.module').then((m) => m.SignUpModule),
/*     canLoad:[IntroGuardGuard]
 */  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then((m) => m.HomeModule),
    /* canLoad:[AuthGuardGuard] */
  },
  {
    path: '',
    redirectTo:'login',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
