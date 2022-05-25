import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InterventionFormComponent } from './Components/interventions/intervention-form/intervention-form.component';
import { LoginComponent } from './Components/login/login.component';
import { NewsFormComponent } from './Components/news/news-form/news-form.component';
import { NewsListComponent } from './Components/news/news-list/news-list.component';
import { RequestFormComponent } from './Components/requests/request-form/request-form.component';
import { RequestListComponent } from './Components/requests/request-list/request-list.component';
import { ProfileComponent } from './Components/user/profile/profile.component';
import { UserFormComponent } from './Components/user/user-form/user-form.component';
import { UserListComponent } from './Components/user/user-list/user-list.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'newsList',
    component: NewsListComponent,
  },
  {
    path: 'news/:id',
    component: NewsFormComponent,
  },
  {
    path: 'requestList',
    component: RequestListComponent,
  },
  {
    path: 'request/:id',
    component: RequestFormComponent,
  },
  {
    path: 'intervention/:id_request/:id_intervention',
    component: InterventionFormComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'userList',
    component: UserListComponent,
  },
  {
    path: 'user/:id',
    component: UserFormComponent,
  },
  {
    path: '**',
    component: UserFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
