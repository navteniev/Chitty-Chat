import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatroomService } from '../services/chatroom.service';
import { DialogData } from 'src/app/models/confirmation-dialog-data';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ConfirmationDialogComponent } from './confirmation-dialog.component';


describe('ConfirmationDialogComponent', () => {
  const TITLE = 'Chatroom Title';
  const PROMPT = 'Chatroom Prompt';
  const CHATROOM_ID = 'ChatroomID';
  const CALLBACK = () => {};
  const ERROR_MESSAGE = 'failed';
  const MOCK_DIALOG_DATA = {
    title: TITLE,
    prompt: PROMPT,
    chatroomID: CHATROOM_ID,
    callback: CALLBACK
  };
  const RESOLVED_PROMISE = Promise.resolve();
  const REJECTED_PROMISE = Promise.reject(ERROR_MESSAGE);

  let componentUnderTest: ConfirmationDialogComponent;
  let fixture: ComponentFixture<ConfirmationDialogComponent>;
  let chatroomServiceSpy: jasmine.SpyObj<ChatroomService>;
  let dialogRefSpy: jasmine.SpyObj<any>;

  chatroomServiceSpy = jasmine.createSpyObj(
    'ChatroomService',
    ['deleteChatroom']);
  dialogRefSpy = jasmine.createSpyObj(
    'DialogRef',
    ['close']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmationDialogComponent ],
      providers: [
        {provide: ChatroomService, useValue: chatroomServiceSpy},
        {provide: MAT_DIALOG_DATA, useValue: MOCK_DIALOG_DATA},
        {provide: MatDialogRef, useValue: dialogRefSpy}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    componentUnderTest = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(componentUnderTest).toBeTruthy();
    expect(componentUnderTest.prompt).toEqual(MOCK_DIALOG_DATA.prompt);
    expect(componentUnderTest.title).toEqual(MOCK_DIALOG_DATA.title);
  });

  it('calling closeDialog() SHOULD call dialogRef.close()', () => {
    expect(componentUnderTest.closeDialog()).toBeUndefined();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it ('calling deleteChatroom() SHOULD resolve IF delete succeeds', () => {
    chatroomServiceSpy
      .deleteChatroom.withArgs(jasmine.any(String))
      .and.returnValue(RESOLVED_PROMISE);

    const returnedPromise = componentUnderTest.deleteChatroom();

    returnedPromise.then(() => {
      expect(chatroomServiceSpy.deleteChatroom).toHaveBeenCalledWith(CHATROOM_ID);
      expect(dialogRefSpy.close).toHaveBeenCalled();
    });
  });

  it ('calling deleteChatroom() SHOULD reject IF delete fails', () => {
    chatroomServiceSpy
      .deleteChatroom.withArgs(jasmine.any(String))
      .and.returnValue(REJECTED_PROMISE);

    const returnedPromise = componentUnderTest.deleteChatroom();

    returnedPromise.catch((e) => {
      expect(e).toEqual(ERROR_MESSAGE);
    });
  });
});
