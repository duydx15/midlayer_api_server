"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const winston_1 = require("winston");
const winston_config_1 = __importDefault(require("@/config/winston.config"));
class Logger {
    constructor() {
        this.logger = winston_1.createLogger(winston_config_1.default);
    }
    static getInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }
    trace(msg, meta) {
        this.logger.log('trace', msg, meta);
    }
    debug(msg, meta) {
        this.logger.debug(msg, meta);
    }
    info(msg, meta) {
        this.logger.info(msg, meta);
    }
    warn(msg, meta) {
        this.logger.warn(msg, meta);
    }
    error(msg, meta) {
        this.logger.error(msg, meta);
    }
    fatal(msg, meta) {
        this.logger.log('fatal', msg, meta);
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.lib.js.map