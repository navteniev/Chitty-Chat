import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ChatroomService } from './services/chatroom.service';
import { UserInfoService } from './services/user-info.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'chitty-chat';
  message = '';
  messages: string[] = [];
  
  constructor(private chatService: ChatService, db: AngularFirestore,
              private chatroomService: ChatroomService, private userInfoService: UserInfoService) {}

  ngOnInit() {
    this.chatService
      .getMessages()
      .subscribe((message: string) => {
        this.messages.push(message);
      });
    console.log(this.messages);

    this.getCurrentUserInfo();
  }

  sendMessage() {
    this.chatService.sendMessage(this.message);
    this.message = '';
  }

  printUser(event) {
    console.log(event);
    this.router.navigate(['chatbox']);
  }

  printError(event) {
      console.error(event);
  }

  public getChatroomList() {
    this.chatroomService.getChatroomList().subscribe(res => console.log(res));
  }

  public getChatHistory() {
    this.chatroomService.getChatHistory('UgQEVNxekZrld8UJqtkZ').subscribe(res => console.log(res));
  }

  public getUserList() {
    this.userInfoService.getUserList().subscribe(res => console.log(res));
  }

  public getCurrentUserInfo() {
    this.userInfoService.getCurrentUserInfo('ph84kj5XX2MHrCK30wqPhg10gRi1').subscribe(res => console.log(res.payload.data()));
  }
}
