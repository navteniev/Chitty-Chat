import { Chat } from './chat.model';

export interface Chatroom {
    uid: string;
    chats: Chat[];
    members: string[];
    roomName: string;
    created_at: string;
}
