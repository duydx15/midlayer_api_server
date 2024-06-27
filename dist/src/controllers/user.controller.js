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
exports.UserController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const ethers_1 = require("ethers");
const enums_1 = require("@/helper/enums");
const logger_lib_1 = require("@/lib/logger.lib");
const user_model_1 = require("@/models/user.model");
class Guid {
    static newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
class UserController {
    delete(req, res) {
        throw new Error('Method not implemented.');
    }
    put(req, res) {
        throw new Error('Method not implemented.');
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            Promise.reject(new Error('Method not implemented.'));
        });
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            Promise.reject(new Error('Method not implemented.'));
        });
    }
    // POST add meter
    addUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_lib_1.Logger.getInstance().info(`POST ADDUSER - Accept request from ${req.get('User-Agent')} - ${req.ip}`);
            logger_lib_1.Logger.getInstance().info(`POST ADDUSER - Request with body ${JSON.stringify(req.body)}`);
            try {
                const playerId = Guid.newGuid();
                const uniqueId = req.body.uniqueId; //Math.round(Math.random() * 5 + 1);
                const image = req.body.image; // "https://sd-game-assets.s3.amazonaws.com/game_1/players/" + String(id)
                const id = Math.floor(100000 + Math.random() * 900000);
                const exp = req.body.userData.exp;
                const premium = req.body.userData.premium;
                const username = req.body.userData.username;
                const lastSeen = "2022-01-13T15:32:42.347Z";
                const gameId = 1;
                const unique_id = req.body.uniqueId;
                const player_id = Guid.newGuid();
                const wallet = ethers_1.Wallet.createRandom();
                const wallet_address = wallet.address;
                // Create new UserData
                const newUser = yield new user_model_1.UserData({
                    UniqueId: unique_id,
                    Player_id: player_id,
                    Wallet_address: wallet_address,
                }).save();
                // Send response
                if (newUser) {
                    logger_lib_1.Logger.getInstance().info(`Add user with unique_id ${unique_id}, player_id ${player_id}, wallet_address ${wallet_address} success`);
                    res.status(http_status_codes_1.default.OK).send({ status: enums_1.ReturnCode.Success, result: newUser });
                }
                else {
                    logger_lib_1.Logger.getInstance().error(`Add user with unique_id ${unique_id} error`);
                    res.status(http_status_codes_1.default.BAD_REQUEST).send({ status: enums_1.ReturnCode.Error, result: "Add user error" });
                }
            }
            catch (err) {
                logger_lib_1.Logger.getInstance().error(`Add user reject: ${err}`);
                res.status(http_status_codes_1.default.NOT_ACCEPTABLE).send({ status: enums_1.ReturnCode.Error, error: err });
            }
        });
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map