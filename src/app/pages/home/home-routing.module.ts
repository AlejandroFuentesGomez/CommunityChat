import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardGuard } from 'src/app/guards/auth-guard.guard';
import { HomeComponent } from './home.component';

const routes: Routes = [{
  path:'', 
  component: HomeComponent,
  canLoad: [AuthGuardGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
