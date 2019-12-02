import { TestBed } from '@angular/core/testing';

import { MessageService } from '../../services/message.service';
import { AngularFirestore } from '@angular/fire/firestore';

describe('MessageService', () => {
  const RESOLVED_PROMISE = Promise.resolve();
  const REJECTED_PROMISE = Promise.reject();
  const MESSAGE_ID = 'messageID';
  const USER_ID = 'userID';
  const WHEN: Date = new Date();
  const CHATROOM_ID = 'chatRoomID';
  const CONTENT = 'Message content text';
  const TONE = 'angry';

  let serviceUnderTest: MessageService;
  let mockCollection: jasmine.SpyObj<any>;
  let mockDocument: jasmine.SpyObj<any>;
  let firestoreServiceSpy: any;

  firestoreServiceSpy = jasmine.createSpyObj(
      'FirestoreService',
      ['collection', 'createId']);
  mockCollection = jasmine.createSpyObj('MockCollection', ['doc']);
  mockDocument = jasmine.createSpyObj('MockDocument', ['set', 'update']);

  beforeEach(() => {
    firestoreServiceSpy.createId.and.returnValue(MESSAGE_ID);
    firestoreServiceSpy.collection.withArgs(jasmine.any(String)).and.returnValue(mockCollection);
    mockCollection.doc.withArgs(jasmine.any(String)).and.returnValue(mockDocument);
    TestBed.configureTestingModule({
      providers: [
        MessageService, //  the service under test
        { provide: AngularFirestore, useValue: firestoreServiceSpy} //  mock service
      ]
    });

    serviceUnderTest = TestBed.get(MessageService);
  });

  it('calling sendMessage() should resolve IF writing to database succeeds', () => {
    mockDocument.set.withArgs(jasmine.any(Object)).and.returnValue(RESOLVED_PROMISE);

    const sendMessagePromise = serviceUnderTest.sendMessage(USER_ID, WHEN, CHATROOM_ID, CONTENT, TONE);

    sendMessagePromise
      .then((messageID: string) => {
        expect(messageID).toEqual(MESSAGE_ID);
      });
  });

  it('calling sendMessage() SHOULD reject IF writing to database fails', () => {
    mockDocument.set.withArgs(jasmine.any(Object)).and.returnValue(REJECTED_PROMISE);

    const sendMessagePromise = serviceUnderTest.sendMessage(USER_ID, WHEN, CHATROOM_ID, CONTENT, TONE);

    sendMessagePromise
      .catch((e: Error) => {
        expect(e).toBeUndefined();
      });
  });

  it('calling updateChatTone() SHOULD resolve IF updating message succeeds', () => {
    mockDocument.update.withArgs(jasmine.any(Object)).and.returnValue(RESOLVED_PROMISE);

    const updateChatTonePromise = serviceUnderTest.updateChatTone(CHATROOM_ID, MESSAGE_ID, TONE);

    updateChatTonePromise.then((data: any) => {
      expect(data).toBeUndefined();
    });
  });

});
