import makeWASocket, { fetchLatestBaileysVersion, jidNormalizedUser, makeCacheableSignalKeyStore, makeInMemoryStore, proto, useMultiFileAuthState } from '@whiskeysockets/baileys';
import bytes from 'bytes';
import ms from 'ms';
import NodeCache from 'node-cache';
import pino from 'pino';
import Connection from '../Events/connection';
import Message from '../Events/message';
import { isObjectNull } from '../Function';
import { WAConfig, WAEvents } from '../Types/global';
import Action from './Action';
import Logs from './Logs';

const logger = pino({ level: 'fatal' }).child({ level: 'fatal' });
const msgCache = new NodeCache({ stdTTL: 0 })

/**
 * [![zaieys](https://img.shields.io/badge/baileys-alternative-blue)](https://github.com/zaadevofc/Baileys)
 * [![zaieys](https://img.shields.io/badge/zaadevofc-zaieys-red)](https://github.com/zaadevofc/Baileys)

 * **Zaieys** is a WhatsApp API library that focuses on user convenience and efficiency. This library is only a modification of the [baileys](https://github.com/WhiskeySockets/Baileys) library. 

 * Where is the **Zaieys** library to make it easier to create WhatsApp bots. I really look forward to suggestions and input from all of you, thank you for using✨
 * 
 * If you have any complaints or questions, please submit them on the github issue [here](https://github.com/zaadevofc/Baileys/issues) or discussion [here](https://github.com/zaadevofc/Baileys/discussions), that will also help everyone.
 */
export default class WA extends Action {
    /**
     * a log of all incoming chats will appear in the terminal if this is active.
     * 
     * > **default == `true`**
     */
    showLog?: boolean;
    /**
     * the place or name of the folder where the session will be stored in the root of your project.
     * 
     * > **default == `session`**
     */
    authDir?: string;
    /**
     * browser config.
     * 
     * > **default == `["Zaieys", "Chorme", "1.0.0"]`**
     */
    browser?: [string, string, string];
    /**
     * if this is off, the bot will execute messages from itself. I suggest just activating it.
     * 
     * > **default == `true`**
     */
    ignoreMe?: boolean;
    /**
     * If this is filled in, the bot can automatically detect if a message is sent from an author.
     * 
     * **example to fill it in :** `["628x", 628x, ...]`
     * 
     * it will look like this :
     ```json
     {
        "isAuthor": true
     }
     ```
     * 
     * > **default == `[]`**
     */
    authors?: string[];
    /**
     * this is useful if you use it on servers such as VPS and others. if the running RAM is almost close to RAM capacity, the system will reload and refresh it to prevent overload.
     * 
     * **example :** `500mb` `1gb` `500gb` `2tb` .etc
     * 
     * > **default == `1gb` (gigabytes)**
     */
    ramMaximum?: string | number;
    /**
     * the link sent by the bot will provide a preview of the link if available. However, this possibility will make the bot a **little slow**.
     * 
     * ![yawawe](https://i.ibb.co/hMBQ7d3/a.png)
     * 
     * **]>** kemungkinan jika bot jalan di **lokal server** akan sedikit **lemot**. karna sebelumnya *bot akan mencari data dari link tersebut kemudian menyajikan preview nya*.
     * 
     * **]>** it's possible that if the bot runs on a **local server** it will be a little **slow**. because previously the *bot would search for data from the link then present a preview*.
     * 
     * ***if this is active, all actions from this bot will present a preview link.***
     * 
     * or another option if you want an action to present a preview link, you can do it like this :
       ```js
       await wa.sendText("some text", { showLinkPreview: true })
       ```
     * > **default == `false`**
     */
    showLinkPreview?: boolean;

    protected sock?: ReturnType<typeof makeWASocket>;
    protected store?: ReturnType<typeof makeInMemoryStore>;
    protected messages?: any;
    protected status?: "close" | "ready" | "loading";

    constructor(config: WAConfig) {
        super({ messages, sock, config, store })

        var messages = this.messages;
        var sock = this.sock;
        var store = this.store;

        this.ramMaximum = config?.ramMaximum || '1gb';
        this.authors = config?.authors || [];
        this.ignoreMe = config?.ignoreMe ? true : config?.ignoreMe;
        this.showLinkPreview = config?.showLinkPreview ? false : config?.showLinkPreview;
        this.showLog = config?.showLog ? true : config?.showLog;
        this.authDir = config?.authDir || "session";
        this.browser = config?.browser || ["Zaieys", "Chorme", "1.0.0"];
    }

    /**
     * initial your whatsapp bot, in here function, read docs for more.
     * 
     * @param func fields with your start function.
     */
    async init(func: any): Promise<void> {
        const store = makeInMemoryStore({ logger } as any);
        store.readFromFile(`./${this.authDir}/store.json`)
        setInterval(() => { store.writeToFile(`./${this.authDir}/store.json`) }, ms('10s'))

        const { state, saveCreds } = await useMultiFileAuthState(this.authDir as string)
        const { version, isLatest } = await fetchLatestBaileysVersion()

        this.sock = makeWASocket({
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, logger as any),
            },
            version: version,
            printQRInTerminal: false,
            logger: logger as any,
            browser: this.browser,
            defaultQueryTimeoutMs: undefined,
            generateHighQualityLinkPreview: false,
            linkPreviewImageThumbnailWidth: 500,
            msgRetryCounterCache: msgCache,
            // mediaCache: msgCache,
            userDevicesCache: msgCache,
            getMessage: async (key: any) => (await store.loadMessage(jidNormalizedUser(key.remoteJid), key.id))?.message as proto.IMessage,
        });

        Logs(this.sock, { showLog: this.showLog })
        store.bind(this.sock.ev)
        this.sock['za'] = { waVersion: version, waLatest: isLatest, hh: async (s) => await this.decodeJid(s) };

        this.sock.ev.on('creds.update', saveCreds);
        this.sock.ev.on('reload' as any, async () => await func());

        this.sock.ev.on("contacts.update", async (msg) => {
            for (let cntc of msg) {
                let jid: any = await this.decodeJid(cntc.id);
                if (store && store.contacts)
                    store.contacts[jid] = { jid, name: cntc.notify } as any;
            }
        });

        this.store = store;

        this.sock.ev.on('connection.update', (data) => {
            // console.log({msgCache: msgCache.get('kejaa')});

            this.sock?.ev.emit('connection' as any, Connection(data as any, this.sock))
        })

        const autoLoad = setInterval(() => {
            var ram = process.memoryUsage().rss
            if (ram >= bytes(this.ramMaximum)) {
                clearInterval(autoLoad);
                this.sock?.ev.emit('reload' as any, true);
            }
        }, ms('2m'))

    }

    /**
     * listen to events and get it callback.
     * 
     * @param events list of events listener {@link WAEvents}
     * @param listener send data callback `void`
     */
    on<E extends keyof WAEvents>(events: E, listener: (data: WAEvents[E]) => void) {
        let sock = this.sock;
        let ev = sock?.ev;

        switch (events) {
            case 'connection':
                ev?.on('connection' as any, async data => {
                    this.status = data.status;
                    (listener)(data)
                })
                break;

            case 'message':
                ev?.on('messages.upsert', async data => {
                    this.messages = data.messages;
                    let cb = Message(data, this.sock as any, { authors: this.authors });
                    if (isObjectNull(cb)) return;
                    if (this?.ignoreMe && cb?.fromMe) return;
                    this.sock?.ev.emit('logs' as any, { events: 'message', data: cb });

                    console.log({
                        data: await msgCache.data
                    });
                    

                    (listener)(cb)
                })
                break;
            default:
                break;
        }
    }
}
