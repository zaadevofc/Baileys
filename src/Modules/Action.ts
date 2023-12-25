import makeWASocket, { AnyMessageContent, jidDecode, makeInMemoryStore } from '@whiskeysockets/baileys';
import fs from 'fs';
import Message from '../Events/message';
import { isObjectNull, newValueByKey, parseMentions } from "../Function";
import { urlToBuffer } from '../Function/utils';
import { MainConfig, SendContactConfig, SendGifConfig, SendLocationConfig, SendReplyConfig, SendTextConfig, SendVideoConfig } from "../Types/action";
import { MessageReturn } from '../Types/event';
import { WAConfig } from '../Types/global';

/**
 * @class Action
 */
export default class Action {
    protected config?: WAConfig;
    protected messages?: any;
    protected sock?: ReturnType<typeof makeWASocket>;
    protected store?: ReturnType<typeof makeInMemoryStore>;

    constructor(private wa: any) {
        this.messages = wa.messages;
        this.sock = wa.sock;
        this.config = wa.config;
        this.store = wa.store;
    }

    private getUtils(options?: any) {
        let config = options as MainConfig;

        let showPreview = config?.showLinkPreview ? true
            : (config?.showLinkPreview == false && this.config?.showLinkPreview) ? false
                : (config?.showLinkPreview == undefined && this.config?.showLinkPreview) ? true
                    : false

        let out = {
            id: config?.remoteJid || this.messages.at(-1).key.remoteJid,
            key: this.messages.at(-1).key,
            quoted: { ...this.messages.at(-1) },
            addConfig: {
                [!showPreview as any && 'linkPreview']: null,
            }
        }

        if (config?.fakeVerified) {
            out.quoted = newValueByKey(out.quoted, [
                { remoteJid: '0@s.whatsapp.net' },
            ])
        }
        return out
    }

    /**
     * send text message.
     * 
     * @param text string
     */
    async sendText(text: string, config?: SendTextConfig) {
        if (!text) return;
        let user = this.getUtils(config);
        await this.sock?.sendMessage(user.id, { text: text, mentions: parseMentions(text), ...user.addConfig, contextInfo: { isForwarded: true, forwardingScore: 9999 } }, { timestamp: new Date() })
    }

    /**
     * send text message with chat reply.
     * 
     * @param text string
     */
    async sendReply(text: string, config?: SendReplyConfig) {
        if (!text) return;
        let user = this.getUtils(config);
        await this.sock?.sendMessage(user.id, { text: text, mentions: parseMentions(text), title: 'haii', footer: 'hahahha', ...user.addConfig, contextInfo: { isForwarded: true, forwardingScore: 9999 } }, { quoted: user.quoted })
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
     * send text message with chat reply.
     * 
     * @param text string
     */
    async sendImage(config: SendVideoConfig) {
        if (!config) return;
        let user = this.getUtils(config);
        let data = config.url ? { image: await urlToBuffer(config.url) }
            : config.path ? { image: fs.readFileSync(config.path) } : { image: config.buffer } as any
        if (!data.image || isObjectNull(data.image)) return;
        await this.sock?.sendMessage(user.id, { ...data, caption: config.text, mentions: parseMentions(config.text), ...user.addConfig })
    }

    /**
     * send text message with chat reply.
     * 
     * @param text string
     */
    async sendGif(config: SendGifConfig) {
        if (!config) return;
        let user = this.getUtils(config);
        let gif = config.url ? { video: await urlToBuffer(config.url) }
            : config.path ? { video: fs.readFileSync(config.path) } : { video: config.buffer } as any
        if (!gif.video || isObjectNull(gif.video)) return;
        await this.sock?.sendMessage(user.id, { ...gif, caption: config.text, gifPlayback: true, mentions: parseMentions(config.text), ...user.addConfig })
    }

    /**
     * send text message with chat reply.
     * 
     * @param text string
     */
    async sendVideo(config: SendVideoConfig) {
        if (!config) return;
        let user = this.getUtils(config);
        let data = config.url ? { video: await urlToBuffer(config.url) }
            : config.path ? { video: fs.readFileSync(config.path) } : { video: config.buffer } as any
        if (!data.video || isObjectNull(data.video)) return;
        await this.sock?.sendMessage(user.id, { ...data, caption: config.text, mentions: parseMentions(config.text), ...user.addConfig })
    }

    /**
     * send text message with chat reply.
     * 
     * @param text string
     */
    async sendAudio(config: SendVideoConfig) {
        if (!config) return;
        let user = this.getUtils(config);
        let data = config.url ? { audio: await urlToBuffer(config.url) }
            : config.path ? { audio: { url: config.path } } : { audio: config.buffer } as any
        if (!data.audio || isObjectNull(data.audio)) return;
        await this.sock?.sendMessage(user.id, { ...data, caption: config.text, ...user.addConfig })
    }

    /**
     * send contact message.
     * 
     * @param config {@link SendContactConfig}
     */
    async sendContact(config: SendContactConfig) {
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
     * send location message.
     * 
     * @param loc string
     */
    async sendLocation(config: SendLocationConfig) {
        if (!config) return;
        let user = this.getUtils(config);
        await this.sock?.sendMessage(user.id, { location: { degreesLatitude: config?.latitude, degreesLongitude: config?.longitude, address: config?.address, name: config?.title, url: config?.url } }, { quoted: config?.isReply && user.quoted })
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
            viewOnce: false,
            // sharePhoneNumber: true,
            buttonText: 'hwehehe',
            force: true,
            disappearingMessagesInChat: 0,
            templateButtons: btn,
            mentions: parseMentions(text)
        }
        await this.sock?.sendMessage(user.id, templateMessage)
    }

    async getMessageById(id: string): Promise<MessageReturn | undefined> {
        if (!id) return;
        let jid = await this.store?.messages;
        let msg: any = []
        for (let key in jid) {
            msg.push(jid[key].array.find(x => x.key.id == id))
        }
        let res = msg.find(x => x != undefined);
        let parse = Message(res, this.sock as any, this.config)
        return parse;
    }

    protected async decodeJid(jid) {
        if (/:\d+@/gi.test(jid)) {
            const decode: any = jidDecode(jid) || {};
            return ((decode.user && decode.server && decode.user + "@" + decode.server) || jid).trim();
        } else return jid.trim();
    };
}