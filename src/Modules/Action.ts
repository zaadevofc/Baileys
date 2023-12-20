import makeWASocket from "@whiskeysockets/baileys";
import { newValueByKey, parseMentions } from "../Function";

export default class Action {
    messages?: any;
    sock?: ReturnType<typeof makeWASocket>;

    constructor(public wa: any) {
        this.messages = wa.messages;
        this.sock = wa.sock;
    }

    private getUtils = () => {
        let t = {
            id: this.messages.at(-1).key.remoteJid,
            key: this.messages.at(-1).key,
            quoted: this.messages.at(-1)
        }
        t.quoted = newValueByKey(t.quoted, [
            { remoteJid: '0@s.whatsapp.net' },
        ])        

        return t
    }

    sendReply = async (text: any) => {
        let user = this.getUtils();
        await this.sock?.sendMessage(user.id, { text: text, mentions: parseMentions(text) }, { quoted: user.quoted })
    }

    sendText = async (text: any) => {
        let user = this.getUtils();
        await this.sock?.sendMessage(user.id, { text: text, mentions: parseMentions(text) })
    }
}