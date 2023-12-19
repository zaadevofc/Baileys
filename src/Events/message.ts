import makeWASocket, { MessageUpsertType, proto } from "@whiskeysockets/baileys";
import Spinnies from 'spinnies';
import { MESSAGE_TYPE, point } from "../Config";
import { getMessageType, getValueByKey } from "../Function";
import { MessageReturn } from "../Types";
import { delKeyFromObject, getKeyByValue } from './../Function/parsing';

type Message = {
    messages: proto.IWebMessageInfo[];
    type: MessageUpsertType;
}

let spins_toggle = new Spinnies({ spinner: point });

let log = console.log;
let logs = (arr) => arr.forEach(x => console.log(x));

let out: Partial<MessageReturn[]> | any = []

const Message = (data: Partial<Message>, sock: ReturnType<typeof makeWASocket>, cb?: any): Partial<MessageReturn[]> | null => {
    log('')
    log(JSON.stringify(data, null, 2))
    log('')


    data.messages?.forEach((val, i) => {
        if (!!getValueByKey(val, 'protocolMessage')[0]) {
            out = {};
            return;
        }

        let
            isGroup = !!getValueByKey(val, 'remoteJid')[0]?.remoteJid.match('@g.us'),
            isBroadcast = !!getValueByKey(val, 'broadcast')[0]?.broadcast,
            isEdited = !!getValueByKey(val, 'editedMessage')[0],
            isReply = !!getValueByKey(val, 'quotedMessage')[0],
            isForwaded = !getValueByKey(val, 'quotedMessage')[0] && !!getValueByKey(val, 'isForwarded')[0],
            isViewOnce = !!getValueByKey(val, 'viewOnceMessage')[0] || !!getValueByKey(val, 'viewOnceMessageV2')[0] || !!getValueByKey(val, 'viewOnceMessageV2Extension')[0],
            isEphemeral = !!getValueByKey(val, 'ephemeralMessage')[0],
            sender = getValueByKey(val, isGroup ? 'participant' : 'remoteJid')[0]?.[isGroup ? 'participant' : 'remoteJid'];

        out[i] = {
            id: getValueByKey(val, 'id')[0]?.id,
            remoteJid: getValueByKey(val, 'remoteJid')[0]?.remoteJid,
            timestamp: Number(getValueByKey(val, 'messageTimestamp')[0]?.messageTimestamp),
            sender: sender,
            pushName: getValueByKey(val, 'pushName')[0]?.pushName,
            isBroadcast: isBroadcast,
            isGroup: isGroup,
            isEdited: isEdited,
            isForwaded: isForwaded,
            isViewOnce: isViewOnce,
            isReply: isReply,
            isEphemeral: isEphemeral,
            senderMentions: getValueByKey(val, 'mentionedJid')[0]?.mentionedJid || [],
            groupMentions: getValueByKey(val, 'groupMentions')[0]?.groupMentions || [],
            messageType: getMessageType(val) || MESSAGE_TYPE[getValueByKey(val, 'messageStubType')[0]?.messageStubType],
        }

        let isText = out[i].messageType == 'text';
        let reply = getValueByKey(val, 'quotedMessage')[0]?.quotedMessage;
        let msg = delKeyFromObject(val, 'quotedMessage');

        out[i] = {
            ...out[i],
            message: {
                text: getValueByKey(msg, 'caption')[0]?.caption || getValueByKey(msg, 'extendedTextMessage')[0]?.extendedTextMessage?.text || getValueByKey(msg, 'conversation')[0]?.conversation,
            } || {},
            reply: {
                text: getValueByKey(reply, 'caption')[0]?.caption || getValueByKey(reply, 'extendedTextMessage')[0]?.extendedTextMessage?.text || getValueByKey(reply, 'conversation')[0]?.conversation,
            } || {},
        }

        if (!isText) {
            let msg = getValueByKey(val, getKeyByValue(out[i].messageType))[0]?.[getKeyByValue(out[i].messageType)];

            out[i] = {
                ...out[i],
                message: {
                    ...out[i].message,
                    [out[i].messageType]: delKeyFromObject(msg, 'contextInfo'),
                } || {},
            }
        }

        if (isReply) {
            let key = getMessageType({[getKeyByValue(getMessageType(reply))]: ''});
            
            out[i] = {
                ...out[i],
                reply: {
                    ...out[i].reply,
                    [key]: getValueByKey(reply, getKeyByValue(getMessageType(reply)))[0]?.[getKeyByValue(getMessageType(reply))],
                } || {},
            }
        }
    })

    return out;
}

export default Message;