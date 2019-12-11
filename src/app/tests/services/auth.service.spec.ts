import { async, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UserInfoService } from '../../services/user-info.service';

describe('AuthService', () => {
  const mockCredential = [{
    user:
    {
    uid: 'mock uid',
    email: 'mock email',
    displayName: 'mock name',
    photoURL: 'mock photo',
    friendList: 'mock friend list',
    chatrooms: 'mock chatrooms'
    }
  }];

  let routerSpy: jasmine.SpyObj<any>;
  let mockAuth: jasmine.SpyObj<any>;
  let serviceUnderTest: AuthService;
  let firestoreServiceSpy: jasmine.SpyObj<any>;
  let angularFireAuthSpy: jasmine.SpyObj<any>;
  let mockDocument: jasmine.SpyObj<any>;
  let mockFirestoreDocumentReference: jasmine.SpyObj<any>;
  let mockDocumentSnapshot: jasmine.SpyObj<any>;
  let mockUserInfo: jasmine.SpyObj<any>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj(
      'routerSpy',
      ['navigate']
    );
    routerSpy.navigate.and.returnValue(routerSpy);

    angularFireAuthSpy = jasmine.createSpyObj(
      'AngularFireAuthSpy',
      ['auth', 'authState']);
    mockAuth = jasmine.createSpyObj(
      'authSpy',
      ['signInWithPopup', 'signOut', 'currentUser']);
    firestoreServiceSpy = jasmine.createSpyObj(
      'FirestoreSpy',
      ['doc']);

    mockDocument = jasmine.createSpyObj(
      'firebaseDocSpy',
      ['set', 'valueChanges']
    );

    mockFirestoreDocumentReference = jasmine.createSpyObj(
      'firebaseDocumentReferenceSpy',
      ['get']
    );

    mockDocumentSnapshot = jasmine.createSpyObj('documentSnapshotSpy', ['']);

    mockUserInfo = jasmine.createSpyObj('userInfoSpy', ['']);
    mockUserInfo.uid = 'uid';
    mockUserInfo.email = 'email';
    mockUserInfo.displayName = 'displayName';
    mockUserInfo.photoURL = 'photoURL';

    angularFireAuthSpy.auth = mockAuth;
    mockAuth.signInWithPopup.and.returnValue(mockCredential[0]);
    mockAuth.currentUser = {uid: 'uid'};

    firestoreServiceSpy.doc.and.returnValue(mockDocument);

    angularFireAuthSpy.authState = new Observable((subscriber) => subscriber.next(mockCredential[0].user));
    mockDocument.valueChanges.and.returnValue(new Observable((subscriber) => subscriber.next(mockCredential[0].user)));
    mockDocument.ref = mockFirestoreDocumentReference;

    mockFirestoreDocumentReference.get.and.returnValue(Promise.resolve(mockDocumentSnapshot));

    TestBed.configureTestingModule({
    providers: [
      AuthService, UserInfoService,
      { provide: Router, useValue: routerSpy},
      { provide: AngularFirestore, useValue: firestoreServiceSpy },
      { provide: AngularFireAuth, useValue: angularFireAuthSpy }
    ]
  });

});

  it('googleSignin() should update user info to firestore', () => {

    serviceUnderTest = TestBed.get(AuthService);
    spyOn(serviceUnderTest, 'addNewUserToFirebase');

    serviceUnderTest.googleSignin().then(() => {
      expect(serviceUnderTest.addNewUserToFirebase).toHaveBeenCalled();
      expect(firestoreServiceSpy.doc).toHaveBeenCalled();
      expect(mockDocument.set).toHaveBeenCalled();
    });

    expect(mockAuth.signInWithPopup).toHaveBeenCalled();
  });

  it('addNewUserToFirebase() SHOULD update user info to firestore IF user does not exist', () => {
    mockDocumentSnapshot.exists = false;
    serviceUnderTest = TestBed.get(AuthService);
    serviceUnderTest.addNewUserToFirebase(mockUserInfo).then(() => {
      expect(serviceUnderTest.addNewUserToFirebase).toHaveBeenCalled();
      expect(firestoreServiceSpy.doc).toHaveBeenCalled();
      expect(mockDocument.set).toHaveBeenCalled();
    });
  });

  it('addNewUserToFirebase() SHOULD resolve IF user exists', async(() => {
    mockDocumentSnapshot.exists = true;
    serviceUnderTest = TestBed.get(AuthService);
    serviceUnderTest.addNewUserToFirebase(mockUserInfo).then(() => {
      expect(firestoreServiceSpy.doc).toHaveBeenCalled();
      expect(mockFirestoreDocumentReference.get).toHaveBeenCalled();
    });
  }));

  it('user$ should return user info if there is an user signed in', () => {
    serviceUnderTest = TestBed.get(AuthService);

    serviceUnderTest.user$.subscribe(res => {
      expect(res.uid).toEqual('mock uid');
    });
    expect(firestoreServiceSpy.doc).toHaveBeenCalled();
    expect(mockDocument.valueChanges).toHaveBeenCalled();
  });

  it('user$ should return null if no user signed in', () => {
    angularFireAuthSpy.authState = new Observable();
    serviceUnderTest = TestBed.get(AuthService);

    serviceUnderTest.user$.subscribe(res => {
      expect(res).toEqual(null);
    });
  });

  it('signOut() should redirect router', fakeAsync(() => {
    serviceUnderTest = TestBed.get(AuthService);
    const userInfoService = TestBed.get(UserInfoService);
    spyOn(userInfoService, 'updateUser');
    serviceUnderTest.signOut();
    tick();
    expect(mockAuth.signOut).toHaveBeenCalled();
    tick();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  }));
});
