/**
 * Interface for data passed to confirmation dialog modal
 */
export interface DialogData {
  /**
   * Title of modal
   */
  title: string;

  /**
   * Prompt to user
   */
  prompt: string;

  /**
   * ID of selected chatroom
   */
  chatroomID: string;

  /**
   * Function to be called after confirmation
   */
  callback: () => any;
}
