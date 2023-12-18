export type ConnectionReturn = {
    status?: 'loading' | 'close' | 'ready';
    loginId?: number;
    loginName?: string;
    waVersion?: string;
    waLatest?: boolean;
}

export type MessageReturn = {
    id: string;
    remoteJid: string;
    fromMe: boolean;
    broadcast: boolean;
    timeStamp: number;
    message: {
        type: 'conversation' | 'extendedTextMessage' | 'ephemeralMessage' | 'editedMessage' | 'audioMessage' | 'imageMessage' | 'videoMessage' | 'stickerMessage' | 'documentMessage' | 'documentWithCaptionMessage' | 'contactMessage' | 'locationMessage' | 'reactionMessage' | 'productMessage' | 'viewOnceMessage' | 'viewOnceMessageV2' | 'pollCreationMessage' | 'pollCreationMessageV3'
    };
}