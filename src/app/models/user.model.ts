/**
 * User is an interface object with the properties
 *          coinciding to our cloud firestore /User collection.
 *
 */
export interface User {
    /**
     * user id
     */
    uid: string;
    /**
     * email address associated with user login
     */
    email: string;
    /**
     * google avatar photo link
     */
    photoURL?: string;
    /**
     * google account name
     */
    displayName?: string;
    /**
     * stores users online status
     */
    status?: string;
    /**
     * placeholder for data
     */
    myCustomData?: string;
    /**
     * stores friend list of user ids
     */
    friendList?: string[];
    /**
     * stores the chatroom ids the user is in
     */
    chatrooms?: string[];
    /**
     * stores chatroom references to chatrooms the user is in
     */
    chatroomsRef?: string[];
}
