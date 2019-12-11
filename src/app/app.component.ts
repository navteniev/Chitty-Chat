import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from './services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserInfoService } from './services/user-info.service';
/**
 * App component is the base page for logging in
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  /** title is chitty-chat
   */
  title = 'chitty-chat';

  /** will be called when the browser close or tab close */
  @HostListener('window:beforeunload', [ '$event' ])
  beforeUnloadHander(event) {
    this.userInfoService.updateUser(this.angularFireAuth.auth.currentUser.uid, 'off');
  }

  /**
   * constructor of base app component
   * @param auth instance of AuthService declared as public
   */
  constructor(public auth: AuthService, private angularFireAuth: AngularFireAuth, private userInfoService: UserInfoService) {}

  /**
   * not used
   */
  ngOnInit() {
  }

}
