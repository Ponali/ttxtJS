# ttxtJS
## Introduction
ttxtJS is a Node.JS CLI script powered by [WebSocket](https://github.com/websockets/ws), [common terminal ANSI](https://en.wikipedia.org/wiki/ANSI_escape_code) and [sextant unicode characters](https://www.unicode.org/charts/nameslist/n_1FB00.html) that outputs teletext content from Teefax and converts it into a suitable format for the terminal.
## Installation
You can directly clone the source code using git and run `npm install`. When it's done, you are ready to run `node index.js` to start using ttxtJS. Please note that terminals with ANSI and Unicode not supported will look glitchy.
## Commands
If you want to switch page to another, you just have to type the page number, then press enter. This will directly make you wait to the requested page.
The commands `quit`, `exit` and `disconnect` have been added for exiting the script.
