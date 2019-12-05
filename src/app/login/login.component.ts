import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../app/services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  /**
   * calls the authentication service
   * @param auth used as public
   */
  constructor(public auth: AuthService) { }
  /**
   * not used
   */
  ngOnInit() {
  }

}
