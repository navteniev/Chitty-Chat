import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private db: AngularFirestore) { }

  public sendMessage(
    userID: string, when: Date, chatRoomID: string,
    content: string, tone: string = 'empty'): Promise<any> {
    console.log(`Sending message for userID: ${userID}, when: ${when},
                chatRoomID: ${chatRoomID}, content: ${content}, emotion: ${tone}`);

    return new Promise((resolve, reject) => {
      const chatID = this.db.createId();
      this.db
        .collection(`chatrooms/${chatRoomID}/chats`)
        .doc(chatID)
        .set({
          content,
          tone_id: tone,
          user: userID,
          when
      })
      .then(() => {
        return resolve(chatID);
      })
      .catch(error => {
        return reject(error);
      });
    });
  }

  public updateChatTone(
    chatRoomID: string,
    chatID: string,
    tone: string): Promise<void> {
    console.log(`updating tone of chatID: ${chatID} chatRoomID: ${chatRoomID}
                 new tone: ${tone}`);

    return this.db
      .collection(`chatrooms/${chatRoomID}/chats`)
      .doc(chatID)
      .update({
        tone_id: tone,
      })
      .then((data) => {
        console.log('Promise data: ', data);
        console.log('tone successfully updated!');
      });
  }

}
