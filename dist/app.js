"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const compression_1 = __importDefault(require("compression"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const rotating_file_stream_1 = require("rotating-file-stream");
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const routes_1 = __importDefault(require("@/routes/routes"));
const models_1 = __importDefault(require("@/models/"));
const logger_lib_1 = require("@/lib/logger.lib");
const morganConfig = () => {
    morgan_1.default.token('date', (req, res, tz) => {
        return moment_timezone_1.default().tz((tz === null || tz === void 0 ? void 0 : tz.toString()) || '').format();
    });
    morgan_1.default.format('timezoneFormat', ':remote-addr [:date[Asia/Ho_Chi_Minh]] ":method :url" :status :res[content-length] ":user-agent" - :response-time ms');
    return morgan_1.default('timezoneFormat', {
        stream: rotating_file_stream_1.createStream('access.log', {
            interval: '1d',
            path: path_1.default.join(__dirname, 'logs/access_log')
        })
    });
};
class App {
    constructor() {
        this.express = express_1.default();
        this.middleware();
        this.routes();
    }
    // Configure Express middleware.
    middleware() {
        this.express.set('trust proxy', true);
        this.express.use(helmet_1.default());
        this.express.use(compression_1.default());
        this.express.use(express_1.default.json());
        this.express.use(express_1.default.urlencoded({ extended: true }));
        this.express.use(morganConfig());
        this.express.use(express_rate_limit_1.default({
            windowMs: 15 * 60 * 1000,
            max: 1000 // limit each IP to 1000 requests per windowMs
        }));
        models_1.default.sync({ force: false }).then(() => {
            logger_lib_1.Logger.getInstance().info("Re-sync database.");
        });
    }
    routes() {
        // homepage
        this.express.get('/', (req, res, next) => {
            res.send('Hello World');
        });
        // download app
        this.express.get('/download-app', function (req, res) {
            const file = `${__dirname}/download/achilles-app.apk`;
            res.sendFile(file);
        });
        // Qrcode
        this.express.get('/download-qr', function (req, res) {
            const file = `${__dirname}/download/download-link.png`;
            res.sendFile(file);
        });
        // use route
        this.express.use('/api', routes_1.default);
        // handle undefined routes
        this.express.use('*', (req, res, next) => {
            res.send('Make sure url is correct!');
        });
    }
}
exports.default = new App().express;
//# sourceMappingURL=app.js.map