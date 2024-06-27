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
exports.PlayerWalletController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const ethers_1 = require("ethers");
const sequelize_1 = require("sequelize");
const validator_1 = __importDefault(require("validator"));
const enums_1 = require("@/helper/enums");
const index_1 = __importDefault(require("@/models/index"));
const logger_lib_1 = require("@/lib/logger.lib");
const test_nfts_edge2_copy_1 = require("@/lib/test_nfts_edge2_copy");
const wallet_model_1 = require("@/models/wallet.model");
const player_model_1 = require("@/models/player.model");
const token_model_1 = require("@/models/token.model");
const template2_model_1 = require("@/models/template2.model");
class Guid {
    static newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
function getErrorMessage(error) {
    if (error instanceof Error)
        return error.message;
    return String(error);
}
class PlayerWalletController {
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
    /* POST add new player */
    addPlayer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_lib_1.Logger.getInstance().info(`POST ADD PLAYER - Accept request from ${req.get('User-Agent')} - ${req.ip}`);
            logger_lib_1.Logger.getInstance().info(`POST ADD PLAYER - Request with body ${JSON.stringify(req.body)}`);
            try {
                // Request params
                var status_error = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
                var message_error;
                //Check invalid req body
                if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                    status_error = http_status_codes_1.default.BAD_REQUEST;
                    message_error = JSON.stringify({ message: "Invalid request body" }, null, 2);
                    res.status(status_error).send(message_error);
                    throw new Error(message_error);
                }
                const playerId = Guid.newGuid();
                const uniqueId = req.body.uniqueId; //Math.round(Math.random() * 5 + 1);
                const image = req.body.image; // "https://sd-game-assets.s3.amazonaws.com/game_1/players/" + String(id)
                const userData = req.body.userData;
                // Check for valid request params
                // const check_userData = validator.isJSON(JSON.stringify(userData))
                // if ( (uniqueId == null) || (!check_userData) ) {
                //   throw Error('Invalid request body')
                // } else {
                //   console.log('CHECK FOR valid request form: OK')
                // }
                // Fake values
                const lastSeen = "2022-01-13T15:32:42.347Z";
                const gameId = 1;
                const wallet = ethers_1.Wallet.createRandom();
                // const mnemonic =  wallet.mnemonic.phrase
                const wallet_address = wallet.address;
                const private_key = wallet.privateKey;
                const public_key = wallet.publicKey;
                const blockchain = "supernet";
                const balance = 0.0;
                // Create new PlayerData
                console.log('UPDATING NEW PLAYER TO player_db ...');
                let newPlayer = false;
                if (image) {
                    newPlayer = yield new player_model_1.player_db({
                        PlayerId: playerId,
                        UniqueId: uniqueId,
                        Image: image,
                        GameId: gameId,
                        LastSeen: lastSeen,
                        UserData: userData
                    }).save();
                }
                else {
                    newPlayer = yield new player_model_1.player_db({
                        PlayerId: playerId,
                        UniqueId: uniqueId,
                        GameId: gameId,
                        LastSeen: lastSeen,
                        UserData: userData
                    }).save();
                }
                console.log('UPDATE NEW PLAYER done!');
                // Create new WalletData
                console.log('UPDATING NEW WALLET TO wallet_db ...');
                const newWallet = yield new wallet_model_1.wallet_db({
                    PlayerId: playerId,
                    Address: wallet_address,
                    Blockchain: blockchain,
                    PrivateKey: private_key,
                    PublicKey: public_key,
                    Balance: balance,
                }).save();
                console.log('UPDATE NEW WALLET done!');
                // Send response
                if (newPlayer && newWallet) {
                    logger_lib_1.Logger.getInstance().info(`ADD PLAYER success. Player id: ${playerId}`);
                    const result_playerId = { "playerId": playerId };
                    const result_image = { "image": image };
                    let result = Object.assign(Object.assign(Object.assign({}, result_playerId), userData), result_image);
                    res.status(http_status_codes_1.default.OK).send(JSON.stringify(result, null, 2));
                }
                else {
                    logger_lib_1.Logger.getInstance().error(`ADD PLAYER error`);
                    res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send(JSON.stringify({ result: "UPDATE NEW PLAYER TO DATABASE ERROR" }, null, 2));
                }
            }
            catch (err) {
                logger_lib_1.Logger.getInstance().error(`ADD PLAYER failed: ${err}`);
                if (err.message == 'Invalid request body') {
                    res.status(http_status_codes_1.default.BAD_REQUEST).send({ message: err.message });
                }
                else if (err.message == 'Validation error') {
                    res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send(JSON.stringify({ message: "Unique ID is already in use", stack: err.stack }, null, 2));
                }
                else {
                    res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send(JSON.stringify({ message: err.message, stack: err.stack }, null, 2));
                }
            }
        });
    }
    /* GET player */
    getPlayer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_lib_1.Logger.getInstance().info(`GET PLAYER - Accept request from ${req.get('User-Agent')} - ${req.ip}`);
            logger_lib_1.Logger.getInstance().info(`GET PLAYER - Request with params ${JSON.stringify(req.query)}`);
            var status_error = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
            var message_error;
            try {
                // Get playerId from request url params
                const player_id = String(req.query['playerId']);
                // Check if player Id in uuid format
                const is_uuid = validator_1.default.isUUID(player_id, 4);
                if (!is_uuid) {
                    status_error = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
                    message_error = JSON.stringify({ message: "invalid input syntax for type uuid: " + String(player_id), stack: "error: invalid input syntax for type uuid: " + String(player_id) }, null, 2);
                    // Logger.getInstance().error(`Get playerId error UUID: ${message_error}`)
                    // res.status(status_error).send(message_error)
                    throw new Error(message_error);
                }
                // Retrieve data from mySql
                // const data = await player_db.findOne({
                //   where: {
                //     playerId: player_id
                //   }
                // })
                const data = yield index_1.default.query(`SELECT gameId, playerId, uniqueId, id, lastSeen, image, userData\
         FROM Player WHERE playerId = "${player_id}"`, { type: sequelize_1.QueryTypes.SELECT });
                // Send response
                if (data.length) {
                    logger_lib_1.Logger.getInstance().info(`GET PLAYER success. Player id ${player_id}`);
                    res.status(http_status_codes_1.default.OK).send(JSON.stringify(data[0], null, 2));
                }
                else {
                    logger_lib_1.Logger.getInstance().error(`GET PLAYER error`);
                    res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send(JSON.stringify({ message: "Unable to find player by playerId: " + String(player_id), stack: "error: Unable to find player by playerId: " + String(player_id) }, null, 2));
                }
            }
            catch (err) {
                logger_lib_1.Logger.getInstance().error(`GET PLAYER FAILED: ${err}`);
                res.status(status_error).send(getErrorMessage(err));
            }
        });
    }
    /* GET player Ids */
    getPlayerIds(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_lib_1.Logger.getInstance().info(`GET PLAYER IDS - Accept request from ${req.get('User-Agent')} - ${req.ip}`);
            logger_lib_1.Logger.getInstance().info(`GET PLAYER IDS - Request with body ${JSON.stringify(req.body)}`);
            try {
                // Retrieve data from mySql
                const data = yield player_model_1.player_db.findAll({
                    attributes: ['uniqueId', 'playerId']
                });
                // Send response
                if (data) {
                    logger_lib_1.Logger.getInstance().info(`GET PLAYER IDS success`);
                    res.status(http_status_codes_1.default.OK).send(JSON.stringify(data, null, 2));
                }
                else {
                    logger_lib_1.Logger.getInstance().error(`GET PLAYER IDS error`);
                    res.status(http_status_codes_1.default.BAD_REQUEST).send(JSON.stringify({ status: enums_1.ReturnCode.Error, result: "GET PLAYER IDS error" }, null, 2));
                }
            }
            catch (err) {
                logger_lib_1.Logger.getInstance().error(`GET PLAYER IDS FAILED: ${err}`);
                res.status(http_status_codes_1.default.NOT_ACCEPTABLE).send(JSON.stringify({ status: enums_1.ReturnCode.Error, error: err }, null, 2));
            }
        });
    }
    /* GET player Id */
    getPlayerId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_lib_1.Logger.getInstance().info(`GET PLAYER ID - Accept request from ${req.get('User-Agent')} - ${req.ip}`);
            logger_lib_1.Logger.getInstance().info(`GET PLAYER ID - Request with params ${JSON.stringify(req.query)}`);
            try {
                // Get uniqueId from request url params
                const unique_id = req.query['uniqueId'];
                // Retrieve data from mySql
                const data = yield player_model_1.player_db.findOne({
                    where: {
                        uniqueId: unique_id
                    }
                });
                const playerId = data === null || data === void 0 ? void 0 : data.PlayerId;
                // Send response
                if (playerId) {
                    logger_lib_1.Logger.getInstance().info(`GET PLAYER ID success`);
                    res.status(http_status_codes_1.default.OK).send(JSON.stringify({
                        playerId: playerId
                    }, null, 2));
                }
                else {
                    logger_lib_1.Logger.getInstance().error(`GET PLAYER ID error`);
                    res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send(JSON.stringify({
                        message: "Unable to find player by uniqueId: " + String(unique_id) + " in game:1",
                        stack: "Error: Unable to find player by uniqueId: " + String(unique_id) + " in game:1\n\
          at exports.getPlayerByUniqueId (/var/task/getPlayerByUniqueId.js:6:11)\n\
          at processTicksAndRejections (internal/process/task_queues.js:95:5)\n\
          at async Runtime.exports.handler (/var/task/index.js:11:20)"
                    }, null, 2));
                }
            }
            catch (err) {
                logger_lib_1.Logger.getInstance().error(`GET PLAYER ID FAILED: ${err}`);
                res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send(JSON.stringify({ status: enums_1.ReturnCode.Error, error: err }, null, 2));
            }
        });
    }
    /* GET player count */
    getPlayerCount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_lib_1.Logger.getInstance().info(`GET PLAYER COUNT- Accept request from ${req.get('User-Agent')} - ${req.ip}`);
            logger_lib_1.Logger.getInstance().info(`GET PLAYER COUNT - Request with body ${JSON.stringify(req.body)}`);
            try {
                // retrieve data from mySql
                const player_count = yield player_model_1.player_db.count();
                // Send response
                if (player_count) {
                    logger_lib_1.Logger.getInstance().info(`GET PLAYER COUNT success`);
                    res.status(http_status_codes_1.default.OK).send(JSON.stringify({ count: player_count }, null, 2));
                }
                else {
                    logger_lib_1.Logger.getInstance().error(`GET PLAYER COUNT error`);
                    res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send(JSON.stringify({ status: enums_1.ReturnCode.Error, result: "GET PLAYER COUNT error" }, null, 2));
                }
            }
            catch (err) {
                logger_lib_1.Logger.getInstance().error(`GET PLAYER COUNT FAILED: ${err}`);
                res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send(JSON.stringify({ status: enums_1.ReturnCode.Error, error: err }, null, 2));
            }
        });
    }
    /* GET player wallet */
    getPlayerWallet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_lib_1.Logger.getInstance().info(`GET PLAYER WALLET- Accept request from ${req.get('User-Agent')} - ${req.ip}`);
            logger_lib_1.Logger.getInstance().info(`GET PLAYER WALLET - Request with params ${JSON.stringify(req.query)}`);
            var status_error = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
            var message_error;
            try {
                // Get playerId from request url params
                const player_id = String(req.query['playerId']);
                // Check if player Id in uuid format
                const is_uuid = validator_1.default.isUUID(player_id, 4);
                if (!is_uuid) {
                    status_error = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
                    message_error = JSON.stringify({ message: "invalid input syntax for type uuid: " + String(player_id), stack: "error: invalid input syntax for type uuid: " + String(player_id) }, null, 2);
                    logger_lib_1.Logger.getInstance().error(`Get playerId error UUID: ${message_error}`);
                    res.status(status_error).send(message_error);
                    throw new Error(message_error);
                }
                // Retrieve data from mySql
                const data = yield wallet_model_1.wallet_db.findOne({
                    where: {
                        playerId: player_id
                    }
                });
                const wallet_blockchain = data === null || data === void 0 ? void 0 : data.Blockchain;
                const wallet_address = data === null || data === void 0 ? void 0 : data.Address;
                let wallet_balance = data === null || data === void 0 ? void 0 : data.Balance;
                if (wallet_balance == 0) {
                    wallet_balance = [];
                }
                // Send response
                if (data) {
                    logger_lib_1.Logger.getInstance().info(`GET PLAYER WALLET success`);
                    res.status(http_status_codes_1.default.OK).send(JSON.stringify({
                        wallet: [
                            {
                                "blockchain": wallet_blockchain,
                                "address": wallet_address,
                                "balances": wallet_balance
                            }
                        ]
                    }, null, 2));
                }
                else {
                    logger_lib_1.Logger.getInstance().error(`GET PLAYER WALLET error`);
                    res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send(JSON.stringify({ message: "Unable to find player by playerId: " + String(player_id), stack: "error: Unable to find player by playerId: " + String(player_id) }, null, 2));
                }
            }
            catch (err) {
                logger_lib_1.Logger.getInstance().error(`GET PLAYER WALLET FAILED: ${err}`);
                res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send(JSON.stringify({ status: enums_1.ReturnCode.Error, error: err }, null, 2));
            }
        });
    }
    /* GET all players */
    getPlayerAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_lib_1.Logger.getInstance().info(`GET ALL PLAYERS - Accept request from ${req.get('User-Agent')} - ${req.ip}`);
            logger_lib_1.Logger.getInstance().info(`GET ALL PLAYERS - Request with params ${JSON.stringify(req.query)}`);
            try {
                // Get start and limit from request url params
                const start = Number(req.query['start']);
                const limit = Number(req.query['limit']);
                // Retrieve data from mySql
                const data = yield index_1.default.query(`SELECT gameId, playerId, uniqueId, id, lastSeen, image, userData\
         FROM Player ORDER BY id DESC LIMIT ${start},${limit}`, { type: sequelize_1.QueryTypes.SELECT });
                // Send response
                if (data.length) {
                    logger_lib_1.Logger.getInstance().info(`GET ALL PLAYERS success`);
                    res.status(http_status_codes_1.default.OK).send(JSON.stringify(data, null, 2));
                }
                else {
                    logger_lib_1.Logger.getInstance().error(`GET ALL PLAYERS error`);
                    res.status(http_status_codes_1.default.BAD_REQUEST).send(JSON.stringify({ status: enums_1.ReturnCode.Error, result: "GET ALL PLAYERS error" }, null, 2));
                }
            }
            catch (err) {
                logger_lib_1.Logger.getInstance().error(`GET ALL PLAYERS FAILED: ${err}`);
                res.status(http_status_codes_1.default.NOT_ACCEPTABLE).send(JSON.stringify({ status: enums_1.ReturnCode.Error, error: err }, null, 2));
            }
        });
    }
    /* GET player inventory */
    getPlayerInventory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_lib_1.Logger.getInstance().info(`GET PLAYER INVENTORY- Accept request from ${req.get('User-Agent')} - ${req.ip}`);
            logger_lib_1.Logger.getInstance().info(`GET PLAYER INVENTORY - Request with params ${JSON.stringify(req.query)}`);
            try {
                // Get playerId from request url params
                const player_id = String(req.query['playerId']);
                // Check if player Id in uuid format
                var status_error = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
                var message_error;
                const is_uuid = validator_1.default.isUUID(player_id, 4);
                if (!is_uuid) {
                    status_error = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
                    message_error = JSON.stringify({ message: "invalid input syntax for type uuid: " + String(player_id), stack: "error: invalid input syntax for type uuid: " + String(player_id) }, null, 2);
                    logger_lib_1.Logger.getInstance().error(`Get playerId error UUID: ${message_error}`);
                    res.status(status_error).send(message_error);
                    throw new Error(message_error);
                }
                // Check if player id in database
                const player_data = yield player_model_1.player_db.findOne({
                    where: {
                        PlayerId: player_id
                    }
                });
                if (player_data == null) {
                    logger_lib_1.Logger.getInstance().error(`PLAYER ID is not in player db ...`);
                    res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send(JSON.stringify({ message: "Unable to find player by playerId: " + String(player_id), stack: "error: Unable to find player by playerId: " + String(player_id) }, null, 2));
                    return;
                }
                else {
                    console.log('FOUND PLAYER ID in our player db.');
                }
                // Retrieve data from mySql
                const data = yield token_model_1.token_db.findAll({
                    attributes: [['stardust_tokenId', 'tokenId'], 'amount'],
                    where: {
                        playerId: player_id
                    }
                });
                // Send response
                if (data) {
                    logger_lib_1.Logger.getInstance().info(`GET PLAYER INVENTORY success`);
                    res.status(http_status_codes_1.default.OK).send(JSON.stringify(data, null, 2));
                }
                else {
                    logger_lib_1.Logger.getInstance().error(`GET PLAYER INVENTORY error`);
                    res.status(http_status_codes_1.default.OK).send([]);
                }
            }
            catch (err) {
                logger_lib_1.Logger.getInstance().error(`GET PLAYER INVENTORY FAILED: ${err}`);
                res.status(http_status_codes_1.default.NOT_ACCEPTABLE).send(JSON.stringify({ status: enums_1.ReturnCode.Error, error: err }, null, 2));
            }
        });
    }
    /* PUT player mutate */
    putPlayerMutate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_lib_1.Logger.getInstance().info(`PUT PLAYER MUTATE - Accept request from ${req.get('User-Agent')} - ${req.ip}`);
            logger_lib_1.Logger.getInstance().info(`PUT PLAYER MUTATE - Request with body ${JSON.stringify(req.body)}`);
            try {
                // Get request params
                const player_id = req.body.playerId;
                const props = req.body.props;
                // Check for valid request params
                var status_error = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
                var message_error;
                //Check invalid req body
                if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                    status_error = http_status_codes_1.default.BAD_REQUEST;
                    message_error = JSON.stringify({ message: "Invalid request body" }, null, 2);
                    res.status(status_error).send(message_error);
                    throw new Error(message_error);
                }
                // Check if player Id in uuid format
                var status_error = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
                var message_error;
                const is_uuid = validator_1.default.isUUID(player_id, 4);
                if (!is_uuid) {
                    status_error = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
                    message_error = JSON.stringify({ message: "invalid input syntax for type uuid: " + String(player_id), stack: "error: invalid input syntax for type uuid: " + String(player_id) }, null, 2);
                    logger_lib_1.Logger.getInstance().error(`Get playerId error UUID: ${message_error}`);
                    res.status(status_error).send(message_error);
                    throw new Error(message_error);
                }
                // Retrieve data from mySql
                const data = yield player_model_1.player_db.findOne({
                    where: {
                        playerId: player_id
                    }
                });
                if (data == null) {
                    logger_lib_1.Logger.getInstance().error(`PLAYER ID is not in player db ...`);
                    res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send(JSON.stringify({ message: "Unable to find player by playerId: " + String(player_id), stack: "error: Unable to find player by playerId: " + String(player_id) }, null, 2));
                    return;
                }
                else {
                    console.log('FOUND PLAYER ID in our player db.');
                }
                // Modify the database
                let player_props = data === null || data === void 0 ? void 0 : data.UserData;
                if (player_props == null) {
                    player_props = props;
                }
                else {
                    for (let key of Object.keys(props)) {
                        player_props[key] = props[key];
                    }
                }
                const update_result = yield player_model_1.player_db.update({ UserData: player_props }, {
                    where: { playerId: player_id }
                });
                // Send response
                if (update_result) {
                    logger_lib_1.Logger.getInstance().info(`PUT PLAYER MUTATE success`);
                    res.status(http_status_codes_1.default.OK).send({});
                }
                else {
                    logger_lib_1.Logger.getInstance().error(`PUT PLAYER MUTATE error`);
                    res.status(http_status_codes_1.default.BAD_REQUEST).send(JSON.stringify({ status: enums_1.ReturnCode.Error, result: "PUT PLAYER MUTATE error" }, null, 2));
                }
            }
            catch (err) {
                logger_lib_1.Logger.getInstance().error(`PUT PLAYER MUTATE FAILED: ${err}`);
                res.status(http_status_codes_1.default.NOT_ACCEPTABLE).send(JSON.stringify({ status: enums_1.ReturnCode.Error, error: err }, null, 2));
            }
        });
    }
    /* DELETE player remove */
    deletePlayerRemove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_lib_1.Logger.getInstance().info(`DELETE PLAYER REMOVE - Accept request from ${req.get('User-Agent')} - ${req.ip}`);
            logger_lib_1.Logger.getInstance().info(`DELETE PLAYER REMOVE - Request with params ${JSON.stringify(req.query)}`);
            try {
                // Get playerId from request url params
                const player_id = String(req.query['playerId']);
                // Check if player Id in uuid format
                var status_error = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
                var message_error;
                const is_uuid = validator_1.default.isUUID(player_id, 4);
                if (!is_uuid) {
                    status_error = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
                    message_error = JSON.stringify({ message: "invalid input syntax for type uuid: " + String(player_id), stack: "error: invalid input syntax for type uuid: " + String(player_id) }, null, 2);
                    logger_lib_1.Logger.getInstance().error(`Get playerId error UUID: ${message_error}`);
                    res.status(status_error).send(message_error);
                    throw new Error(message_error);
                }
                // Check if player id in database
                const player_data = yield player_model_1.player_db.findOne({
                    where: {
                        PlayerId: player_id
                    }
                });
                if (player_data == null) {
                    logger_lib_1.Logger.getInstance().error(`PLAYER ID is not in player db ...`);
                    res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send(JSON.stringify({ message: "Unable to find player by playerId: " + String(player_id), stack: "error: Unable to find player by playerId: " + String(player_id) }, null, 2));
                    return;
                }
                else {
                    console.log('FOUND PLAYER ID in our player db.');
                }
                // Delete player and wallet from db
                const remove_player_result = yield player_model_1.player_db.destroy({
                    where: {
                        playerId: player_id
                    }
                });
                const remove_wallet_result = yield wallet_model_1.wallet_db.destroy({
                    where: {
                        playerId: player_id
                    }
                });
                // Send response
                if (remove_player_result && remove_wallet_result) {
                    logger_lib_1.Logger.getInstance().info(`DELETE PLAYER REMOVE success. Player id ${player_id}`);
                    res.status(http_status_codes_1.default.OK).send({});
                }
                else {
                    logger_lib_1.Logger.getInstance().error(`DELETE PLAYER REMOVE error`);
                    res.status(http_status_codes_1.default.BAD_REQUEST).send(JSON.stringify({ status: enums_1.ReturnCode.Error, result: "DELETE PLAYER REMOVE error" }, null, 2));
                }
            }
            catch (err) {
                logger_lib_1.Logger.getInstance().error(`DELETE PLAYER REMOVE FAILED: ${err}`);
                res.status(http_status_codes_1.default.NOT_ACCEPTABLE).send(JSON.stringify({ status: enums_1.ReturnCode.Error, error: err }, null, 2));
            }
        });
    }
    /* DELETE player prop remove */
    deletePlayerPropsRemove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_lib_1.Logger.getInstance().info(`DELETE PLAYER PROP REMOVE - Accept request from ${req.get('User-Agent')} - ${req.ip}`);
            logger_lib_1.Logger.getInstance().info(`DELETE PLAYER PROP REMOVE - Request with params ${JSON.stringify(req.query)}`);
            try {
                // Get params from request
                const player_id = req.query.playerId;
                const props_to_remove = JSON.parse(String(req.query.props));
                // Get current props from db
                const data = yield player_model_1.player_db.findOne({
                    where: { playerId: player_id }
                });
                let current_props = data === null || data === void 0 ? void 0 : data.UserData;
                // Remove props from current props
                for (let element of props_to_remove) {
                    delete current_props[element];
                }
                // Update new props to db
                const remove_result = yield player_model_1.player_db.update({ UserData: current_props }, {
                    where: {
                        playerId: player_id
                    }
                });
                // Send response
                if (remove_result) {
                    logger_lib_1.Logger.getInstance().info(`DELETE PLAYER PROP REMOVE success. Player id ${player_id}`);
                    res.status(http_status_codes_1.default.OK).send({});
                }
                else {
                    logger_lib_1.Logger.getInstance().error(`DELETE PLAYER PROP REMOVE error`);
                    res.status(http_status_codes_1.default.BAD_REQUEST).send(JSON.stringify({ status: enums_1.ReturnCode.Error, result: "DELETE PLAYER PROP REMOVE error" }, null, 2));
                }
            }
            catch (err) {
                logger_lib_1.Logger.getInstance().error(`DELETE PLAYER PROP REMOVE FAILED: ${err}`);
                res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send({ message: err.message, stack: err.stack });
            }
        });
    }
    /* POST withdraw from player */
    postPlayerWithdraw(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_lib_1.Logger.getInstance().info(`POST PLAYER WITHDRAW- Accept request from ${req.get('User-Agent')} - ${req.ip}`);
            logger_lib_1.Logger.getInstance().info(`POST PLAYER WITHDRAW - Request with body ${JSON.stringify(req.body)}`);
            var status_error;
            var message_error;
            try {
                let error = false;
                // transfer NFT token params
                const operator1 = '0x8c3AE5DbE2900bfBA1Bdb7606D93a96362b0DB33';
                const operator1_key = '0x5f00a94a5ea03fe9272e6f04b5c517297bde4d4ead2d7b1af443971dff2049f1';
                // Request params
                const to_wallet_address = req.body.address;
                const playerId = req.body.playerId;
                const tokenObjects = req.body.tokenObjects;
                let tokenIds = [];
                for (const element of tokenObjects) {
                    const token_json = JSON.stringify(element);
                    const token_parsed = JSON.parse(token_json);
                    tokenIds.push(token_parsed.tokenId);
                }
                // Get wallet address from playerId
                const data = yield wallet_model_1.wallet_db.findOne({
                    where: {
                        PlayerId: playerId
                    }
                });
                const from_wallet_address = data === null || data === void 0 ? void 0 : data.Address;
                if (from_wallet_address) {
                    var check_owner = true;
                    var wrong_tokenID_owner = [];
                    var blockchain_tokenId_list = [];
                    var contract_address_list = [];
                    // Check owner tokenId
                    // var check_ = [];
                    console.log(`List tokenID: ${tokenIds}`);
                    for (var i = 0; i < tokenObjects.length; i++) {
                        var check_ = yield token_model_1.token_db.findOne({
                            where: {
                                stardust_tokenId: tokenIds[i],
                                playerId: playerId
                            }
                        });
                        if (check_) {
                            blockchain_tokenId_list[i] = check_.blockchain_tokenId;
                            var check_contract = yield template2_model_1.template_ver2_db.findOne({
                                where: {
                                    id: check_.templateId
                                }
                            });
                            if (check_contract) {
                                contract_address_list[i] = check_contract.ContractAddress;
                            }
                            else {
                                status_error = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
                                message_error = JSON.stringify({ message: `Can not get contractAddress from template ${check_.templateId}`, stack: "Error: Can not get contractAddress from template" }, null, 2);
                                throw new Error(message_error);
                            }
                            // check_owner = false
                            // wrong_tokenID_owner.push(tokenObjects[i].tokenId)
                        }
                        else {
                            check_owner = false;
                            wrong_tokenID_owner.push(tokenIds[i]);
                        }
                    }
                    if (check_owner) {
                        //   // transfer(address_from)
                        // Update DB token_db: playerId
                        for (var i = 0; i < tokenObjects.length; i++) {
                            var result_transfer = yield test_nfts_edge2_copy_1.transfer(from_wallet_address, to_wallet_address, blockchain_tokenId_list[i], operator1, operator1_key, contract_address_list[i]);
                            // res.send(result_transfer)
                            if (result_transfer) {
                                yield token_model_1.token_db.destroy({
                                    where: {
                                        stardust_tokenId: tokenIds[i]
                                    }
                                });
                            }
                            else {
                                status_error = http_status_codes_1.default.BAD_REQUEST;
                                var err_withdraw_token = `ERROR when WITHDRAW Token`;
                                throw new Error(err_withdraw_token);
                            }
                        }
                        logger_lib_1.Logger.getInstance().info(`POST PLAYER WITHDRAW SUCCESS `);
                        res.status(http_status_codes_1.default.OK).send({});
                    }
                    else {
                        status_error = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
                        var err_ownership = `Player does not own token`;
                        throw new Error(err_ownership);
                    }
                    // let successIds:number[] = []
                    // let failIds:number[] = []
                    // for (const tokenId of tokenIds) {
                    //   const result_transfer = await transfer(from_wallet_address, to_wallet_address, tokenId, operator1, operator1_key)
                    //   if (typeof transfer_data === undefined) {
                    //     console.log('Transfer ')
                    //   }
                    // }
                }
                else {
                    logger_lib_1.Logger.getInstance().error(`POST PLAYER WITHDRAW error `);
                    res.status(http_status_codes_1.default.BAD_REQUEST).send(JSON.stringify({ status: enums_1.ReturnCode.Error, result: `Can not find wallet address of playerId: ${playerId}` }, null, 2));
                }
                // // Retrieve data from mySql
                // const data = await wallet_db.findAll({
                //   attributes: ['blockchain', 'address', ['balance', 'balances'], ['balance', 'monies']],
                //   where: {
                //     playerId: player_id
                //   }
                // })
                // // Send response
                // if (data) {
                //   Logger.getInstance().info(`POST PLAYER WITHDRAW success`)
                //   res.status(HttpStatus.OK).send({ wallet: data })
                // } else {
                //   Logger.getInstance().error(`POST PLAYER WITHDRAW error`)
                //   res.status(HttpStatus.BAD_REQUEST).send({ status: ReturnCode.Error, result: "POST PLAYER WITHDRAW error" })
                // }
            }
            catch (err) {
                logger_lib_1.Logger.getInstance().error(`POST PLAYER WITHDRAW FAILED: ${getErrorMessage(err)}`);
                res.status(http_status_codes_1.default.BAD_REQUEST).send(JSON.stringify({ message: err.message, stack: err.stack }, null, 2));
            }
        });
    }
}
exports.PlayerWalletController = PlayerWalletController;
//# sourceMappingURL=player_wallet.controller.js.map