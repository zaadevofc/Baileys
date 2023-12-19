export type WAConfig = {
    showLog?: boolean;
    /**
     * Tempat atau nama folder dimana session itu akan di simpan pada root project.
     * 
     * The place or name of the folder where the session will be stored in the root of your project.
     * 
     * default == `session`
     */
    authDir?: string;
    browser?: [string, string, string];
    authors?: string[]
}

export type WAEvents = 'ready' | 'connection' | 'error' | 'message' | 'tes'