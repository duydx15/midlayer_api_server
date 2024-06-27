"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const middleware_config_1 = require("@/config/middleware.config");
const logger_lib_1 = require("../lib/logger.lib");
const player_wallet_controller_1 = require("@/controllers/player_wallet.controller");
class PlayerWalletRoute {
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
        const controller = new player_wallet_controller_1.PlayerWalletController();
        this.express.post('/create', (req, res, next) => {
            controller.addPlayer(req, res)
                .catch(err => {
                logger_lib_1.Logger.getInstance().error(err);
            });
        });
        this.express.get('/get', (req, res, next) => {
            controller.getPlayer(req, res)
                .catch(err => {
                logger_lib_1.Logger.getInstance().error(err);
            });
        });
        this.express.get('/get-ids', (req, res, next) => {
            controller.getPlayerIds(req, res)
                .catch(err => {
                logger_lib_1.Logger.getInstance().error(err);
            });
        });
        this.express.get('/get-id', (req, res, next) => {
            controller.getPlayerId(req, res)
                .catch(err => {
                logger_lib_1.Logger.getInstance().error(err);
            });
        });
        this.express.get('/count', (req, res, next) => {
            controller.getPlayerCount(req, res)
                .catch(err => {
                logger_lib_1.Logger.getInstance().error(err);
            });
        });
        this.express.get('/wallet-get', (req, res, next) => {
            controller.getPlayerWallet(req, res)
                .catch(err => {
                logger_lib_1.Logger.getInstance().error(err);
            });
        });
        this.express.get('/get-all', (req, res, next) => {
            controller.getPlayerAll(req, res)
                .catch(err => {
                logger_lib_1.Logger.getInstance().error(err);
            });
        });
        this.express.get('/get-inventory', (req, res, next) => {
            controller.getPlayerInventory(req, res)
                .catch(err => {
                logger_lib_1.Logger.getInstance().error(err);
            });
        });
        this.express.put('/mutate', (req, res, next) => {
            controller.putPlayerMutate(req, res)
                .catch(err => {
                logger_lib_1.Logger.getInstance().error(err);
            });
        });
        this.express.delete('/remove', (req, res, next) => {
            controller.deletePlayerRemove(req, res)
                .catch(err => {
                logger_lib_1.Logger.getInstance().error(err);
            });
        });
        this.express.delete('/props-remove', (req, res, next) => {
            controller.deletePlayerPropsRemove(req, res)
                .catch(err => {
                logger_lib_1.Logger.getInstance().error(err);
            });
        });
        this.express.post('/withdraw', (req, res, next) => {
            controller.postPlayerWithdraw(req, res)
                .catch(err => {
                logger_lib_1.Logger.getInstance().error(err);
            });
        });
    }
}
exports.default = new PlayerWalletRoute().express;
//# sourceMappingURL=player_wallet.route.js.map