import { ConnectionReturn, MessageReturn } from "./event";

export type MessageType = 'text' | 'sticker' | 'reaction' | 'audio' | 'video' | 'gif' | 'image' | 'document' | 'contact' | 'product' | 'button' | 'pin' | 'poll' | 'voiceCall' | 'videoCall'

export interface WAConfig {
    /**
     * a log of all incoming chats will appear in the terminal if this is active.
     * 
     * default == `true`
     */
    // showLog?: boolean;
    /**
     * the place or name of the folder where the session will be stored in the root of your project.
     * 
     * default == `session`
     */
    authDir?: string;
    /**
     * browser config.
     * 
     * default == `["Zaieys", "Chorme", "1.0.0"]`
     */
    browser?: [string, string, string];
    /**
     * if this is off, the bot will execute messages from itself. I suggest just activating it.
     * 
     * default == `true`
     */
    ignoreMe?: boolean;
    /**
     * If this is filled in, the bot can automatically detect if a message is sent from an author.
     * 
     * **example to fill it in :** `["628x", 628x, ...]`
     * 
     * it will look like this :
     ```json
     {
        "isAuthor": true
     }
     ```
     * 
     * default == `[]`
     */
    authors?: string[];
    /**
     * this is useful if you use it on servers such as VPS and others. if the running RAM is almost close to RAM capacity, the system will reload and refresh it to prevent overload.
     * 
     * **example :** `5m` `1h` `600000` .etc
     * 
     * i convert various time formats to milliseconds with this [ms](https://github.com/vercel/ms) library.
     */
    ramMaximum?: string | number;
}

/**
 * WAEvents.
 */
export type WAEvents = {
    'connection': ConnectionReturn;
    'message': MessageReturn;
    'test': any;
}