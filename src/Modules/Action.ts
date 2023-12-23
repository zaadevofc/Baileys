import makeWASocket, { AnyMessageContent, jidDecode } from "@whiskeysockets/baileys";
import { newValueByKey, parseMentions } from "../Function";
import { DefaultConfig, MainConfig, SendContactConfig, SendLocationConfig, SendReplyConfig } from "../Types/action";

/**
 * @class Action
 */
export default class Action {
    protected messages?: any;
    protected sock?: ReturnType<typeof makeWASocket>;

    constructor(private wa: any) {
        this.messages = wa.messages;
        this.sock = wa.sock;
    }

    private getUtils(config?: MainConfig) {
        let out = {
            id: config?.remoteJid || this.messages.at(-1).key.remoteJid,
            key: this.messages.at(-1).key,
            quoted: this.messages.at(-1)
        }

        if (config?.fakeVerified) {
            out.quoted = newValueByKey(out.quoted, [
                { remoteJid: '0@s.whatsapp.net' }
            ])
        }

        return out
    }

    /**
     * send text message with chat reply.
     * 
     * @param text string
     */
    async sendReply(text: string, config?: SendReplyConfig) {
        if (!text) return;
        let user = this.getUtils(config);
        await this.sock?.sendMessage(user.id, { text: text, mentions: parseMentions(text) }, { quoted: user.quoted })
    }

    /**
     * send text message.
     * 
     * @param text string
     */
    async sendText(text: string, config?: DefaultConfig) {
        if (!text) return;
        let user = this.getUtils(config);
        await this.sock?.sendMessage(user.id, { text: text, mentions: parseMentions(text) })
    }

    /**
     * send reaction message. for now is just latest message. i will update it soon~
     * 
     * @param emoji string
     */
    async sendReaction(emoji: string) {
        if (!emoji) return;
        let user = this.getUtils();
        await this.sock?.sendMessage(user.id, { react: { text: emoji, key: user.key } })
    }

    /**
     * send location message.
     * 
     * @param loc string
     */
    async sendLocation(config?: SendLocationConfig) {
        if (!config) return;
        let user = this.getUtils(config);
        await this.sock?.sendMessage(user.id, { location: { degreesLatitude: config?.latitude, degreesLongitude: config?.longitude, address: config?.address, name: config?.title, url: config?.url } }, { quoted: config?.isReply && user.quoted })
    }

    /**
     * send contact message.
     * 
     * @param config {@link SendContactConfig}
     */
    async sendContact(config?: SendContactConfig) {
        if (!config) return;
        let user = this.getUtils(config);
        const v = [
            `BEGIN:VCARD`,
            `VERSION:3.0`,
            `N:${config?.name}`,
            `FN:${config?.name}`,
            `EMAIL:${config?.email}`,
            `TITLE:${config?.name}`,
            `ORG:${config?.name}`,
            `URL;TYPE=home:${config?.website}`,
            `TEL;TYPE=WORK,VOICE:${config?.workNumber}`,
            `TEL;TYPE=HOME,VOICE:${config?.homeNumber}`,
            `ADR;TYPE=WORK:${config?.workAddress}`,
            `ADR;TYPE=HOME:${config?.homeAddress}`,
            `END:VCARD`
        ].join('\n');

        await this.sock?.sendMessage(user.id, { contacts: { contacts: [{ vcard: v }] } })
    }

    /**
     * > **❗ WARNING** **❗ WARNING** **❗ WARNING** **❗ WARNING ❗**
     * 
     * _this is a beta feature, only works on WhatsApp Desktop,_
     * _i suggest you use it if I have updated this lib._
     */
    protected async sendButton(emoji: any) {
        let user = this.getUtils();
        let btn: any = []
        for (let i = 0; i < 2; i++) {
            btn.push({
                index: i,
                quickReplyButton: { displayText: `ini button ke ${i + 1}`, url: 'https://github.com/adiwajshing/Baileys' }
            })
        }
        let text = "Hi it's a template message"
        const templateMessage: AnyMessageContent = {
            text: text,
            footer: 'Hello World',
            viewOnce: true,
            templateButtons: btn,
            contextInfo: {
                mentionedJid: parseMentions(text)
            }
        }
        await this.sock?.sendMessage(user.id, templateMessage)
    }

    protected async decodeJid(jid) {
        if (/:\d+@/gi.test(jid)) {
            const decode: any = jidDecode(jid) || {};
            return ((decode.user && decode.server && decode.user + "@" + decode.server) || jid).trim();
        } else return jid.trim();
    };
}