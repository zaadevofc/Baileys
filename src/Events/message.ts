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
        if (!!getValueByKey(val, 'protocolMessage')[0] && !getValueByKey(val, 'editedMessage')[0]) {
            out = {};
            return;
        }

        let reply = getValueByKey(val, 'quotedMessage')[0]?.quotedMessage;
        let msg = delKeyFromObject(val, 'quotedMessage');

        let
            isGroup = !!getValueByKey(msg, 'remoteJid')[0]?.remoteJid.match('@g.us'),
            isBroadcast = !!getValueByKey(msg, 'broadcast')[0]?.broadcast,
            isEdited = !!getValueByKey(msg, 'editedMessage')[0],
            isReply = !!getValueByKey(val, 'quotedMessage')[0],
            isForwaded = !getValueByKey(msg, 'quotedMessage')[0] && !!getValueByKey(msg, 'isForwarded')[0],
            isViewOnce = !!getValueByKey(msg, 'viewOnceMessage')[0] || !!getValueByKey(msg, 'viewOnceMessageV2')[0] || !!getValueByKey(msg, 'viewOnceMessageV2Extension')[0],
            isEphemeral = !!getValueByKey(msg, 'ephemeralMessage')[0] || !!getValueByKey(msg, 'ephemeralSettingTimestamp')[0],
            sender = getValueByKey(msg, isGroup ? 'participant' : 'remoteJid')[0]?.[isGroup ? 'participant' : 'remoteJid'];

        out[i] = {
            id: getValueByKey(val, 'id')[0]?.id,
            remoteJid: getValueByKey(val, 'remoteJid')[0]?.remoteJid,
            fromMe: getValueByKey(val, 'fromMe')[0]?.fromMe,
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

        out[i] = {
            ...out[i],
            message: {
                text: getValueByKey(msg, 'caption')[0]?.caption || getValueByKey(msg, 'extendedTextMessage')[0]?.extendedTextMessage?.text || getValueByKey(msg, 'conversation')[0]?.conversation,
            } || {},
            reply: {}
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
            let
                context = getValueByKey(val, 'contextInfo')[0]?.contextInfo,
                key = getMessageType({ [getKeyByValue(getMessageType(reply))]: '' }),
                id = getValueByKey(context, 'stanzaId')[0]?.stanzaId,
                sender = getValueByKey(context, 'participant')[0]?.participant,
                isForwarded = !!getValueByKey(context, 'isForwarded')[0]?.isForwarded,
                isViewOnce = !!getValueByKey(context, 'viewOnceMessage')[0] || !!getValueByKey(context, 'viewOnceMessageV2')[0] || !!getValueByKey(context, 'viewOnceMessageV2Extension')[0]

            out[i] = {
                ...out[i],
                reply: {
                    id: id,
                    remoteJid: getValueByKey(val, 'remoteJid')[0]?.remoteJid,
                    sender: sender,
                    isForwarded: isForwarded,
                    isViewOnce: isViewOnce,
                    type: key,
                } || {},
            }

            if (key == 'text') {
                out[i] = {
                    ...out[i],
                    reply: {
                        ...out[i].reply,
                        text: getValueByKey(reply, 'caption')[0]?.caption || getValueByKey(reply, 'extendedTextMessage')[0]?.extendedTextMessage?.text || getValueByKey(reply, 'conversation')[0]?.conversation,
                    } || {},
                }
            } else {
                out[i] = {
                    ...out[i],
                    reply: {
                        ...out[i].reply,
                        [key]: getValueByKey(reply, getKeyByValue(getMessageType(reply)))[0]?.[getKeyByValue(getMessageType(reply))],
                    } || {},
                }
            }

        }
    })

    return out;
}

export default Message;