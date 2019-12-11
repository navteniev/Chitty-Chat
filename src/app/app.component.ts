import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';
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
  /** title is chitty-chat
   */
  title = 'chitty-chat';
  isDarkTheme: Observable<boolean>;
  /**
   * constructor of base app component
   * @param auth instance of AuthService declared as public
   */
  constructor(public auth: AuthService, private chatroomService: ChatroomService) {
  }
  /**
   * not used
   */
  ngOnInit() {
    this.isDarkTheme = this.chatroomService.isDarkTheme;
  }

}
