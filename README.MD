# Zaieys - Typescript/Javascript WhatsApp Node API

<img src="https://raw.githubusercontent.com/zaadevofc/Baileys/main/zaieys-banner.jpg" alt="Zaieys - Typescript/Javascript WhatsApp Node API">

## _**Warning!!! This library is not fully finished, and it is still really raw, I suggest you patiently wait until the version of this library is no longer -dev (development)**_

<br />

[![zaieys](https://img.shields.io/badge/baileys-alternative-blue)](https://github.com/zaadevofc/Baileys)
[![zaieys](https://img.shields.io/badge/zaadevofc-zaieys-red)](https://github.com/zaadevofc/Baileys)
[![version](https://img.shields.io/npm/v/@zaadevofc/baileys.svg)](https://www.npmjs.com/package/@zaadevofc/baileys)
[![download](https://img.shields.io/npm/dw/@zaadevofc/baileys.svg?style=flat-square)](https://www.npmjs.com/package/@zaadevofc/baileys)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Zaieys** is a WhatsApp API library that focuses on user convenience and efficiency. This library is only a modification of the [@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys) library. 

Where is the **Zaieys** library to make it easier to create WhatsApp bots. I really look forward to suggestions and input from all of you, thank you for using✨

> If you have any complaints or questions, please submit them on the github issue [here](https://github.com/zaadevofc/Baileys/issues), that will also help everyone.

## 🚀 Lets do it
### Installation

Install with your fav installer

```bash
  npm add @zaadevofc/baileys

  yarn add @zaadevofc/baileys

  pnpm add @zaadevofc/baileys
```
call your project using `module` or `commonjs`

```js
import { WA } from "@zaadevofc/baileys";
// or
const { WA } = require("@zaadevofc/baileys");
```

### Make connection

> By default, this library supports **multiple device**, so you don't need a lot of configuration.

configuration by default

```js
const wa = new WA({
  authDir: 'session',
  authors: [],
  browser: ['Zaieys', 'Safari', '1.0'],
  showLog: true
});
```

### Simple connection

```js
const start = async () => {
  await wa.init(start);

  wa.on("connection", ({ status }) => {
    if (status == 'ready') {
      // hello momm
    }
  });

  wa.on("message", (msg) => {
    if (msg.text == 'hai') {
      wa.sendReply('keliatan bgt nyenggol zharif')
    } 
    
    if (msg.text == 'test') {
      wa.sendText('hi! i am a HTML developer..')
    }
  });
};

// running in main file
start();
```
### 📃 Documentation

If you want more details, you can visit the documentation for this library here :

**[📃 Docs](https://zaadevofc.github.io/Baileys)**
**[📃 Docs](https://zaadevofc.github.io/Baileys)**
**[📃 Docs](https://zaadevofc.github.io/Baileys)**
**[📃 Docs](https://zaadevofc.github.io/Baileys)**
**[📃 Docs](https://zaadevofc.github.io/Baileys)**

### 🥇 Author

This library was designed by [zaadevofc](https://www.instagram.com/zaadevofc/)

I am an Indonesian who likes to be confused about the world~


### 🍴 Feedback

Kalau punya Feedback jangan cerita ke **nadia omara** tapi diskusi disini :

[https://github.com/zaadevofc/Baileys/discussions](https://github.com/zaadevofc/Baileys/discussions)

If you have feedback, you can discuss it above ☝️

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)