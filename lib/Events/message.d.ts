import makeWASocket, { MessageUpsertType, proto } from "@whiskeysockets/baileys";
type Message = {
    messages: proto.IWebMessageInfo[];
    type: MessageUpsertType;
};
declare const Message: (data: Partial<Message>, sock: ReturnType<typeof makeWASocket>, cb?: any) => void;
export default Message;
