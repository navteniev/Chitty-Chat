/**
 * chatuser is an interface object used with the properties
 *      coinciding to our cloud firestore /chatrooms collection.
 *
 */
export interface Chatuser {
    /**
     * user id
     */
    uid: string;
    /**
     * name of user
     */
    displayName: string;
    /**
     * email of user
     */
    email: string;
    /**
     * holds a list of chatrooms
     */
    chatroomRefs?: [{id: string}, {id: string}];
    /**
     * google avatar photo link
     */
    photoURL: string;
}
