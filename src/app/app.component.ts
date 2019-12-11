import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from './services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserInfoService } from './services/user-info.service';
import { ChatroomService } from './services/chatroom.service';

/**
 * App component is the base page for logging in
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  /**
   * constructor of base app component
   * @param auth instance of AuthService declared as public
   */

  constructor(public auth: AuthService,
              private chatroomService: ChatroomService,
              private angularFireAuth: AngularFireAuth,
              private userInfoService: UserInfoService) {
    this.isDarkTheme = this.chatroomService.isDarkTheme;
  }

  /** title is chitty-chat
   */
  title = 'chitty-chat';


  /** will be called when the browser close or tab close */
  @HostListener('window:beforeunload', [ '$event' ])
  beforeUnloadHander(event) {
    this.userInfoService.updateUser(this.angularFireAuth.auth.currentUser.uid, 'off');
  }
  /**
   * not used
   */
  ngOnInit() {
    this.isDarkTheme = this.chatroomService.isDarkTheme;
  }

}
