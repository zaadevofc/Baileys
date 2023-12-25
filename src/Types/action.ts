export type MainConfig = DefaultConfig & SendReplyConfig & SendLocationConfig & SendContactConfig & SendTextConfig

export type DefaultConfig = {
    remoteJid?: string;
}

export type AdditionalConfig = {
    /**
     * this will make the reply look verified.
     * 
     * _**but this only works on smartphones, it doesn't work like for example wa web or wa desktop**_
     * 
     * looks like this :
     * 
     * ![nyenggol zharif?](https://i.ibb.co/9ZshsLn/image-1-2.png)
     */
    fakeVerified?: boolean
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
    showLinkPreview?: boolean | null;
    isReply?: boolean
}

export type SendReplyConfig = Omit<AdditionalConfig, 'isReply'> & DefaultConfig
export type SendTextConfig = Pick<AdditionalConfig, 'showLinkPreview'> & DefaultConfig

export type SendLocationConfig = {
    latitude: number;
    longitude: number;
    title?: string;
    address?: string;
    url?: string;
} & Omit<AdditionalConfig, 'showLinkPreview'> & DefaultConfig

export type SendContactConfig = {
    name?: string;
    email?: string;
    website?: string | URL;
    organization?: string;
    homeNumber?: string;
    workNumber?: string;
    homeAddress?: string;
    workAddress?: string;
    vcard?: string;
} & Omit<AdditionalConfig, 'showLinkPreview'> & DefaultConfig

export type SendGifConfig = {
    url?: string | URL;
    path?: string;
    buffer?: Buffer;
    text?: string;
} & AdditionalConfig & DefaultConfig

export type SendVideoConfig = {
    url?: string | URL;
    path?: string;
    buffer?: Buffer;
    text?: string;
} & AdditionalConfig & DefaultConfig