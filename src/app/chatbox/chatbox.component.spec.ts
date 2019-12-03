import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from '../modules/material-module';
import { ChatboxComponent } from './chatbox.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { RouterTestingModule } from '@angular/router/testing';
import { UserInfoService } from '../services/user-info.service';
import { ChatroomService } from '../services/chatroom.service';
import { Subscription } from 'rxjs';
import { ToneAnalyzerService } from '../services/tone-analyzer.service';
import { MessageService } from '../services/message.service';
import { Chatuser } from '../models/chatuser.model';

describe('ChatboxComponent', () => {
  const INVALID_EMAIL = '  ';
  const VALID_EMAIL_REGISTERED = 'Registered@gmail.com';
  const CHATROOM1_ID = 'chatroomID1';
  const CHATROOM1_NAME = 'chatroomName1';
  const CHATROOM2_ID = 'chatroomID2';
  const CHATROOM2_NAME = 'chatroomName2';
  const RESOLVED_PROMISE_WITH_CHATROOMS: Promise<any> = Promise.resolve({
    chatroomRefs: [
      createChatroomDocumentRef(CHATROOM1_ID, CHATROOM1_NAME),
      createChatroomDocumentRef(CHATROOM2_ID, CHATROOM2_NAME)]
  });
  const RESOLVED_PROMISE_WITH_NO_CHATROOMS: Promise<any> = Promise.resolve({
    chatroomRefs: []
  });
  const REJECTED_PROMISE_EMAIL_NOT_FOUND: Promise<any> = Promise.reject();
  const USER_INFO = {
    uid: 'uid',
    email: 'email',
    friendList: ['friendID1', 'friendID2'],
    chatrooms: ['chatroomID1', 'chatroomID2']
  };
  const SELECTED_CHATROOM_ID = 'selectedChatroomID';
  const INVALID_TONE = 'invalid tone';
  const SELECTED_CHATROOM_INDEX = 1;
  const CHAT_HISTORY = [
    {user: 'sender1', content: 'hey', tone_id: 'angry'},
    {user: 'sender2', content: 'hey', tone_id: 'angry'}];
  const EMPTY_CHAT_HISTORY = [];
  const MESSAGE = 'message content';
  const EMPTY_MESSAGE = '';
  const USERS_IN_SELECTED_CHATROOM: Chatuser[] = [
    {uid: 'userID1', displayName: 'user1', email: 'email1',
     chatroomRefs: [{id: SELECTED_CHATROOM_ID}, {id: CHATROOM2_ID}], photoURL: 'link'},
    {uid: 'userID2', displayName: 'user2', email: 'email2',
     chatroomRefs: [{id: CHATROOM1_ID}, {id: SELECTED_CHATROOM_ID}], photoURL: 'link2'}
  ];
  const TONE_ANALYZER_SERVICE_RESPONSE = {
    tones: [{score: 0.4, tone_id: 'sad'}, {score: 0.5, tone_id: 'angry'}]};
  const TONES_EMOJI_DICT = {
    anger: '&#128545;',
    fear: '&#128552;',
    joy: '&#128516;',
    sadness: '&#128546;',
    confident: '&#128526;',
    tentative: '&#128533;',
    none: '&#128578;',
    analytical: '&#129488;'
  };

  let componentUnderTest: ChatboxComponent;
  let fixture: ComponentFixture<ChatboxComponent>;
  let userInfoServiceSpy: jasmine.SpyObj<UserInfoService>;
  let chatroomServiceSpy: jasmine.SpyObj<ChatroomService>;
  let toneAnalyzerServiceSpy: jasmine.SpyObj<ToneAnalyzerService>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;
  let mockSubscription: jasmine.SpyObj<Subscription>;
  let mockObservable: jasmine.SpyObj<any>;

  userInfoServiceSpy = jasmine.createSpyObj(
    'UserInfoService',
    ['getUserByEmail', 'getUserList']);
  chatroomServiceSpy = jasmine.createSpyObj(
    'ChatroomService',
    ['addUserToChatroom', 'getUpdates']);
  toneAnalyzerServiceSpy = jasmine.createSpyObj(
    'ToneAnalyzerService', ['toneAnalyze']);
  messageServiceSpy = jasmine.createSpyObj(
    'MessageService', ['sendMessage']);
  mockSubscription = jasmine.createSpyObj(
    'MockSubscription',
    ['unsubscribe']);
  mockObservable = jasmine.createSpyObj(
    'MockObservable',
    ['subscribe']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        MaterialModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        AngularFireModule.initializeApp(environment.firebase),
        RouterTestingModule
      ],
      declarations: [ChatboxComponent],
      providers: [AuthService, AngularFireAuth, AngularFirestore,
        { provide: UserInfoService, useValue: userInfoServiceSpy},
        { provide: ChatroomService, useValue: chatroomServiceSpy},
        { provide: ToneAnalyzerService, useValue: toneAnalyzerServiceSpy},
        { provide: MessageService, useValue: messageServiceSpy}],
    }).compileComponents();
  }));

  beforeEach(() => {
    TestBed.get(UserInfoService)
      .getUserByEmail.withArgs(jasmine.any(String))
      .and.returnValue(RESOLVED_PROMISE_WITH_CHATROOMS);
    TestBed.get(UserInfoService)
      .getUserList.withArgs()
      .and.returnValue(mockObservable);
    TestBed.get(ChatroomService)
      .getUpdates.withArgs(jasmine.any(String))
      .and.returnValue(mockObservable);
    mockObservable
      .subscribe
      .and.callFake(() => {});

    fixture = TestBed.createComponent(ChatboxComponent);
    componentUnderTest = fixture.componentInstance;
    componentUnderTest.userInfo = USER_INFO;
    componentUnderTest.selectedConversation.id = SELECTED_CHATROOM_ID;
    componentUnderTest.userListSubscription = mockSubscription;

    fixture.detectChanges();
  });

  it('calling getChatroomList() SHOULD retrieve chatroomList IF user has chatrooms', () => {
    TestBed.get(UserInfoService)
      .getUserByEmail.withArgs(jasmine.any(String))
      .and.returnValue(RESOLVED_PROMISE_WITH_CHATROOMS);
    componentUnderTest.getChatroomList().then(() => {
      expect(componentUnderTest.chatroomList)
        .toEqual([{id: CHATROOM1_ID, name: CHATROOM1_NAME}, {id: CHATROOM2_ID, name: CHATROOM2_NAME}]);

    }).catch();
  });

  it('calling getChatroomList() SHOULD reject IF user has no chatrooms', () => {
    TestBed.get(UserInfoService)
      .getUserByEmail.withArgs(jasmine.any(String))
      .and.returnValue(RESOLVED_PROMISE_WITH_NO_CHATROOMS);
    componentUnderTest.getChatroomList().catch((e) => {
      expect(e).toEqual(jasmine.any(Error));

    });
  });

  it('calling getChatroomList() SHOULD reject IF email does not exist', () => {
    TestBed.get(UserInfoService)
      .getUserByEmail.withArgs(jasmine.any(String))
      .and.returnValue(REJECTED_PROMISE_EMAIL_NOT_FOUND);
    componentUnderTest.getChatroomList().catch((e) => {
      expect(e).toEqual(jasmine.any(Error));

    });
  });

  it('calling addUserByEmail() SHOULD reject IF email is invalid', () => {
    componentUnderTest.addUserByEmail(INVALID_EMAIL).catch((e) => {
      expect(e).toBeUndefined();
    });
  });

  it('calling addUserByEmail() SHOULD resolve IF email exists', () => {
    TestBed.get(UserInfoService)
      .getUserByEmail.withArgs(jasmine.any(String))
      .and.returnValue(Promise.resolve(USER_INFO));
    TestBed.get(ChatroomService)
      .addUserToChatroom.withArgs(jasmine.any(String), jasmine.any(String))
      .and.returnValue(Promise.resolve());
    spyOn(componentUnderTest, 'updateUserList');
    componentUnderTest.addUserByEmail(VALID_EMAIL_REGISTERED).then(() => {
      expect(userInfoServiceSpy.getUserByEmail).toHaveBeenCalled();
      expect(chatroomServiceSpy.addUserToChatroom).toHaveBeenCalled();
      expect(componentUnderTest.updateUserList).toHaveBeenCalled();
    });
  });

  it('calling updateEmoji() SHOULD return emoji IF valid tone', () => {
    for (const tone of Object.keys(TONES_EMOJI_DICT)) {
      expect(componentUnderTest.updateEmoji(tone)).toEqual(TONES_EMOJI_DICT[tone]);
    }
  });

  it('calling updateEmoji() SHOULD return undefined IF invalid tone', () => {
    expect(componentUnderTest.updateEmoji(INVALID_TONE)).toBeUndefined();
  });

  it('calling openConversation() SHOULD update chat history and user list IF index is valid', () => {
    const chatroomList = [{id: CHATROOM1_ID, name: CHATROOM1_NAME}, {id: CHATROOM2_ID, name: CHATROOM2_NAME}];
    componentUnderTest.chatroomList = chatroomList;
    spyOn(componentUnderTest, 'updateChatHistory');
    spyOn(componentUnderTest, 'updateUserList');
    TestBed.get(ChatroomService)
      .getUpdates.withArgs(jasmine.any(String))
      .and.returnValue(mockObservable);

    componentUnderTest.openConversation(SELECTED_CHATROOM_INDEX);

    expect(componentUnderTest.selectedConversation.name).toEqual(chatroomList[SELECTED_CHATROOM_INDEX].name);
    expect(componentUnderTest.selectedConversation.id).toEqual(chatroomList[SELECTED_CHATROOM_INDEX].id);
    expect(componentUnderTest.updateChatHistory).toHaveBeenCalled();
    expect(componentUnderTest.updateUserList).toHaveBeenCalled();
  });

  it('calling getUserName() SHOULD return displayName IF valid userID', () => {
    componentUnderTest.userListEvents = USERS_IN_SELECTED_CHATROOM;
    expect(componentUnderTest.getUserName('userID1')).toEqual(USERS_IN_SELECTED_CHATROOM[0].displayName);
    expect(componentUnderTest.getUserName('userID2')).toEqual(USERS_IN_SELECTED_CHATROOM[1].displayName);
    expect(componentUnderTest.getUserName('anyuserstring')).toEqual('User is not in this channel');
  });

  it('calling getPhotoURL() SHOULD return photoURL IF valid userID', () => {
    componentUnderTest.userListEvents = USERS_IN_SELECTED_CHATROOM;
    expect(componentUnderTest.getPhoto('userID1')).toEqual(USERS_IN_SELECTED_CHATROOM[0].photoURL);
    expect(componentUnderTest.getPhoto('userID2')).toEqual(USERS_IN_SELECTED_CHATROOM[1].photoURL);
    expect(componentUnderTest.getPhoto('anyuserstring')).toEqual('http://bit.ly/chitty-ghost');
  });


  it('calling updateChatHistory() SHOULD update events IF message history is nonempty', () => {
    componentUnderTest.chatroomSubscription = mockSubscription;
    componentUnderTest.selectedConversation.id = SELECTED_CHATROOM_ID;
    TestBed.get(ChatroomService)
      .getUpdates.withArgs(jasmine.any(String))
      .and.returnValue(mockObservable);
    mockObservable.subscribe.and.callFake((subscribeCallback) => {
      subscribeCallback(CHAT_HISTORY);
    });

    componentUnderTest.updateChatHistory();

    expect(mockSubscription.unsubscribe).toHaveBeenCalled();
    expect(chatroomServiceSpy.getUpdates).toHaveBeenCalled();
    expect(mockObservable.subscribe).toHaveBeenCalled();
    expect(componentUnderTest.events.length).toEqual(CHAT_HISTORY.length);
  });

  it('calling updateChatHistory() SHOULD return IF message history is empty', () => {
    componentUnderTest.chatroomSubscription = mockSubscription;
    componentUnderTest.selectedConversation.id = SELECTED_CHATROOM_ID;
    TestBed.get(ChatroomService)
      .getUpdates.withArgs(jasmine.any(String))
      .and.returnValue(mockObservable);
    mockObservable.subscribe.and.callFake((subscribeCallback) => {
      subscribeCallback(EMPTY_CHAT_HISTORY);
    });

    componentUnderTest.updateChatHistory();

    expect(mockSubscription.unsubscribe).toHaveBeenCalled();
    expect(chatroomServiceSpy.getUpdates).toHaveBeenCalled();
    expect(mockObservable.subscribe).toHaveBeenCalled();
    expect(componentUnderTest.events.length).toEqual(EMPTY_CHAT_HISTORY.length);
  });

  it('calling updateUserList() SHOULD update userListEvents IF users are in selected chatroom', () => {
    componentUnderTest.userListSubscription = mockSubscription;
    componentUnderTest.selectedConversation.id = SELECTED_CHATROOM_ID;
    TestBed.get(UserInfoService)
      .getUserList
      .and.returnValue(mockObservable);
    mockObservable
      .subscribe
      .and.callFake((subscribeCallback) => {
        subscribeCallback(USERS_IN_SELECTED_CHATROOM);
      });

    componentUnderTest.updateUserList();

    expect(userInfoServiceSpy.getUserList).toHaveBeenCalled();
    expect(mockObservable.subscribe).toHaveBeenCalled();
    expect(componentUnderTest.userListEvents.length).toEqual(USERS_IN_SELECTED_CHATROOM.length);
  });

  it('calling sendMessage() SHOULD call updateToneInFirebase() IF message is nonempty', () => {
    spyOn(componentUnderTest, 'updateToneInFirebase');
    componentUnderTest.message = MESSAGE;
    TestBed.get(ToneAnalyzerService)
      .toneAnalyze.withArgs(jasmine.any(String))
      .and.returnValue(mockObservable);

    componentUnderTest.sendMessage(MESSAGE);

    expect(componentUnderTest.updateToneInFirebase).toHaveBeenCalled();
    expect(componentUnderTest.message.length).toEqual(0);
  });

  it ('calling sendMessage() SHOULD return IF message is empty', () => {
    spyOn(componentUnderTest, 'updateToneInFirebase');
    componentUnderTest.message = EMPTY_MESSAGE;
    TestBed.get(ToneAnalyzerService)
      .toneAnalyze.withArgs(jasmine.any(String))
      .and.returnValue(mockObservable);

    componentUnderTest.sendMessage(MESSAGE);

    expect(componentUnderTest.updateToneInFirebase).not.toHaveBeenCalled();
  });

  it ('calling updateToneInFirebase() SHOULD call message and tone analyzer service', () => {
    TestBed.get(ToneAnalyzerService)
      .toneAnalyze.withArgs(jasmine.any(String))
      .and.returnValue(mockObservable);
    mockObservable
      .subscribe
      .and.callFake((subscribeCallback) => {
        subscribeCallback(TONE_ANALYZER_SERVICE_RESPONSE);
      });
    componentUnderTest.selectedConversation.id = SELECTED_CHATROOM_ID;

    componentUnderTest.updateToneInFirebase(MESSAGE);

    expect(toneAnalyzerServiceSpy.toneAnalyze).toHaveBeenCalled();
    expect(mockObservable.subscribe).toHaveBeenCalled();
    expect(messageServiceSpy.sendMessage).toHaveBeenCalledWith(USER_INFO.uid, jasmine.any(Date), SELECTED_CHATROOM_ID, MESSAGE, 'angry');
  });

  function createChatroomDocumentRef(id: string, roomName: string) {
    return {
      id,
      get() {
        return new Promise((resolve, reject) => {
          resolve({
            data() {
              return {roomName};
            }
          });
        });
      }
    };
  }
});
