"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const moment_1 = __importDefault(require("moment"));
const app_root = __importStar(require("app-root-path"));
const app_config_1 = __importDefault(require("./app.config"));
require("winston-daily-rotate-file");
const winstonConfig = {
    format: winston_1.format.printf((info) => {
        let msg = `${moment_1.default(Date.now()).format('YYYY-MM-DD HH:mm:ss')} - ${info.level.toUpperCase()}: ${info.message} `;
        msg = info.obj ? `${msg}data:${JSON.stringify(info.obj)} | ` : msg;
        return msg;
    }),
    transports: [
        new winston_1.transports.Console({
            level: app_config_1.default.log.consoleLevel,
            format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.format.printf((log) => `${log.level}\t${log.timestamp}\t${log.message}`)),
        }),
        new winston_1.transports.DailyRotateFile({
            level: app_config_1.default.log.fileLevel,
            filename: `${app_root}/logs/Achilles-7seg-%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '5m',
            maxFiles: '30d',
        }),
        new winston_1.transports.File({
            level: 'error',
            filename: `${app_root}/logs/error/error.log`,
        }),
    ],
};
exports.default = winstonConfig;
//# sourceMappingURL=winston.config.js.map