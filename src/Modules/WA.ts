import makeWASocket, { fetchLatestBaileysVersion, jidDecode, jidNormalizedUser, makeCacheableSignalKeyStore, makeInMemoryStore, proto, useMultiFileAuthState } from '@whiskeysockets/baileys';
import ms from 'ms';
import NodeCache from 'node-cache';
import pino from 'pino';
import Connection from '../Events/connection';
import Message from '../Events/message';
import { WAConfig, WAEvents } from '../Types';
import { ConnectionReturn } from './../Types/event';

const logger = pino({ class: 'zaieys', level: 'fatal' }).child({ level: 'fatal' });
const msgCache = new NodeCache()

export class WA {
    showLog?: boolean;
    authDir?: string;
    browser?: [string, string, string];
    authors?: string[];

    /**
     * @internal
     */
    sock?: ReturnType<typeof makeWASocket>;
    
    connection?: any;

    constructor({
        authDir = 'session',
        showLog = true,
        browser = ['Zaieys', 'Safari', '1.0']
    }: WAConfig) {
        this.showLog = showLog;
        this.authDir = authDir;
        this.browser = browser;
    }

    init = async (func: any) => {
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

        this.sock['za'] = { waVersion: version, waLatest: isLatest, showLog: this.showLog };
        this.sock.ev.on('creds.update', saveCreds);
        this.sock.ev.on('reload' as any, () => func())

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
    }

    on(events: WAEvents, cb: any) {
        let sock = this.sock;
        let ev = sock?.ev;
        
        switch (events) {
            case 'connection':
                ev?.on('connection' as any, (data: ConnectionReturn) => (cb)(data as ConnectionReturn))
                break;
            case 'message':
                ev?.on('messages.upsert', data => (cb)(Message(data, this.sock as any)))
                break;
            case 'tes':
                ev?.on('messages' as any, data => (cb)(data))
                break;
            default:
                break;
        }
    }

    decodeJid = async (jid) => {
        if (/:\d+@/gi.test(jid)) {
            const decode: any = jidDecode(jid) || {};
            return ((decode.user && decode.server && decode.user + "@" + decode.server) || jid).trim();
        } else return jid.trim();
    };
}
