"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WA = void 0;
const baileys_1 = __importStar(require("@whiskeysockets/baileys"));
const ms_1 = __importDefault(require("ms"));
const node_cache_1 = __importDefault(require("node-cache"));
const pino_1 = __importDefault(require("pino"));
const connection_1 = __importDefault(require("../Events/connection"));
const message_1 = __importDefault(require("../Events/message"));
const logger = (0, pino_1.default)({ class: 'zaieys', level: 'fatal' }).child({ level: 'fatal' });
const msgCache = new node_cache_1.default();
class WA {
    constructor({ authDir = 'session', showLog = true, browser = ['Zaieys', 'Safari', '1.0'] }) {
        this.init = async (func) => {
            const store = (0, baileys_1.makeInMemoryStore)({ logger });
            store.readFromFile(`./${this.authDir}/store.json`);
            setInterval(() => { store.writeToFile(`./${this.authDir}/store.json`); }, (0, ms_1.default)('10s'));
            const { state, saveCreds } = await (0, baileys_1.useMultiFileAuthState)(this.authDir);
            const { version, isLatest } = await (0, baileys_1.fetchLatestBaileysVersion)();
            this.sock = (0, baileys_1.default)({
                auth: {
                    creds: state.creds,
                    keys: (0, baileys_1.makeCacheableSignalKeyStore)(state.keys, logger),
                },
                version: version,
                printQRInTerminal: false,
                logger: logger,
                browser: this.browser,
                msgRetryCounterCache: msgCache,
                defaultQueryTimeoutMs: undefined,
                getMessage: async (key) => { var _a; return (_a = (await store.loadMessage((0, baileys_1.jidNormalizedUser)(key.remoteJid), key.id))) === null || _a === void 0 ? void 0 : _a.message; },
            });
            store.bind(this.sock.ev);
            this.sock['za'] = { waVersion: version, waLatest: isLatest, showLog: this.showLog };
            this.sock.ev.on('creds.update', saveCreds);
            this.sock.ev.on('reload', () => func());
            this.sock.ev.on("contacts.update", async (msg) => {
                for (let cntc of msg) {
                    let jid = await this.decodeJid(cntc.id);
                    if (store && store.contacts)
                        store.contacts[jid] = { jid, name: cntc.notify };
                }
            });
            this.sock.ev.on('connection.update', (data) => {
                this.sock.ev.emit('connection', (0, connection_1.default)(data, this.sock));
            });
        };
        this.decodeJid = async (jid) => {
            if (/:\d+@/gi.test(jid)) {
                const decode = (0, baileys_1.jidDecode)(jid) || {};
                return ((decode.user && decode.server && decode.user + "@" + decode.server) || jid).trim();
            }
            else
                return jid.trim();
        };
        this.showLog = showLog;
        this.authDir = authDir;
        this.browser = browser;
    }
    on(events, cb) {
        let sock = this.sock;
        let on = sock.ev.on;
        switch (events) {
            case 'connection':
                on('connection', (data) => (cb)(data));
                break;
            case 'message':
                on('messages.upsert', data => (cb)((0, message_1.default)(data, this.sock)));
                break;
            default:
                break;
        }
    }
}
exports.WA = WA;
