import { Component, OnInit, Input } from '@angular/core';
import { ChatService } from '../services/chat.service';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/from';
// import 'rxjs/add/operator/map';
import * as moment from 'moment';
import { filter, distinctUntilChanged, skipWhile, scan, throttleTime, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
// import randomString from 'randomstring';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss']
})
export class ChatboxComponent implements OnInit {
  text: string;
  message = '';
  messages: string[] = [];
  secretCode = 'secret';
  selectedConversation = { // this is designed this way because we might have multiple memeber in a conversation
    members: [
      {
        value: {
          user: {
            name: 'John'
          }
        }
      },
      {
        value: {
          user: {
            name: 'alex'
          }
        }
      },
      {
        value: {
          user: {
            name: 'John'
          }
        }
      },
    ],
    me: {
      id: 1
    }
  };
  conversations = [
  //   {
  //     id: '1',
  //     display_name: 'Luke',
  //     message: ['message1']
  //   },
  //   {
  //     id: '2',
  //     display_name: 'John',
  //     message: ['message1']
  //   },
  //   {
  //     id: '3',
  //     display_name: 'Alex',
  //     message: ['message1']
  //   }
  ];

  friendList = [
    {
      id: Math.random().toString(36).substring(7),
      name: 'Luke'
    },
    {
      id: Math.random().toString(36).substring(7),
      name: 'John'
    },
    {
      id: Math.random().toString(36).substring(7),
      name: 'Alex'
    },
  ];

  events = [
    {
      from: 1,
      type: 'text',
      body: {
        text: 'mesgs'
      }
    },
    {
      from: 2,
      type: 'text',
      body: {
        text: 'mesgs'
      }
    },
  ];
  constructor(private chatService: ChatService, public auth: AuthService, private afAuth: AngularFireAuth) {}

  ngOnInit() {
    this.chatService
      .getMessages()
      .subscribe((message: string) => {
        this.messages.push(message);
        this.events.push({
          from: 1,
          type: 'text',
          body: {
            text: message
          }
        });
      });
    console.log(this.messages);
    if (this.auth.user$) {

    }
  }

  selectConversation(id: string) {
    const result = this.conversations.filter((conversation) => conversation.id === id);
    this.selectedConversation.members[0].value.user.name = result[0].display_name;
  }

  openConversation(index: number) {
    this.selectedConversation.members[0].value.user.name = this.friendList[index].name;
    const friendIndex = this.conversations.findIndex(item => item.id === this.friendList[index].id);
    if (friendIndex !== -1) {
      return;
    } else {
    const conversation = {
        id: this.friendList[index].id,
        display_name: this.friendList[index].name,
        message: ['message1']
    };
    this.conversations.push(conversation);
  }
  }

  deleteConversation(id: string) {
    const deleteIndex = this.conversations.findIndex(item => item.id === id);
    this.conversations.splice(deleteIndex, 1);

  }
  sendText(text) { console.log(this.text); }

  sendMessage() {
    if (this.message !== '') {
    this.chatService.sendMessage(this.message);
    console.log(this.message);
    this.message = '';
    this.chatService
      .getMessages()
      .distinctUntilChanged()
      .filter((message) => message.trim().length > 0)
      .throttleTime(1000)
      .skipWhile((message) => message !== this.secretCode)
      .scan((acc: string, message: string, index: number) =>
          `${message}(${index + 1})`
        , 1)
      .subscribe((message: string) => {
        const currentTime = moment().format('hh:mm:ss a');
        const messageWithTimestamp = `${currentTime}: ${message}`;
        this.messages.push(messageWithTimestamp);
        this.events.push({
          from: 2,
          type: 'text',
          body: {
            text: messageWithTimestamp
          }
        });
      });
  }
}
}
