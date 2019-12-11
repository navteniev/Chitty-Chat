import { Component, OnInit, Input, HostBinding, HostListener } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ChatboxComponent } from '../chatbox/chatbox.component';
import { Observable } from 'rxjs';
import { ChatroomService } from '../services/chatroom.service';

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

  /**
   * constructor for headercomponent
   * @param auth creates and instance of authService as public
   */

  constructor(public auth: AuthService, public chatroomService: ChatroomService) { }

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
    toggleDarkTheme(checked: boolean) {
      this.chatroomService.setDarkTheme(checked);
    }
  }
