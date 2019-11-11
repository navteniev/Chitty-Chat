import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatboxComponent } from './chatbox/chatbox.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ChatService } from '../chat.service';
import { MaterialModule } from './modules/material-module';
import { NgxAuthFirebaseUIModule } from 'ngx-auth-firebaseui';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { RouterModule, Routes } from '@angular/router';
import { ChatroomService } from './services/chatroom.service';
import { UserInfoService } from './services/user-info.service';
const appRoutes: Routes = [{ path: 'chatbox', component: ChatboxComponent }];
@NgModule({
  declarations: [AppComponent, ChatboxComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    NgxAuthFirebaseUIModule.forRoot(environment.firebase, () => 'chitty-chat', {
      authGuardFallbackURL: '/',
      authGuardLoggedInURL: '/chatbox'
    }),
    AngularFireModule.initializeApp(environment.firebase, 'chitty-chat'),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    RouterModule.forRoot(appRoutes, { enableTracing: true })
  ],
  exports: [],
  providers: [ChatService, ChatroomService, UserInfoService],
  bootstrap: [AppComponent]
})
export class AppModule {}
