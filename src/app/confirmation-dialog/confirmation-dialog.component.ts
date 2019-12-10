import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/models/confirmation-dialog-data';
import { ChatroomService } from '../services/chatroom.service';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {

  title: string;
  prompt: string;

  constructor(
    public chatroomService: ChatroomService,
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
  

  ngOnInit() {
    this.prompt = this.data.prompt;
    this.title = this.data.title;
  }

  deleteChatroom(): Promise<any> {
    return this.chatroomService
      .deleteChatroom(this.data.chatroomID)
      .then(() => {
        console.log("DELETING CHATROOM")
        this.data.callback();
        this.closeDialog();
      })
      .catch((e) => {
        console.log("ERROR");
      })
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
