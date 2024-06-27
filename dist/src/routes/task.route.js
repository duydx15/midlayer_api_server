"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const logger_lib_1 = require("../lib/logger.lib");
const task_controller_1 = require("@/controllers/task.controller");
class TaskRoute {
    constructor() {
        this.express = express_1.default();
        this.middleware();
        this.routes();
    }
    // Configure Express middleware.
    middleware() {
        this.express.use(express_1.default.json());
        this.express.use(express_1.default.urlencoded({ extended: false }));
        this.express.use(cors_1.default());
    }
    routes() {
        const controller = new task_controller_1.TaskController();
        this.express.get('/terminal/:serial', (req, res, next) => {
            controller.get(req, res)
                .catch(err => {
                logger_lib_1.Logger.getInstance().error(err);
            });
        });
    }
}
exports.default = new TaskRoute().express;
//# sourceMappingURL=task.route.js.map