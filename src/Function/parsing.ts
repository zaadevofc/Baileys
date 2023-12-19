import { MESSAGE_TYPE } from "../Config";

export const getValueByKey = (obj: any, key: string): any[] | null | any => {
    const values: any = [];
    const find = (obj: object, key: string) => {
        if (!obj) return;
        if (obj[key]) {
            values.push({ [key]: obj[key] });
        }
        Object.values(obj).forEach(val => {
            if (typeof val === 'object') {
                find(val, key);
            }
        });
    }
    find(obj, key);
    return values;
}

export const getKeyByValue = (value: any, complet?: boolean) => {
    let add = { 'viewOnceMessage': 'viewOnce', 'viewOnceMessageV2': 'viewOnce', 'viewOnceMessageV2Extension': 'viewOnce' }
    let obj = complet ? { ...MESSAGE_TYPE, ...add } : MESSAGE_TYPE;
    const keys = Object.keys(obj);
    for (const key of keys) {
        if (obj[key] === value) return key;
        if (typeof obj[key] === 'object') {
            const result = getKeyByValue(value);
            if (result) return `${key}.${result}`;
        }
    }
    return null;
}

export const delKeyFromObject = (obj: any, keyt: string): any => {
    obj = JSON.parse(JSON.stringify(obj)) || null
    const result = { ...obj };
    const remove = (obj) => {
        if (obj) {
            Object.keys(obj).forEach(key => {
                if (key === keyt) {
                    delete obj[key];
                } else {
                    const value = obj[key];
                    if (typeof value === 'object') {
                        remove(value);
                    }
                }
            });
        }
    }
    remove(result);
    return result;
}

export const getMessageType = (obj: any) => {
    const keys = Object.keys(obj);
    for (const key of keys) {
        if (key in MESSAGE_TYPE) return MESSAGE_TYPE[key];
        const value = obj[key];
        if (typeof value === 'object') {
            const type = getMessageType(value);
            if (type) return type;
        }
    }
    return null;
}