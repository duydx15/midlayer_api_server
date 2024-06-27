"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: `${__dirname}/.env` });
const app_config_1 = __importDefault(require("./src/config/app.config"));
const logger_lib_1 = require("./src/lib/logger.lib");
const app_1 = __importDefault(require("./app"));
const port = app_config_1.default.server.port;
app_1.default.set('port', port);
const server = http_1.default.createServer(app_1.default);
server.listen(port);
server.on('listening', () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${app_config_1.default.server.port}`;
    logger_lib_1.Logger.getInstance().info(`Listening on ${bind}`);
});
module.exports = app_1.default;
//# sourceMappingURL=index.js.map