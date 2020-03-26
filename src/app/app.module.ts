import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router'
import { AppComponent } from './app.component';
import { TopBlockComponent } from './top/top.component';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ChatComponent } from './chat/chat.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';


@NgModule({
  declarations: [
    AppComponent,
    TopBlockComponent,
    ContactListComponent,
    ChatComponent,
    LoginComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: '',
        component: HomeComponent,
      }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]


})
export class AppModule { }
