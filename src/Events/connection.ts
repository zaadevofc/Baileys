import { Boom } from "@hapi/boom";
import makeWASocket, { ConnectionState, DisconnectReason } from "@whiskeysockets/baileys";
import cfonts from 'cfonts';
import color from 'colors-cli';
import { readFileSync } from 'fs';
import { join } from 'path';
import qrc from 'qrcode';
import Spinnies from 'spinnies';
import { point } from "../Config";
import { ConnectionReturn } from "../Types/event";

const pkg = JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf-8'));
let spins_toggle = new Spinnies({ spinner: point });

let log = console.log;
let logs = (arr) => arr.forEach(x => x !== undefined && console.log(x));

let out: ConnectionReturn = {}

const Connection = (data: ConnectionState, sock: ReturnType<typeof makeWASocket>, cb?: any): ConnectionReturn => {
    out.status = 'loading';
    console.clear()
    spins_toggle.add('z-connect', { text: 'Waiting bot connection...' })

    cfonts.say('ZAIEYS', {
        font: 'block',
        align: 'left',
        colors: ['redBright', 'yellow']
    });

    logs([
        color.blue_b('@zaadevofc/baileys'),
        '',
        color.yellow(`🔹 library    : ${color.cyan('zaieys')}`),
        color.yellow(`🔹 version    : ${color.cyan(pkg.version)}`),
        color.yellow(`🔹 license    : ${color.cyan(pkg.license)}`)
    ]);

    log('')

    const { connection: c, lastDisconnect: l, qr } = data;

    if (!l && qr) {
        qrc.toString(qr, { type: 'terminal', small: true }, (err, res) => log(res))
        spins_toggle.add('z-qr', { text: 'Scan the qr to your WhatsApp...' })
    }

    if (c == 'close') {
        out.status = 'close';
        spins_toggle.stopAll('fail');
        let reason = new Boom(l?.error)?.output.statusCode;
        switch (reason) {
            case DisconnectReason.badSession:
                logs([color.red(`✖ Bad Session File, Please Delete Session and Scan Again.`)]);
                sock.logout();
                break;
            case DisconnectReason.connectionClosed:
                logs([color.red("✖ Connection closed, reconnecting...")]);
                sock.ev.emit('reload' as any, true);
                break;
            case DisconnectReason.connectionLost:
                logs([color.yellow("⚠️ Connection Lost from Server, reconnecting...")]);
                sock.ev.emit('reload' as any, true);
                break;
            case DisconnectReason.connectionReplaced:
                logs([color.yellow("⚠️ Connection Replaced, Another New Session Opened, reconnecting...")]);
                sock.ev.emit('reload' as any, true);
                break;
            case DisconnectReason.loggedOut:
                logs([color.red(`✖ Device Logged Out, Please Delete Session and Scan Again.`)]);
                sock.logout();
                break;
            case DisconnectReason.restartRequired:
                logs([color.yellow("⚠️ Restart Required, Restarting...")]);
                sock.ev.emit('reload' as any, true);
                break;
            case DisconnectReason.timedOut:
                logs([color.yellow("⚠️ Connection TimedOut, Reconnecting...")]);
                sock.ev.emit('reload' as any, true);
                break;
            case DisconnectReason.multideviceMismatch:
                logs([color.red("✖ Multi device mismatch, please scan again.")]);
                sock.logout();
                break;
            default:
                sock.end(`✖ ${color.red('Unknown DisconnectReason:')} ${reason}|${color.cyan_bt(c)}` as any)
                break;
        }
    } else if (c == 'open' || data.receivedPendingNotifications) {
        out.status = 'ready';
        out.loginId = Number(sock?.user?.id.split(':')[0]);
        out.loginName = sock?.user?.name;
        out.waVersion = sock['za']['waVersion'];
        out.waLatest = sock['za']['waLatest'];

        logs([
            color.yellow(`🔸 Login ID   : ${color.cyan(out.loginId as any)}`),
            out.loginName && color.yellow(`🔸 Login Name : ${color.cyan(out.loginName)}`),
            color.yellow(`🔸 Wa Version : ${color.cyan(out.waVersion)}`),
            color.yellow(`🔸 Wa Latest  : ${color.cyan(out.waLatest ? 'yes' : 'no')}`)
        ]);
        log('')        
        spins_toggle.succeed('z-connect', { text: `${color.magenta_bt(sock?.user?.name || sock?.user?.verifiedName || out.loginId)} ready to use`, succeedPrefix: '✅' })
        log('')
    }

    return out
}

export default Connection;