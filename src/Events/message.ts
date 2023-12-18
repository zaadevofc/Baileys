import makeWASocket, { MessageUpsertType, proto } from "@whiskeysockets/baileys";
import Spinnies from 'spinnies';
import { point } from "../Config";

type Message = {
    messages: proto.IWebMessageInfo[];
    type: MessageUpsertType;
}

let spins_toggle = new Spinnies({ spinner: point });

let log = console.log;
let logs = (arr) => arr.forEach(x => console.log(x));

const Message = (data: Partial<Message>, sock: ReturnType<typeof makeWASocket>, cb?: any) => {
    log(JSON.stringify(data.messages && data.messages[0], null, 2))
}
export default Message;