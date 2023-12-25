import makeWASocket, { MessageUpsertType, proto } from '@whiskeysockets/baileys';
import Spinnies from 'spinnies';
import { MESSAGE_TYPE, point } from "../Config";
import { getMessageType, getValueByKey } from "../Function";
import { MessageIntern, MessageReturn, ReplyIntern } from "../Types/event";
import { delKeyFromObject, getKeyByValue } from './../Function/parsing';

type Message = {
    messages: proto.IWebMessageInfo[];
    type: MessageUpsertType;
}

let spins_toggle = new Spinnies({ spinner: point });

let log = console.log;
let logs = (arr) => arr.forEach(x => console.log(x));

let out: MessageReturn[] = []

const Message = (data: Partial<Message>, sock: ReturnType<typeof makeWASocket>, config?: any): MessageReturn | any => {
    // console.log(JSON.stringify(data, null, 2));

    if (!!getValueByKey(data, 'protocolMessage')[0] && !getValueByKey(data, 'editedMessage')[0] || !!getValueByKey(data, 'buttonsMessage')[0] || !!getValueByKey(data, 'messageStubType')[0]) {
        return {} as MessageReturn;
    }

    try {
        data.messages?.forEach((val, i) => {

            let reply = getValueByKey(val, 'quotedMessage')[0]?.quotedMessage;
            let msg = delKeyFromObject(val, 'quotedMessage') || val;

            let
                isGroup = !!getValueByKey(msg, 'remoteJid')[0]?.remoteJid.match('@g.us'),
                isBroadcast = !!getValueByKey(msg, 'broadcast')[0]?.broadcast,
                isEdited = !!getValueByKey(msg, 'editedMessage')[0],
                isReply = !!getValueByKey(val, 'quotedMessage')[0] && Object.keys(getValueByKey(val, 'quotedMessage')[0]?.quotedMessage).length !== 0,
                isForwaded = !getValueByKey(msg, 'quotedMessage')[0] && !!getValueByKey(msg, 'isForwarded')[0],
                isViewOnce = !!getValueByKey(msg, 'viewOnceMessage')[0] || !!getValueByKey(msg, 'viewOnceMessageV2')[0] || !!getValueByKey(msg, 'viewOnceMessageV2Extension')[0],
                isEphemeral = !!getValueByKey(msg, 'ephemeralMessage')[0] || !!getValueByKey(msg, 'ephemeralSettingTimestamp')[0],
                sender = getValueByKey(msg, isGroup ? 'participant' : 'remoteJid')[0]?.[isGroup ? 'participant' : 'remoteJid'],
                isAuthor = !!config.authors?.find(x => `${x}` == sender.split('@')[0]);

            out[i] = {
                id: getValueByKey(val, 'id')[0]?.id,
                remoteJid: getValueByKey(val, 'remoteJid')[0]?.remoteJid,
                fromMe: !!getValueByKey(val, 'fromMe')[0]?.fromMe,
                timestamp: Number(getValueByKey(val, 'messageTimestamp')[0]?.messageTimestamp),
                sender: sender,
                phoneNumber: Number(sender?.split('@')[0]),
                pushName: getValueByKey(val, 'pushName')[0]?.pushName,
                isAuthor: isAuthor,
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
            } as MessageReturn

            let isText = out[i]?.messageType == 'text';

            out[i] = {
                ...out[i],
                message: {
                    text: getValueByKey(msg, 'caption')[0]?.caption || getValueByKey(msg, 'extendedTextMessage')[0]?.extendedTextMessage?.text || getValueByKey(msg, 'conversation')[0]?.conversation,
                } as MessageIntern || {},
                reply: {}
            } as MessageReturn

            if (!isText) {
                let msg = getValueByKey(val, getKeyByValue(out[i]?.messageType))[0]?.[getKeyByValue(out[i]?.messageType)];

                out[i] = {
                    ...out[i],
                    message: {
                        ...out[i]?.message,
                        [out[i]?.messageType as string]: delKeyFromObject(msg, 'contextInfo') || msg,
                    } || {},
                } as MessageReturn
            }

            if (isReply) {
                let
                    context = getValueByKey(val, 'contextInfo')[0]?.contextInfo,
                    key = getMessageType({ [getKeyByValue(getMessageType(context))]: '' }),
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
                        phoneNumber: Number(sender?.split('@')[0]),
                        isForwarded: isForwarded,
                        isViewOnce: isViewOnce,
                        type: key,
                    } as ReplyIntern || {},
                } as MessageReturn

                if (key == 'text') {
                    out[i] = {
                        ...out[i],
                        reply: {
                            ...out[i]?.reply,
                            text: getValueByKey(reply, 'caption')[0]?.caption || getValueByKey(reply, 'extendedTextMessage')[0]?.extendedTextMessage?.text || getValueByKey(reply, 'conversation')[0]?.conversation,
                        } || {},
                    } as MessageReturn
                } else {
                    out[i] = {
                        ...out[i],
                        reply: {
                            ...out[i]?.reply,
                            [key]: getValueByKey(reply, getKeyByValue(getMessageType(reply)))[0]?.[getKeyByValue(getMessageType(reply))],
                        } || {},
                    } as MessageReturn
                }

            }
        })
        // console.log(out.at(-1));

        return out.at(-1) as MessageReturn;

    } catch (error) {
        console.log(error);
        return {}
    }
}

export default Message;