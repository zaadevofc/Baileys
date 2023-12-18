"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const boom_1 = require("@hapi/boom");
const baileys_1 = require("@whiskeysockets/baileys");
const cfonts_1 = __importDefault(require("cfonts"));
const colors_cli_1 = __importDefault(require("colors-cli"));
const fs_1 = require("fs");
const path_1 = require("path");
const qrcode_1 = __importDefault(require("qrcode"));
const spinnies_1 = __importDefault(require("spinnies"));
const Config_1 = require("../Config");
const pkg = JSON.parse((0, fs_1.readFileSync)((0, path_1.join)(__dirname, '../../package.json'), 'utf-8'));
let spins_toggle = new spinnies_1.default({ spinner: Config_1.point });
let log = console.log;
let logs = (arr) => arr.forEach(x => console.log(x));
let out = {};
const Connection = (data, sock, cb) => {
    var _a, _b, _c, _d;
    out.status = 'loading';
    console.clear();
    spins_toggle.add('z-connect', { text: 'Waiting bot connection...' });
    cfonts_1.default.say('ZAIEYS', {
        font: 'block',
        align: 'left',
        colors: ['redBright', 'yellow']
    });
    logs([
        colors_cli_1.default.blue_b('@zaadevofc/baileys'),
        '',
        colors_cli_1.default.yellow(`🔹 library    : ${colors_cli_1.default.cyan('zaieys')}`),
        colors_cli_1.default.yellow(`🔹 version    : ${colors_cli_1.default.cyan(pkg.version)}`),
        colors_cli_1.default.yellow(`🔹 license    : ${colors_cli_1.default.cyan(pkg.license)}`)
    ]);
    log('');
    const { connection: c, lastDisconnect: l, qr } = data;
    if (!l && qr) {
        qrcode_1.default.toString(qr, { type: 'terminal', small: true }, (err, res) => log(res));
        spins_toggle.add('z-qr', { text: 'Scan the qr to your WhatsApp...' });
    }
    if (c == 'close') {
        out.status = 'close';
        spins_toggle.stopAll('fail');
        let reason = (_a = new boom_1.Boom(l === null || l === void 0 ? void 0 : l.error)) === null || _a === void 0 ? void 0 : _a.output.statusCode;
        switch (reason) {
            case baileys_1.DisconnectReason.badSession:
                logs([colors_cli_1.default.red(`✖ Bad Session File, Please Delete Session and Scan Again.`)]);
                sock.logout();
                break;
            case baileys_1.DisconnectReason.connectionClosed:
                logs([colors_cli_1.default.red("✖ Connection closed, reconnecting...")]);
                sock.ev.emit('reload', true);
                break;
            case baileys_1.DisconnectReason.connectionLost:
                logs([colors_cli_1.default.yellow("⚠️ Connection Lost from Server, reconnecting...")]);
                sock.ev.emit('reload', true);
                break;
            case baileys_1.DisconnectReason.connectionReplaced:
                logs([colors_cli_1.default.yellow("⚠️ Connection Replaced, Another New Session Opened, reconnecting...")]);
                sock.ev.emit('reload', true);
                break;
            case baileys_1.DisconnectReason.loggedOut:
                logs([colors_cli_1.default.red(`✖ Device Logged Out, Please Delete Session and Scan Again.`)]);
                sock.logout();
                break;
            case baileys_1.DisconnectReason.restartRequired:
                logs([colors_cli_1.default.yellow("⚠️ Restart Required, Restarting...")]);
                sock.ev.emit('reload', true);
                break;
            case baileys_1.DisconnectReason.timedOut:
                logs([colors_cli_1.default.yellow("⚠️ Connection TimedOut, Reconnecting...")]);
                sock.ev.emit('reload', true);
                break;
            case baileys_1.DisconnectReason.multideviceMismatch:
                logs([colors_cli_1.default.red("✖ Multi device mismatch, please scan again.")]);
                sock.logout();
                break;
            default:
                sock.end(`✖ ${colors_cli_1.default.red('Unknown DisconnectReason:')} ${reason}|${colors_cli_1.default.cyan_bt(c)}`);
                break;
        }
    }
    else if (c == 'open' || data.receivedPendingNotifications) {
        out.status = 'ready';
        out.loginId = Number((_b = sock === null || sock === void 0 ? void 0 : sock.user) === null || _b === void 0 ? void 0 : _b.id.split(':')[0]);
        out.loginName = (_c = sock === null || sock === void 0 ? void 0 : sock.user) === null || _c === void 0 ? void 0 : _c.name;
        out.waVersion = sock['za']['waVersion'];
        out.waLatest = sock['za']['waLatest'];
        logs([
            colors_cli_1.default.yellow(`🔸 Login ID   : ${colors_cli_1.default.cyan(out.loginId)}`),
            colors_cli_1.default.yellow(`🔸 Login Name : ${colors_cli_1.default.cyan(out.loginName)}`),
            colors_cli_1.default.yellow(`🔸 Wa Version : ${colors_cli_1.default.cyan(out.waVersion)}`),
            colors_cli_1.default.yellow(`🔸 Wa Latest  : ${colors_cli_1.default.cyan(out.waLatest ? 'yes' : 'no')}`)
        ]);
        log('');
        spins_toggle.succeed('z-connect', { text: `${colors_cli_1.default.magenta_bt((_d = sock === null || sock === void 0 ? void 0 : sock.user) === null || _d === void 0 ? void 0 : _d.name)} ready to use`, succeedPrefix: '✅' });
        log('');
    }
    return out;
};
exports.default = Connection;
