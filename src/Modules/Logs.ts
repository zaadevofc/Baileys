import makeWASocket from "@whiskeysockets/baileys";
import color from 'colors-cli';
import { isObjectNull } from "../Function";
import { WAConfig } from "../Types/global";
import { MessageReturn } from './../Types/event';

let log = console.log;
let logs = (arr) => arr.forEach(x => x !== undefined && console.log(x));

const colorMsg = (type: string | undefined, text: string | undefined) => {
    const msg = type !== 'text' ? color.magenta_bt(type || '') + ' >' : '';
    return `${msg}${msg && ' '}${color.yellow(text || '')}`;
}

const Logs = (sock: ReturnType<typeof makeWASocket>, config?: WAConfig) => {
    if (!config?.showLog) return;

    sock.ev.on('logs' as any, ({ events, data }) => {
        if (isObjectNull(data)) return;

        switch (events) {
            case 'message':
                let out = data as MessageReturn;
                logs([
                    color.yellow(`▪ ${color.cyan(events?.toUpperCase())} ~ ${color.cyan(out.isGroup ? 'GROUP' : 'PRIVATE')} ~ ${color.cyan(out.sender?.split('@')[0])} ~ ${color.cyan(out.pushName)}`),
                    // color.yellow('|'),
                    color.yellow(`┕> ${color.red_bt(out.timestamp)} > ${colorMsg(out.messageType, out.message?.text)}`) || '',
                    ''
                ])
                break;

            default:
                break;
        }
    })

}

export default Logs