import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/models/confirmation-dialog-data';
import { ChatroomService } from '../services/chatroom.service';

/**
 * UI for prompting for confirmations
 */
@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {

  /**
   * Title of modal
   */
  title: string;

  /**
   * Prompt to user
   */
  prompt: string;

  /**
   * Constructor
   * @param chatroomService Service for handling chatrooms
   * @param dialogRef Reference to dialog component
   * @param data Data passed from parent
   */
  constructor(
    public chatroomService: ChatroomService,
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  /**
   * Sets prompt and title
   */
  ngOnInit() {
    this.prompt = this.data.prompt;
    this.title = this.data.title;
  }

  /**
   * Deletes the chatroom in firebase
   * @returns Promise that resolves if the chatroom is successfully deleted
   */
  deleteChatroom(): Promise<any> {
    return this.chatroomService
      .deleteChatroom(this.data.chatroomID)
      .then(() => {
        this.data.callback();
        this.closeDialog();
      });
  }

  /**
   * Closes the component
   * @returns void
   */
  closeDialog(): void {
    this.dialogRef.close();
  }

}
