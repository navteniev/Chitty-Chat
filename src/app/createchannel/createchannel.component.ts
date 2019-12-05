import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/models/createchat.model';
import { ChatroomService } from '../services/chatroom.service';
import { UserInfoService } from '../services/user-info.service';

/**
 * createchannel is an user interface that pops up when clicking the + to add a chatroom
 */
@Component({
  selector: 'app-createchannel',
  templateUrl: './createchannel.component.html',
  styleUrls: ['./createchannel.component.scss']
})
export class CreateChannelComponent implements OnInit {
  /**
   * constructor
   * @todo this documentation
   * @returns void
   */
  constructor(
    public userService: UserInfoService,
    public chatroomService: ChatroomService,

    @Optional() public dialogRef: MatDialogRef<CreateChannelComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  /** roomName holds the name of the inputed chatroom
   */
  roomName: string;
  /**
   * not used
   */
  ngOnInit() {}
  /**
   * sends to firebase calls addnewChatroom with an input roomName with length > 0
   *          on a ChatroomService instance.
   *          After the promise is received and accepted, it calls
   *          addUserToChatroom to add the current user to that new chatroom.
   *          When that promise is received and accepted it updates the chatroom list and closes dialogue
   *
   * @returns void
   */
  sendToFirebase(): void {
    if (this.roomName && this.roomName.trim().length > 0) {
      this.chatroomService.addNewChatroom('public', this.roomName, [], this.data.ownerID)
        .then((chatroomID: any) => {
          this.chatroomService.addUserToChatroom(this.data.ownerID, chatroomID)
            .then(() => {
              this.data.getChatroomList();
              this.onNoClick();
            });
        });
    }
  }
  /**
   * closes the dialogue, used on the "exit" button
   *
   * @returns void
   */
  onNoClick(): void {
    this.dialogRef.close();
  }
}
