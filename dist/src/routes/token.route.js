"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const middleware_config_1 = require("@/config/middleware.config");
const logger_lib_1 = require("../lib/logger.lib");
const token_controller_1 = require("@/controllers/token.controller");
class Token_Route {
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
        const controller = new token_controller_1.Token_Controller();
        this.express.get('/get', (req, res) => {
            controller.get_Token(req, res)
                .catch(err => {
                logger_lib_1.Logger.getInstance().error(err);
            });
        });
        this.express.post('/transfer', (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield controller.transfer_token(req, res)
                .catch(err => {
                logger_lib_1.Logger.getInstance().error(err);
            });
        }));
        this.express.post('/mint-bulk', (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield controller.bulk_mint_token(req, res)
                .catch(err => {
                logger_lib_1.Logger.getInstance().error(err);
            });
        }));
        this.express.post('/burn', (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield controller.burn_token(req, res)
                .catch(err => {
                logger_lib_1.Logger.getInstance().error(err);
            });
        }));
        this.express.put('/mutate', (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield controller.mutate_token(req, res)
                .catch(err => {
                logger_lib_1.Logger.getInstance().error(err);
            });
        }));
        this.express.delete('/props-remove', (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield controller.remove_property_token(req, res)
                .catch(err => {
                logger_lib_1.Logger.getInstance().error(err);
            });
        }));
    }
}
exports.default = new Token_Route().express;
//# sourceMappingURL=token.route.js.map