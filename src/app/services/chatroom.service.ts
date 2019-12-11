import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject, Observable } from 'rxjs';
import { map, take} from 'rxjs/operators';
import { firestore } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class ChatroomService {

  constructor(private db: AngularFirestore) { }

  /**
   * get all chatroom id and metadata
   * @returns an observable object that contains id and metadata of each chatroom
   */

  private darkTheme: Subject<boolean> = new Subject<boolean>();
  isDarkTheme = this.darkTheme.asObservable();

  setDarkTheme(isDarkTheme: boolean) {
    console.log("TEST");
    this.darkTheme.next(isDarkTheme);
  }

  public getChatroomList() {
    return this.db.collection('chatrooms').snapshotChanges()
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
   * get chat history of a chatroom
   * @param roomID id of the chatroom
   * @returns an object that contains id and metadata of each chat
   */
  public getChatHistory(roomID: string) {
    return this.db.collection(`chatrooms/${roomID}/chats`).snapshotChanges()
            .pipe(take(1))
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
   * add a new chatroom to database
   * @param status indicate public or private this new chatroom will be
   * @param roomName name of this new chatroom
   * @param userList all the users can access this new chatroom
   * @param ownerID id of the owner
   */
  public addNewChatroom(status: string, roomName: string, userList: string[], ownerID: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const ROOMID = this.db.createId();
      this.db
      .collection(`chatrooms`)
      .doc(ROOMID)
      .set({
        status,
        members: userList,
        ownerID,
        when: new Date(),
        roomName
      })
      .then(() => {
        return resolve(ROOMID);
      })
      .catch(error => {
        return reject(error);
      });
    });
  }

  /**
   * get update of newest chats in a chatroom
   * @param chatRoomID id of the chatroom
   * @returns an observable object that contains id and metadata of chats (sorted by their timestamp)
   */
  public getUpdates(chatRoomID: string): Observable<any> {
    return this.db
      .collection(`chatrooms/${chatRoomID}/chats`)
      .stateChanges(['added'])
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        })),
        map(messages => messages.sort((a: any, b: any) => {
          return a.when.seconds - b.when.seconds;
        })));
  }

  /**
   * Adds chatroom to a user's chatroomsRefs property
   *          and adds the user to the chatroom's members property
   * @param userID The ID of the user
   * @param chatroomID The ID of the chatroom
   * @returns Promise that resolves if both add operations are successful
   */
  public addUserToChatroom(userID: string, chatroomID: string): Promise<any> {

    const batch = this.db.firestore.batch();

    batch.update(this.db.doc(`chatrooms/${chatroomID}`).ref, {
      members: firestore.FieldValue.arrayUnion(userID)
    });

    batch.update(this.db.doc(`users/${userID}`).ref, {
      chatroomRefs: firestore.FieldValue.arrayUnion(
        this.db.doc(`chatrooms/${chatroomID}`).ref)
    });

    return batch.commit();
  }

  /**
   * delete a chatroom
   * @param chatroomID The ID of the chatroom
   * @returns Promise that resolves if delete doc is successful
   *          or reject if something goes wrong
   */
  public deleteChatroom(chatroomID: string): Promise<any> {
    const chatroomRef = this.db.doc(`chatrooms/${chatroomID}`).ref;
    return new Promise((resolve, reject) => {
      // delele all sub documents inside this chatroom
      chatroomRef.collection('chats').get()
      .then(docs => {
        const batch = this.db.firestore.batch();
        docs.forEach(doc => {
          batch.delete(doc.ref);
        });
        return batch.commit();
      })
      // delete chatroom
      .then(() => chatroomRef.delete())
      // delete all chatroom refs in users
      .then(() => this.delChatroomRefInUsers(chatroomRef))
      .catch(e => reject('failed!'));
    });
  }

  /**
   * delete all chatroom refs in user's chatroomRefs array
   * @param chatroomRef The ref of the chatroom
   * @returns Promise that resolves if success
   *          or reject if something goes wrong
   */
  public delChatroomRefInUsers(chatroomRef: any): Promise<any> {
    return new Promise((resolve, reject) => {
      // get all user refs that contains this chatroomRef, then remove chatroomRef from chatroomRefs array
      this.db.collection('users').ref.where('chatroomRefs', 'array-contains', chatroomRef).get()
        .then(docs => {
          const batch = this.db.firestore.batch();
          docs.forEach(doc => {
            batch.update(doc.ref, {
              chatroomRefs: firestore.FieldValue.arrayRemove(chatroomRef)
            });
          });
          return batch.commit();
        })
        .then (() => resolve('success!'))
        .catch(() => reject('failed!'));
    });
  }

}
