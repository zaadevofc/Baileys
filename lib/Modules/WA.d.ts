import makeWASocket from '@whiskeysockets/baileys';
import { WAConfig, WAEvents } from '../Types';
export declare class WA {
    showLog?: boolean;
    authDir?: string;
    browser?: [string, string, string];
    authors?: string[];
    sock?: ReturnType<typeof makeWASocket> | any;
    connection?: any;
    constructor({ authDir, showLog, browser }: WAConfig);
    init: (func: any) => Promise<void>;
    on(events: WAEvents, cb: any): void;
    decodeJid: (jid: any) => Promise<any>;
}
