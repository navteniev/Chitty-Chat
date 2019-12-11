import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, DocumentReference, DocumentSnapshot } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserInfoService } from '../services/user-info.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
    /** holds User observable
     */
    user$: Observable<User>;

    /**
     * sets user if logged in or not upon initializing service
     * sends a document reference of user id in database to user
     * or null if not logged in
     * @param afAuth angular fire authentication
     * @param afs angular firestore
     * @param router used in sign out to redirect to sign in page
     */
    constructor(
        private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
        private router: Router,
        private userInfoService: UserInfoService
    ) {
      this.user$ = this.afAuth.authState.pipe(
        switchMap(user => {
            // Logged in
          if (user) {
            console.log( `users id is /${user.uid}`);
            return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
          } else {
            // Logged out
            return of(null);
          }
        })
      );
     }

     /**
      * signs in the user
      * @returns function call to addNewUserToFirebase with the google authentication
      */
     async googleSignin() {
      const provider = new auth.GoogleAuthProvider();
      const credential = await this.afAuth.auth.signInWithPopup(provider);
      return this.addNewUserToFirebase(credential.user);
    }

    /**
     * Adds new users to the database
     * @param user User info provided by google after oauth signin
     */
    public addNewUserToFirebase(user: firebase.User): Promise<void> {
      return new Promise((resolve, reject) => {
        this.afs.doc(`users/${user.uid}`).ref.get()
          .then((userSnapshot) => {
            if (userSnapshot.exists) {
              resolve();
            } else {
              const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
              const chatroom1: DocumentReference = this.afs.doc(`chatrooms/e0cGp5IpWGb9AuC3iuM2`).ref;
              const chatroom2: DocumentReference = this.afs.doc(`chatrooms/UgQEVNxekZrld8UJqtkZ`).ref;
              const chatroom3: DocumentReference = this.afs.doc(`chatrooms/05kbCceCnYxcfOxewCJK`).ref;
              const data = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                chatroomRefs: [chatroom1, chatroom2, chatroom3],
                status: 'on'
              };
              return userRef.set(data, { merge: true });
            }
          });
      });
    }

    /**
     * waits until signs out promise returns true to navagate to the google sign in page
     * @returns a promise of 'true' if navigated, 'false' when not navigates and reject when error occurs
     */
    async signOut() {
      this.userInfoService.updateUser(this.afAuth.auth.currentUser.uid, 'off');
      await this.afAuth.auth.signOut();
      this.router.navigate(['/']);
    }

}
