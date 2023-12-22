export type MainConfig = DefaultConfig & SendReplyConfig

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
    isReply?: boolean
}

export type SendReplyConfig = {
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
} & DefaultConfig

export type SendLocationConfig = {
    latitude: number;
    longitude: number;
    title?: string;
    address?: string;
    url?: string;
} & AdditionalConfig & DefaultConfig

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
} & AdditionalConfig & DefaultConfig