export type MainConfig = DefaultConfig & SendReplyConfig

export type DefaultConfig = {
    remoteJid?: string;
}

export type AdditionalConfig = {
    /**
     * is just make reply look verified
     */
    fakeVerified?: boolean
    isReply?: boolean
}

export type SendReplyConfig = {
    /**
     * is just make reply look verified
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