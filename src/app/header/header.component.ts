import { Component, OnInit, Input, HostBinding, HostListener } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ChatboxComponent } from '../chatbox/chatbox.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  /**
   * imports all of chatbox component
   */
  @Input() sideNav: ChatboxComponent;

  /**
   * constructor for headercomponent
   * @param auth creates and instance of authService as public
   */
  constructor(public auth: AuthService) { }

  /** ngoninit not used
   */
  ngOnInit() {
  }

  /** toggles sidenav
   */
  @HostListener('toggleSideNav')
  toggleSideNav() {
    this.sideNav.toggleSideNav();
  }

}
