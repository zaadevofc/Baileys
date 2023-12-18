import makeWASocket, { ConnectionState } from "@whiskeysockets/baileys";
import { ConnectionReturn } from "../Types";
declare const Connection: (data: Partial<ConnectionState>, sock: ReturnType<typeof makeWASocket>, cb?: any) => ConnectionReturn;
export default Connection;
