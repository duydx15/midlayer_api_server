'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const common_helper_1 = require("../helper/common.helper");
const defaults = {
    server: {
        port: 22,
    },
};
const appConfig = {
    log: {
        consoleLevel: process.env.LOG_CONSOLE_LEVEL || 'debug',
        fileLevel: process.env.LOG_FILE_LEVEL || 'debug',
    },
    server: {
        port: common_helper_1.CommonHelper.normalizePort(process.env.SERVER_PORT || defaults.server.port),
    },
    seven_seg_addr: process.env.SEVEN_SEG_ADDR || 'http://192.168.1.109:5100',
};
exports.default = appConfig;
//# sourceMappingURL=app.config.js.map