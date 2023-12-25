import { MessageType } from './global';

export type ConnectionReturn = {
    /** status of whatsapp connection. */
    status?: 'loading' | 'close' | 'ready';
    /** login id your bot whatsapp. */
    loginId?: number;
    /** login name your bot whatsapp. */
    loginName?: string;
    /** version of your whatsapp baileys. */
    waVersion?: string;
    /** check if latest version. */
    waLatest?: boolean;
}

export type MessageIntern = {
    /** message text from sender. */
    text: string;
    [_: string]: any
} & {
        [Key in MessageType]: any
    }

export type ReplyIntern = {
    /** message text from sender. */
    text: string;
    /** message chat id. */
    id: string;
    /** phone number of sender. */
    phoneNumber?: number;
    /** message chat remote id. */
    remoteJid: string;
    /**
     * is the **id**, namely the number of the sender.
     * 
     * like this ~ `628xxxxx@s.whatsapp.net`
     */
    sender: string;
    /** forwaded message. */
    isForwarded: boolean;
    /** view once message. */
    isViewOnce: boolean;
    /** the type of message sent. */
    type: MessageType;
} & {
        [Key in MessageType]: any
    }

export type MessageReturn = {
    /** message chat id. */
    id: string
    /** message chat remote id. */
    remoteJid: string
    /** phone number of sender. */
    phoneNumber?: number;
    /**
     * if a message is a message from itself, then this will be `true`.
     * 
     * I don't know how to explain it ![just kidding](https://i.ibb.co/vzrfwW7/image.png)
     */
    fromMe: boolean
    /** ⏳ the time at which the message was delivered. */
    timestamp: number
    /**
     * is the **id**, namely the number of the sender.
     * 
     * like this ~ `628xxxxx@s.whatsapp.net`
     */
    sender: string
    /** the nickname of a sender. */
    pushName: string
    /** broadcast message. */
    isBroadcast: boolean
    /** group message. */
    isGroup: boolean
    /** author message. */
    isAuthor: boolean
    /** edited message. */
    isEdited: boolean
    /** forwaded message. */
    isForwaded: boolean
    /** view once message. */
    isViewOnce: boolean
    /** reply message. */
    isReply: boolean
    /** ephemeral message. */
    isEphemeral: boolean
    /** list of mentioned senders. */
    senderMentions: []
    /** list of mentioned groups. */
    groupMentions: []
    /** the type of message sent. */
    messageType: string
    message: MessageIntern
    reply: ReplyIntern

    [_: string]: any
}