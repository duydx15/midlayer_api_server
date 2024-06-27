"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const logger_lib_1 = require("../lib/logger.lib");
const master_controller_1 = require("@/controllers/master.controller");
class MasterRoute {
    constructor() {
        this.express = express_1.default();
        this.middleware();
        this.routes();
    }
    // Configure Express middleware.
    middleware() {
        this.express.use(helmet_1.default());
        this.express.use(compression_1.default());
        this.express.use(express_1.default.json());
        this.express.use(express_1.default.urlencoded({ extended: false }));
        this.express.use(cors_1.default());
    }
    routes() {
        const controller = new master_controller_1.MasterController();
        this.express.get('/list', (req, res, next) => {
            controller.get(req, res)
                .catch(err => {
                logger_lib_1.Logger.getInstance().error(err);
            });
        });
    }
}
exports.default = new MasterRoute().express;
//# sourceMappingURL=master.route.js.map