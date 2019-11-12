import { Component, OnInit, Input } from '@angular/core';
import { ChatService } from '../services/chat.service';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/from';
// import 'rxjs/add/operator/map';
import * as moment from 'moment';
import { filter, distinctUntilChanged, skipWhile, scan, throttleTime, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { MessageService } from '../services/message.service';
import { UserInfoService } from '../services/user-info.service';
import { ChatroomService } from '../services/chatroom.service';
import { Chat } from '../models/chat.model';
import { Chatroom } from '../models/chatroom.model';
import { Chatuser } from '../models/chatuser.model';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss']
})
export class ChatboxComponent implements OnInit {
  @Input() userId: string;
  @Input() userJson: any;
  roomId: string;
  userList: any;
  text: string;
  message = '';
  messages: string[] = [];
  secretCode = 'secret';
  chatrooms: any;
  // selectedConversation = { // this is designed this way because we might have multiple memeber in a conversation
  //   members: [
  //     {
  //       value: {
  //         user: {
  //           name: 'John'
  //         }
  //       }
  //     },
  //     {
  //       value: {
  //         user: {
  //           name: 'alex'
  //         }
  //       }
  //     },
  //     {
  //       value: {
  //         user: {
  //           name: 'John'
  //         }
  //       }
  //     },
  //   ],
  //   me: {
  //     id: 1
  //   },
  //   chatRoomId: 6
  // };

  selectedConversation = { // this is designed this way because we might have multiple memeber in a conversation
    members: [
      {
        userId: 1,
        name: 'John'
      },
      {
        userId: 2,
        name: 'alex'
      },
    ],
    me: {
      id: 1
    },
    chatRoomId: 6
  };

  conversations = [];

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

  // events = [
  //   {
  //     from: 1,
  //     type: 'text',
  //     body: {
  //       text: 'mesgs'
  //     }
  //   },
  //   {
  //     from: 2,
  //     type: 'text',
  //     body: {
  //       text: 'mesgs'
  //     }
  //   },
  // ];
  events = [
    {
      from: 1,
      type: 'text',
      text: 'messgae',
      when: '11:23:59 PM',
      emotion: 'happy'
    },
    {
      from: 2,
      type: 'text',
      text: 'messgae',
      when: '11:23:59 PM',
      emotion: 'happy'
    },
  ];
  constructor(private chatService: ChatService,
              public auth: AuthService,
              private afAuth: AngularFireAuth,
              private userInfoService: UserInfoService,
              private chatroomService: ChatroomService) { }

  ngOnInit() {
    this.chatService
      .getMessages()
      .subscribe((message: string) => {
        this.messages.push(message);
        this.events.push({
          from: 2,
          type: 'text',
          text: message,
          when: '11:23:59 PM',
          emotion: 'happy'
        });
      });
    console.log(this.messages);
    console.log(this.userJson);
    const userInfo = this.userInfoService.getCurrentUserInfo(this.userJson.uid);
    console.log(userInfo);
    const userList = this.userInfoService.getUserList();
    userList.subscribe(res => {
      console.log(res);
    });
    console.log(userList);
    const chatrooms = this.chatroomService.getChatroomList();
    chatrooms.subscribe(res => {
      console.log(res);
      res.forEach( room => {
        const chat = this.chatroomService.getChatHistory(room.id);
        chat.subscribe(res => console.log(res));
      });
    });
    this.getConversationsList();
  }

  getConversationsList() {
    // params: userID
    // 1: get all chatrooms
    // 2: get users chatroom list
    // 3: match the chatroom in chatroom list to all the chatrooms
    // 4: get chatroomid, memberId[], chatHistory[]
    var chatrooms; // array of objects
    this.chatroomService.getChatroomList().subscribe( res => {chatrooms = res; console.log(chatrooms)});
    console.log(`chatrooms is ${chatrooms}`);
    let myChatroomList; // array of string
    this.userInfoService.getCurrentUserInfo(this.userJson.id).subscribe( (res: any) => myChatroomList = res.chatRooms);
    console.log(`myChatroomList is ${myChatroomList}`);
  }

  getFriendList() {
    // params: userID
    // 1: get user info
    // 2: get user friendlist[]
    // 3: get all user's info
    // 4: match friendid in friendlist with
  }


  selectConversation(id: string) {
    const result = this.conversations.filter((conversation) => conversation.uid === id);
    this.selectedConversation.members[0].name = result[0].members[0];
  }

  openConversation(index: number) {
    this.selectedConversation.members[0].name = this.friendList[index].name;
    const friendIndex = this.conversations.findIndex(item => item.uid === this.friendList[index].id);
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
    const deleteIndex = this.conversations.findIndex(item => item.uid === id);
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
          text: messageWithTimestamp,
          when: '11:23:59 PM',
          emotion: 'happy'
        });
      });
  }
}

  getUserFriendList(userid: string) {
    const friendlist = this.userInfoService.getCurrentUserInfo(userid);
    friendlist.subscribe((res: any) => {
      console.log(res[0].subscribe());
      res.friendList.forEach(friendid => {
        const friendObj = this.userInfoService.getCurrentUserInfo(friendid);
        let friendName;
        friendObj.subscribe(( person: any) => friendName = person.name);
        const friend = {
          id: friendid,
          name: friendName
        };
        console.log(friend);
        this.friendList.push({...friend});
      });
    });
    console.log(this.friendList);
  }

  async getConversations(userid: string) {
    const userInfo = this.userInfoService.getCurrentUserInfo(userid).subscribe((res: any) => {
      res.chatRooms.forEach(chatroom => {
          const chatMembers = chatroom.members;
          chatMembers.forEach(member => {
            let friendName;
            this.userInfoService.getCurrentUserInfo(member).subscribe(name => friendName = name );
            const memeber = {
              id: member,
              name: friendName
            };
            chatMembers.push(memeber);
          });
          const conversation = {

            members: chatMembers,
            me: userid,
            chatRoomId: chatroom
          };
          this.conversations.push(conversation);
        });
    });

  }
}

// this.chatroomService.getChatHistory(chatroom).subscribe( (chats: any) => {
//   chats.forEach(chat => {
//     let event = {
//       from: chat.from,
//       type: chat.type,
//       text: chat.text,
//       when: chat.when,
//       emotion: chat.emotion
//     };
//     let events = [];
//     event.push
//   });

// })
