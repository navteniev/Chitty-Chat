import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatboxComponent } from './chatbox/chatbox.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './modules/material-module';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { LoginComponent } from './login/login.component';

import { environment } from '../environments/environment';
import { HeaderComponent } from './header/header.component';
import { CreateChannelComponent } from './createchannel/createchannel.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';

const config = {
  apiKey: 'AIzaSyD-9drCjUDfcRit3vaqTkY_8PVZCOsfiiA',
  authDomain: 'chitty-chat-ba34b.firebaseapp.com',
  databaseURL: 'https://chitty-chat-ba34b.firebaseio.com',
  projectId: 'chitty-chat-ba34b',
  storageBucket: 'chitty-chat-ba34b.appspot.com',
  messagingSenderId: '1092864489290',
  appId: '1:1092864489290:web:1aaf648231980c30e3f3b3'
};

@NgModule({
  declarations: [
    AppComponent,
    ChatboxComponent,
    LoginComponent,
    HeaderComponent,
    CreateChannelComponent,
    ProfilePageComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
  ],
  exports: [
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    CreateChannelComponent,
    ProfilePageComponent,
    ConfirmationDialogComponent
  ]
})
export class AppModule { }
