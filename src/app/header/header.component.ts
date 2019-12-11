import { Component, OnInit, Input, HostBinding, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';
import { ChatboxComponent } from '../chatbox/chatbox.component';
import { ProfilePageComponent } from '../profile-page/profile-page.component';

import { UserInfoService } from '../services/user-info.service';
import { ChatroomService } from '../services/chatroom.service';
import { User } from '../models/user.model';


/**
 * Header Component is a header bar where the chittychat logo, sidenav toggle and logout menu is at
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  /** imports all of chatbox component
   */
  @Input() sideNav: ChatboxComponent;

  /** holds the user information from authentication
   */
  @Input() userInfo: User;

  /**
   * constructor for headercomponent
   * @param auth creates and instance of authService as public
   */
  constructor(
    public auth: AuthService,
    public dialog: MatDialog) { }


  openProfile() {
    this.dialog.open(ProfilePageComponent, {data:
      { name: this.userInfo.displayName,
        email: this.userInfo.email,
        photoURL: this.userInfo.photoURL,
        status: this.userInfo.status
    }});
  }

  /** ngoninit not used
   */
  ngOnInit() {
  }

  /** toggles to close/open sidenav
   */
  @HostListener('toggleSideNav')
  toggleSideNav() {
    this.sideNav.toggleSideNav();
  }

}
