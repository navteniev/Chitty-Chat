import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference, QueryDocumentSnapshot, QuerySnapshot } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { UserNotFoundError } from '../models/UserNotFoundError';
@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  constructor(private db: AngularFirestore) { }

  /**
   * get all users id and metadata
   * @returns an observable object that contains id and metadata of each user
   */
  public getUserList() {
    return this.db.collection('users').snapshotChanges()
            .pipe(map(actions =>
              actions.map(obj => {
                const id = obj.payload.doc.id;
                const data = obj.payload.doc.data();
                return {id, ...data};
              })
            )
          );
  }

  /**
   * get a user's info
   * @param userID id of this user
   * @returns an observable object that contains id and metadata of this user
   * use respond.payload.data() to achieve metadata
   * respond.payload.id to achieve id
   */
  public getCurrentUserInfo(userID: string) {
    return this.db.doc(`users/${userID}`).snapshotChanges();
  }

  /**
   * Returns a promise that resolves if a user exists with the specified email
   * @param email The email of the user
   * @returns A Promise<User> of the requested user
   */
  public getUserByEmail(email: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.collection('users').ref
      .where('email', '==', email)
      .get()
      .then((querySnapshot: QuerySnapshot<User>) => {
        if (querySnapshot.size === 0) {
          reject(new UserNotFoundError(`User with email: (${email}) does not exist`));
        } else {
          querySnapshot.forEach((userDocumentSnapshot: QueryDocumentSnapshot<User>) => {
            console.log(userDocumentSnapshot.data());
            resolve(userDocumentSnapshot.data());
          });
        }
      });
    });
  }

  /**
   * update user status
   * @param userID user id
   * @param status user status on/off
   * @returns Promise<string>
   */
  public updateUser(userID: string, status: string): Promise<string> {
    return this.db.collection(`users`).doc(userID).update({status})
    .then(() =>  'success' );
  }
}
