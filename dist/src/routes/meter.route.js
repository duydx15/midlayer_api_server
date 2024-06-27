"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const middleware_config_1 = require("@/config/middleware.config");
const logger_lib_1 = require("../lib/logger.lib");
const meter_controller_1 = require("@/controllers/meter.controller");
class MeterRoute {
    constructor() {
        this.express = express_1.default();
        this.middleware();
        this.routes();
    }
    // Configure Express middleware.
    middleware() {
        this.express.use(middleware_config_1.camelcase());
        this.express.use(express_1.default.json());
        this.express.use(express_1.default.urlencoded({ extended: false }));
        this.express.use(cors_1.default());
    }
    routes() {
        const controller = new meter_controller_1.MeterController();
        this.express.post('/add', (req, res, next) => {
            controller.post(req, res)
                .catch(err => {
                logger_lib_1.Logger.getInstance().error(err);
            });
        });
        this.express.post('/cancel', (req, res, next) => {
            controller.postCancel(req, res)
                .catch(err => {
                logger_lib_1.Logger.getInstance().error(err);
            });
        });
    }
}
exports.default = new MeterRoute().express;
//# sourceMappingURL=meter.route.js.map