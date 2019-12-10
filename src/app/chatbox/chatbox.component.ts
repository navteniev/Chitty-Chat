import {
  Component,
  OnInit,
  Input,
  AfterViewChecked,
  HostBinding
} from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { MessageService } from '../services/message.service';
import { UserInfoService } from '../services/user-info.service';
import { ChatroomService } from '../services/chatroom.service';
import { User } from '../models/user.model';
import { Chat } from '../models/chat.model';
import { Chatuser } from '../models/chatuser.model';
import { CreateChannelComponent } from '../createchannel/createchannel.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import {ToneAnalyzerService} from '../services/tone-analyzer.service';
import { isNull } from 'util';

/**
 * chatbox is where the message and message input is along with the sidenavs of chatrooms and userlist
 */
@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss']
})
export class ChatboxComponent implements OnInit, AfterViewChecked {

  /** holds the user information from authentication
   */
  @Input() userInfo: User;
  /** calls HostBinding() opened: boolean;
   */
  opened = false;

  /** used to subscribe to chatroomlist for the get updateChatHistory function
   */
  chatroomSubscription: Subscription;

  /** used to subscribe to userList for the get userList function
   */
  userListSubscription: Subscription;

  /** connected with message material element for user input of chat messages
   */
  message = '';

  /** connected with the inputtedEmail material element. stores email to add user to chatroom
   */
  inputtedEmail: '';

  /** email regex to verify correct email syntax
   */
  validEmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))/.source
    + /@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.source;

  /** object holds the name and id of the selected/current conversation
   */
  selectedConversation = {
    name: 'ChittyC',
    id: 'UgQEVNxekZrld8UJqtkZ'
  };

  /** chatroom list will store all the chatrooms the user is in
   */
  chatroomList = [];

  /** events list connected with the html material list of chat messages
   */
  events = [
    {
      from: '1',
      type: 'text',
      text: 'mesages',
      tone_id: 'empty'
    }
  ];

  /** UserList connected with the html material list of users
   */
  userListEvents: Chatuser[] = [
    {
      uid: '1',
      displayName: 'name',
      email: 'example',
      chatroomRefs: [{id: 'SELECTED_CHATROOM_ID'}, {id: 'CHATROOM2_ID'}],
      photoURL: 'link'
    }
  ];

  /**
   * Constructor to call instances of service
   */
  constructor(
    public auth: AuthService,
    public dialog: MatDialog,
    private afAuth: AngularFireAuth,
    private messageService: MessageService,
    private userInfoService: UserInfoService,
    private chatRoomService: ChatroomService,
    private toneAnalyzerService: ToneAnalyzerService
  ) {}

  /**
   * on init calls getChatroomList and when the received promise is accepted
   *          by default selects the first chatroom that the user has available
   * @returns void
   */
  ngOnInit() {
    this.getChatroomList().then(() => {
      if (this.chatroomList.length) {
        this.openConversation(0);
      }
    });
    console.log(this.userInfo);
  }

  /**
   * Calls scrollBottom to scroll down.
   *          Called after ngAfterContentInit when the component's view has been initialized.
   *          Applies to components only. implements AfterViewInit' to the class.
   *
   * @returns void
   */
  ngAfterViewChecked(): void {
    this.scrollBottom();
  }

  /**
   * toggles closing and opening sidenav
   * @returns void
   */
  toggleSideNav() {
    this.opened = !this.opened;
  }

  /**
   * unsubscribes previous chats history and populates events structure
   *          with chat messages from the current chatroom with another subscription.
   * @returns void
   */
  updateChatHistory() {
    if (this.chatroomSubscription) {
      this.chatroomSubscription.unsubscribe();
    }
    this.events = [];
    this.chatroomSubscription = this.chatRoomService
      .getUpdates(this.selectedConversation.id)
      .subscribe((message: any) => {
        message.forEach((element: Chat) => {
          this.events.push({
            from: element.user,
            type: 'text',
            text: element.content,
            tone_id: element.tone_id
          });
        });
      });
  }

  /**
   * for each messages toneID return the emoji for that tone
   *          Called when displaying each message
   * @param toneID the emotion of a message.
   * @returns emoji corresponding to emotion
   */
  updateEmoji(toneId: string): string {
    switch (toneId) {
      case 'anger':
        return '&#128545;';
      case 'fear':
        return '&#128552;';
      case 'joy':
        return '&#128516;';
      case 'sadness':
        return '&#128546;';
      case 'confident':
        return '&#128526;';
      case 'tentative':
        return '&#128533;';
      case 'none':
        return '&#128578;';
      case 'analytical':
        return '&#129488;';
    }
  }

  /**
   * Upon clicking on a chatroom list, this is called to set the selected
   *          chatroom ID and name to the clicked chatroom ID and name. the index in the displayed
   *          chatroom list corresponds to the location of that chatroom in chatroomList array.
   *          calls updateChatHistory and updateUserList
   * @param index corresponds to a chatroom in chatroomList
   * @returns void
   */
  openConversation(index: number) {
    this.selectedConversation.name = this.chatroomList[index].name;
    this.selectedConversation.id = this.chatroomList[index].id;
    this.updateChatHistory();
    this.updateUserList();
    this.scrollBottom();
  }

  /**
   * Uses Tone analyzer to update a message. The
   *          tone analyzer service will give scores for each sentence in that
   *          message. The highest scoring emotion score and the tone_id associated
   *          with the score is stored with that message. Then, sends the message.
   * @param message given by this.sendMessage it is the user input message
   *
   * @returns void
   */
  updateToneInFirebase(message: string) {
    this.toneAnalyzerService.toneAnalyze(message).subscribe((res: any) => {
      let highestScore = 0.0;
      let toneWithHighestScore = 'none';
      if (res.tones.length > 0) {
        for (const tone of res.tones) {
          if (tone.score > highestScore) {
            toneWithHighestScore = tone.tone_id;
            highestScore = tone.score;
          }
        }
      }
      const date = new Date();
      this.messageService.sendMessage(
        this.userInfo.uid,
        date,
        this.selectedConversation.id,
        message,
        toneWithHighestScore
      );
      console.log('selected tone : ', toneWithHighestScore);
    });
  }

  /**
   * Calls updateToneInFirebase to add emotion value to message.
   *          empties the message element after calling.
   * @param message the user message input string
   * @returns void
   */
  sendMessage(message: string) {
    if (this.message !== '') {
      this.updateToneInFirebase(message);
      this.message = '';
    }
  }

  /**
   * scrolls all-the-way down the "scrollMe" element
   * @param elementToScroll pick specified element in html to be scrolling
   * @returns void
   * @todo unit tests
   */
  scrollBottom() {
    document.getElementById('scrollMe').scrollBy(0, 500000000);
  }

  /**
   * Creates a CreateChannelComponent with the parameters
   *          of user id and the chatroom array. Used to Create a new chatroom.
   * @returns void
   * @todo unit test
   */
  openDialog(): void {
    const dialogRef = this.dialog.open(CreateChannelComponent, {
      width: '2000px',
      data: {
        ownerID: this.userInfo.uid,
        getChatroomList: this.getChatroomList.bind(this)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.selectedConversation.name = result;
      console.log(result);
    });
  }

  openDeleteChatroomDialog(): void {
    this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: `Delete ${this.selectedConversation.name}?`,
        prompt: `Are you sure you want to delete ${this.selectedConversation.name}?`,
        chatroomID: this.selectedConversation.id,
        callback: this.ngOnInit.bind(this)
      }
    });
  }

  /**
   * Updates the component's chatroomList property
   *          with the user's chatrooms
   * @returns A Promise that resolves if the component's
   *          chatroomList property successfully updates
   */
  getChatroomList(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.chatroomList = [];
      const availableChatrooms = this.chatroomList;
      this.userInfoService
        .getUserByEmail(this.userInfo.email)
        .then(userInfo => {
          const chatroomRefs = userInfo.chatroomRefs;
          if (chatroomRefs.length > 0) {
            chatroomRefs.forEach((item, index, arr) => {
              item.get().then(chatroom => {
                const chatroomData = chatroom.data();
                availableChatrooms.push({
                  id: item.id,
                  name: chatroomData.roomName
                });

                if (index === arr.length - 1) {
                  resolve();
                }
              });
            });
          } else {
            reject(new Error('No user chatrooms found'));
          }
        })
      .catch(() => {
        reject(new Error('User not found'));
      });
    });
  }

  /**
   * Adds user with email to chatroom with id Chatbox.component.selectedConversation.id
   * @param email Email address of user to add
   * @returns Promise that resolves if the email exists and user is successfully added
   */
  addUserByEmail(email: string): Promise<any> {
    if (email && this.validateEmail(email)) {
      return this.userInfoService.getUserByEmail(email)
        .then((userInfo: any) => {
          this.chatRoomService.addUserToChatroom(userInfo.uid, this.selectedConversation.id)
            .then(() => {
              this.inputtedEmail = '';
              this.updateUserList();
            });
        });
    } else {
      return Promise.reject();
    }
  }

  /**
   * retrieves component's userListEvents displayName
   *          that matches the parameter user id given
   *          defaults to user is not in channel if no uid in userlist matches the param
   * @param uid user id string to match
   * @returns user name string
   */
  getUserName(uid: string) {
    let name = 'User is not in this channel';
    this.userListEvents.forEach((user: Chatuser) => {
      if (user.uid === uid) {
        name = user.displayName;
      }
    });
    return name;
  }

  /**
   * retrieves component's userListEvents photoURL
   *          that matches the parameter user id given
   *          defaults to a avatar of a ghost if id is not found
   * @param uid user id string to match
   * @returns photo string
   */
  getPhoto(uid: string) {
    let name = 'https://bit.ly/chitty-ghost';
    this.userListEvents.forEach((user: Chatuser) => {
      if (user.uid === uid) {
        name = user.photoURL;
      }
    });
    return name;
  }

  /**
   * Updates the component's userListEvents
   *          with the users in the current chatrooms
   * @returns void
   */
  updateUserList() {
    this.inputtedEmail = '';
    if (this.userListSubscription) {
      this.userListSubscription.unsubscribe();
    }
    this.userListSubscription = this.userInfoService
      .getUserList()
      .subscribe((users: any) => {
        this.userListEvents = [];
        users.forEach((userInfo: any) => {
          userInfo.chatroomRefs.forEach((chatRef: any) => {
            if (chatRef.id === this.selectedConversation.id) {
              this.userListEvents.push({
                uid: userInfo.uid,
                displayName: userInfo.displayName,
                email: userInfo.email,
                chatroomRefs: userInfo.chatroomRefs,
                photoURL: userInfo.photoURL
              });
            }
          });
        });
      });
  }

  /**
   * Uses email regex to validate a email string
   * @returns boolean
   */
  private validateEmail(email: string): boolean {
    return !isNull(email.match(this.validEmailRegex));
  }

}
