import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggedInGuard } from 'ngx-auth-firebaseui';
import { ChatboxComponent } from './chatbox/chatbox.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  {
    path: 'chatbox',
    component: ChatboxComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: '**',
    component: ChatboxComponent,
    canActivate: [LoggedInGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
