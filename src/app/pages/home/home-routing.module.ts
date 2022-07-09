import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'chat',
        loadChildren: () =>
          import('./chat/chat.module').then((m) => m.ChatModule),
      },
      {
        path: 'profile',
        loadChildren: () =>
        import('./profile/profile.module').then((m) => m.ProfileModule),
      },
      {
        path: '',
        redirectTo: 'chat',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
