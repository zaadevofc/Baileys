import makeWASocket, { fetchLatestBaileysVersion, jidNormalizedUser, makeCacheableSignalKeyStore, makeInMemoryStore, proto, useMultiFileAuthState } from '@whiskeysockets/baileys';
import bytes from 'bytes';
import ms from 'ms';
import NodeCache from 'node-cache';
import pino from 'pino';
import Connection from '../Events/connection';
import Message from '../Events/message';
import { WAConfig, WAEvents } from '../Types/global';
import Action from './Action';

const logger = pino({ class: 'zaieys', level: 'fatal' }).child({ level: 'fatal' });
const msgCache = new NodeCache({ stdTTL: 3 })

/**
 * main class to make connection to whatsapp
 * 
 * see `WA` config constructor **WAConfig**
 * 
 * @interface WAConfig
 * @extends Action action.
 */
export default class WA extends Action {
    // protected showLog?: boolean;
    protected authDir?: string;
    protected ignoreMe?: boolean;
    protected browser?: [string, string, string];
    protected authors?: string[];

    protected sock?: ReturnType<typeof makeWASocket>;
    protected messages?: any;
    protected status?: "close" | "ready" | "loading";

    constructor(config: WAConfig) {
        super({ messages, sock })

        var messages = this.messages;
        var sock = this.sock;

        this.authors = config?.authors || [];
        this.ignoreMe = config?.ignoreMe || true;
        // this.showLog = config?.showLog || true;
        this.authDir = config?.authDir || "session";
        this.browser = config?.browser || ["Zaieys", "Chorme", "1.0.0"];
    }

    /**
     * initial your whatsapp bot, in here function, read docs for more.
     * 
     * @param func fields with your start function.
     */
    async init(func: any): Promise<void> {
        const store = makeInMemoryStore({ logger });
        store.readFromFile(`./${this.authDir}/store.json`)
        setInterval(() => { store.writeToFile(`./${this.authDir}/store.json`) }, ms('10s'))

        const { state, saveCreds } = await useMultiFileAuthState(this.authDir as string)
        const { version, isLatest } = await fetchLatestBaileysVersion()

        this.sock = makeWASocket({
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, logger),
            },
            version: version,
            printQRInTerminal: false,
            logger: logger,
            browser: this.browser,
            msgRetryCounterCache: msgCache,
            defaultQueryTimeoutMs: undefined,
            getMessage: async (key: any) => (await store.loadMessage(jidNormalizedUser(key.remoteJid), key.id))?.message as proto.IMessage,
        });

        store.bind(this.sock.ev)
        this.sock['za'] = { waVersion: version, waLatest: isLatest, hh: async (s) => await this.decodeJid(s) };

        this.sock.ev.on('creds.update', saveCreds);
        this.sock.ev.on('reload' as any, () => func());

        this.sock.ev.on("contacts.update", async (msg) => {
            for (let cntc of msg) {
                let jid: any = await this.decodeJid(cntc.id);
                if (store && store.contacts)
                    store.contacts[jid] = { jid, name: cntc.notify } as any;
            }
        });

        this.sock.ev.on('connection.update', (data) => {
            this.sock?.ev.emit('connection' as any, Connection(data as any, this.sock))
        })

        const autoLoad = setInterval(() => {
            var ram = process.memoryUsage().rss
            if (ram >= bytes('1000mb')) {
                clearInterval(autoLoad);
                this.sock?.ev.emit('reload' as any, true);
            }
        }, ms('5m'))
    }

    /**
     * listen to events and get it callback.
     * 
     * @param events list of events listener [here](s)
     * @param listener send data callback
     */
    on<E extends keyof WAEvents>(events: E, listener: (data: WAEvents[E]) => void) {
        let sock = this.sock;
        let ev = sock?.ev;

        switch (events) {
            case 'connection':
                ev?.on('connection' as any, data => {
                    this.status = data.status;
                    (listener)(data)
                })
                break;

            case 'message':
                ev?.on('messages.upsert', async data => {
                    this.messages = data.messages;
                    let cb = Message(data, this.sock as any, { authors: this.authors });
                    if (this?.ignoreMe && cb?.fromMe) return;
                    console.log({ asasas: await this.decodeJid('62858788977801@s.whatsapp.net') });
                    (listener)(cb)
                })
                break;
            default:
                break;
        }
    }
}
