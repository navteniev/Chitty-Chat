import { TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserInfoService } from '../../services/user-info.service';
import { of } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { UserNotFoundError } from 'src/app/models/UserNotFoundError';

let service: UserInfoService;

describe('UserInfoService.getUserList()', () => {

  const mockReturn = [{
    payload: {
      doc: {
        data() {
          return {data: 'mock data'};
        },
        id: 'mock id'
      }
    }
  }];

  const mockCollection = jasmine.createSpyObj({
    snapshotChanges: of(mockReturn)
  });

  const firestoreServiceSpy = jasmine.createSpyObj('AngularFirestore', {
    collection: mockCollection
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [
        UserInfoService,
        { provide: AngularFirestore, useValue: firestoreServiceSpy }
      ],
  });
    service = TestBed.get(UserInfoService);
});

  it('calling getUserList() should return an observable', () => {

    let respond;
    service.getUserList().subscribe(res => {
      respond = res;
    });
    expect(mockCollection.snapshotChanges).toHaveBeenCalled();
    expect(firestoreServiceSpy.collection).toHaveBeenCalledWith('users');

    expect(respond[0].id).toEqual('mock id');
    expect(respond[0].data).toEqual('mock data');

  });
});

describe('UserInfoService.getCurrentUserInfo()', () => {

  const mockReturn = {
    payload: {
      id: 'mock id',
      data() {
        return 'mock data';
      }
    }
  };

  const mockDoc = jasmine.createSpyObj({
    snapshotChanges: of(mockReturn)
  });

  const firestoreServiceSpy = jasmine.createSpyObj('AngularFirestore', {
    doc: mockDoc
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [
        UserInfoService,
        { provide: AngularFirestore, useValue: firestoreServiceSpy }
      ],
  });
    service = TestBed.get(UserInfoService);
});

  it('calling getCurrentUserInfo() should return an observable', () => {

    let respond;
    service.getCurrentUserInfo('mock user').subscribe(res => {
      respond = res;
    });

    expect(firestoreServiceSpy.doc).toHaveBeenCalledWith('users/mock user');
    expect(mockDoc.snapshotChanges).toHaveBeenCalled();

    expect(respond.payload.id).toEqual('mock id');
    expect(respond.payload.data()).toEqual('mock data');

    mockReturn.payload.id = 'modified id';
    expect(respond.payload.id).toEqual('modified id');
  });
});

describe('UserInfoService.getUserByEmail()', () => {
  const USER_EMAIL = 'email';
  const USER_INFO = {
    uid: 'uid',
    email: USER_EMAIL,
    friendList: ['friend1', 'friend2'],
    chatrooms: ['chatroomID1', 'chatroomID2']
  };
  const RESOLVED_PROMISE_WITH_USER_INFO = Promise.resolve([{
    data(): User { return USER_INFO; }
  }]);
  const RESOLVED_PROMISE_WITH_NO_USER_INFO = Promise.resolve({size: 0});

  let serviceUnderTest: UserInfoService;
  let mockObject: jasmine.SpyObj<any>;
  let firestoreServiceSpy: jasmine.SpyObj<AngularFirestore>;

  firestoreServiceSpy = jasmine.createSpyObj('FirestoreService', ['collection']);
  mockObject = jasmine.createSpyObj('MockObject', ['ref', 'where', 'get']);

  firestoreServiceSpy.collection.withArgs(jasmine.any(String)).and.returnValue(mockObject);
  mockObject.ref = mockObject;
  mockObject.where.withArgs(jasmine.any(String), jasmine.any(String), jasmine.any(String)).and.returnValue(mockObject);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
          UserInfoService,
          { provide: AngularFirestore, useValue: firestoreServiceSpy }
        ],
    });
  });

  it('calling getUserByEmail() SHOULD resolve IF email exists', () => {
    mockObject.get.and.returnValue(RESOLVED_PROMISE_WITH_USER_INFO);
    serviceUnderTest = TestBed.get(UserInfoService);
    serviceUnderTest.getUserByEmail(USER_EMAIL).then((userInfo) => {
      expect(userInfo).toEqual(USER_INFO);
    });
  });

  it('calling getUserByEmail() SHOULD reject IF email does not exist', () => {
    mockObject.get.and.returnValue(RESOLVED_PROMISE_WITH_NO_USER_INFO);
    serviceUnderTest = TestBed.get(UserInfoService);
    serviceUnderTest.getUserByEmail(USER_EMAIL).catch((e: UserNotFoundError) => {
      expect(e).toEqual(jasmine.any(UserNotFoundError));
    });
  });

});


describe('UserInfoService.updateUser()', () => {

  const RESOLVED_PROMISE = Promise.resolve('success');

  const firestoreServiceSpy = jasmine.createSpyObj(
    'AngularFirestore', ['collection', 'doc', 'update']);

  beforeEach(() => {
    firestoreServiceSpy.collection.and.returnValue(firestoreServiceSpy);
    firestoreServiceSpy.doc.and.returnValue(firestoreServiceSpy);
    firestoreServiceSpy.update.and.returnValue(RESOLVED_PROMISE);
    TestBed.configureTestingModule({
    providers: [
        UserInfoService,
        { provide: AngularFirestore, useValue: firestoreServiceSpy }
      ],
  });
    service = TestBed.get(UserInfoService);
});

  it('calling updateUser() should return success', () => {

    service.updateUser('userID', 'off')
    .then(res => {
      expect(res).toEqual('success');
      expect(firestoreServiceSpy.collection).toHaveBeenCalled();
      expect(firestoreServiceSpy.doc).toHaveBeenCalled();
      expect(firestoreServiceSpy.update).toHaveBeenCalled();
    });

  });
});
