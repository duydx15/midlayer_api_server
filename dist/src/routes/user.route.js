"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const middleware_config_1 = require("@/config/middleware.config");
const logger_lib_1 = require("../lib/logger.lib");
const user_controller_1 = require("@/controllers/user.controller");
class UserRoute {
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
        const controller = new user_controller_1.UserController();
        this.express.post('/add', (req, res, next) => {
            controller.addUser(req, res)
                .catch(err => {
                logger_lib_1.Logger.getInstance().error(err);
            });
        });
    }
}
exports.default = new UserRoute().express;
//# sourceMappingURL=user.route.js.map