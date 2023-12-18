"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const spinnies_1 = __importDefault(require("spinnies"));
const Config_1 = require("../Config");
let spins_toggle = new spinnies_1.default({ spinner: Config_1.point });
let log = console.log;
let logs = (arr) => arr.forEach(x => console.log(x));
const Message = (data, sock, cb) => {
    log(JSON.stringify(data.messages && data.messages[0], null, 2));
};
exports.default = Message;
