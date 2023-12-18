export type WAConfig = {
    showLog?: boolean;
    authDir?: string;
    browser?: [string, string, string];
    authors?: string[]
}

export type WAEvents = 'ready' | 'connection' | 'error' | 'message'