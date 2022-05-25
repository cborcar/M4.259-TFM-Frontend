import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxLoadingModule } from 'ngx-loading';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './Components/header/header.component';
import { LoginComponent } from './Components/login/login.component';
import { NewsFormComponent } from './Components/news/news-form/news-form.component';
import { NewsListComponent } from './Components/news/news-list/news-list.component';
import { RequestFormComponent } from './Components/requests/request-form/request-form.component';
import { RequestListComponent } from './Components/requests/request-list/request-list.component';
import { ProfileComponent } from './Components/user/profile/profile.component';
import { UserFormComponent } from './Components/user/user-form/user-form.component';
import { UserListComponent } from './Components/user/user-list/user-list.component';
import { LoggedUserData } from './globals';
import { InterventionFormComponent } from './Components/interventions/intervention-form/intervention-form.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    NewsFormComponent,
    NewsListComponent,
    RequestListComponent,
    UserFormComponent,
    ProfileComponent,
    UserListComponent,
    RequestFormComponent,
    InterventionFormComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgbModule,
    NgxLoadingModule.forRoot({}),
  ],
  providers: [LoggedUserData],
  bootstrap: [AppComponent],
})
export class AppModule {}
