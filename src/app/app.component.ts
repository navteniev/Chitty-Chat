import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

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

  /**
   * constructor of base app component
   * @param auth instance of AuthService declared as public
   */
  constructor(public auth: AuthService) {}

  /**
   * not used
   */
  ngOnInit() {
  }

}
