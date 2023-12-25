import { ConnectionReturn, MessageReturn } from "./event";

export type MessageType = 'text' | 'sticker' | 'reaction' | 'audio' | 'video' | 'gif' | 'image' | 'document' | 'contact' | 'product' | 'button' | 'pin' | 'poll' | 'voiceCall' | 'videoCall'

export interface WAConfig {
    /**
     * a log of all incoming chats will appear in the terminal if this is active.
     * 
     * > **default == `true`**
     */
    showLog?: boolean;
    /**
     * the place or name of the folder where the session will be stored in the root of your project.
     * 
     * > **default == `session`**
     */
    authDir?: string;
    /**
     * browser config.
     * 
     * > **default == `["Zaieys", "Chorme", "1.0.0"]`**
     */
    browser?: [string, string, string];
    /**
     * if this is off, the bot will execute messages from itself. I suggest just activating it.
     * 
     * > **default == `true`**
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
     * > **default == `[]`**
     */
    authors?: string[];
    /**
     * this is useful if you use it on servers such as VPS and others. if the running RAM is almost close to RAM capacity, the system will reload and refresh it to prevent overload.
     * 
     * **example :** `500mb` `1gb` `500gb` `2tb` .etc
     * 
     * > **default == `1gb` (gigabytes)**
     */
    ramMaximum?: string | number;
    /**
     * the link sent by the bot will provide a preview of the link if available. However, this possibility will make the bot a **little slow**.
     * 
     * ![yawawe](https://i.ibb.co/hMBQ7d3/a.png)
     * 
     * **]>** kemungkinan jika bot jalan di **lokal server** akan sedikit **lemot**. karna sebelumnya *bot akan mencari data dari link tersebut kemudian menyajikan preview nya*.
     * 
     * **]>** it's possible that if the bot runs on a **local server** it will be a little **slow**. because previously the *bot would search for data from the link then present a preview*.
     * 
     * ***if this is active, all actions from this bot will present a preview link.***
     * 
     * or another option if you want an action to present a preview link, you can do it like this :
       ```js
       await wa.sendText("some text", { showLinkPreview: true })
       ```
     * > **default == `false`**
     */
    showLinkPreview?: boolean;
}

/** WAEvents. */
export type WAEvents = {
    /** connection */
    'connection': ConnectionReturn;
    /** message */
    'message': MessageReturn;
}