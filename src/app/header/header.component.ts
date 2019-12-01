import { Component, OnInit, Input, HostBinding, HostListener } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ChatboxComponent } from '../chatbox/chatbox.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() sideNav: ChatboxComponent;
  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

  @HostListener('toggleSideNav')
  toggleSideNav() {
    this.sideNav.toggleSideNav();
  }

}
