"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
// var mysql = require('mysql');
// import mysql, { Connection, MysqlError } from 'mysql';
// import MasterRoute from "@/routes/master.route";
// import MeterRoute from "@/routes/meter.route";
// import TaskRoute from "@/routes/task.route";
// import UserRoute from "@/routes/user.route";
const player_wallet_route_1 = __importDefault(require("@/routes/player_wallet.route"));
const token_route_1 = __importDefault(require("@/routes/token.route"));
const template_ver2_route_1 = __importDefault(require("@/routes/template_ver2.route"));
class Routes {
    constructor() {
        this.express = express_1.default();
        this.middleware();
        this.routes();
    }
    middleware() {
        this.express.use(helmet_1.default());
        this.express.use(compression_1.default());
        this.express.use(express_1.default.json());
        this.express.use(express_1.default.urlencoded({ extended: true }));
        this.express.use(cors_1.default());
    }
    routes() {
        this.express.use('/player', player_wallet_route_1.default);
        this.express.use('/template', template_ver2_route_1.default);
        this.express.use('/token', token_route_1.default);
    }
}
exports.default = new Routes().express;
//# sourceMappingURL=routes.js.map