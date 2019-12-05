import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  /**
   * constructor of MessageService
   * @param db creates an instance of angularfirestore as private
   */
  constructor(private db: AngularFirestore) { }

  /**
   * sends message to database with a tone_id
   * @param userID userid
   * @param when time of message entry
   * @param chatRoomID the id of the chatroom to send the message to
   * @param content the content is text
   * @param tone the emotion as given by watson api
   * @returns promise
   */
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

  /**
   * updates chatroom message and tone in database. currently unused
   * @param chatRoomID chatroom id where the message is from
   * @param chatID the id of the chat message itself
   * @param tone emotion string of message from watson api
   * @returns console logs that the data is updated
   */
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
