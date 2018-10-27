// ====================================================

// Email: support@ebenmonney.com
// ====================================================

import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { SettingsComponent } from './components/settings/settings.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth-guard.service';

const routes: Routes = [

  { path: 'login', component: LoginComponent, data: { title: '' } },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard], data: { title: '' } },
  {path: '',component: HomeComponent, canActivate: [AuthGuard], data: { title: '' }},

  { path: '**', component: NotFoundComponent, data: { title: 'Page Not Found' } },
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthService, AuthGuard],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
]
})
export class AppRoutingModule { }
