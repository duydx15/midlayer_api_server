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
exports.Token_Controller = exports.getErrorMessage = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const logger_lib_1 = require("@/lib/logger.lib");
const wallet_model_1 = require("@/models/wallet.model");
const token_model_1 = require("@/models/token.model");
const template2_model_1 = require("@/models/template2.model");
const withdraw_token_model_1 = require("@/models/withdraw_token.model");
const validator_1 = __importDefault(require("validator"));
// import sequelize from '@/models/index';
// import { QueryTypes } from 'sequelize';
const test_nfts_edge2_copy_1 = require("@/lib/test_nfts_edge2_copy");
require('dotenv').config(); //initialize dotenv
let mysql = require('mysql');
const update_totalSuply = function (supply, id) {
    return __awaiter(this, void 0, void 0, function* () {
        new Promise((resolve, reject) => {
            // con.connect(function(err) {
            // if (err) throw err;
            // console.log(`INSET INTO token_listed (stardust_tokenId,prices,time_list) VALUES(${stardust_tokenId},${random_price},"${String(dateTime)}")`)
            con.query(`UPDATE template SET totalSupply = totalSupply + ${supply}  WHERE id = ${id}`, function (err, result, fiels) {
                if (err)
                    throw err;
                resolve(result);
                // console.log(`REMOVE non exist token ${stardust_tokenId} success ` )
                // con.end()
            });
        });
    });
};
const con = mysql.createConnection({
    host: "localhost",
    user: "user1",
    password: "passUser1!",
    database: "stardust"
});
const Web3 = require('web3');
// Chain config
const GAS_LIMIT = 1000000; // You can change this value if underpriced
const GAS_PRICE = 160000000; // You can change this value if underpriced
//const serverNode = '3.131.198.45:20002';
const serverNode = '3.12.225.53:10002';
//const serverNode = 'matic-mumbai.chainstacklabs.com';
//const serverNode = 'rpc-mumbai.maticvigil.com';
//const serverNode = 'polygonedge-test.anlab.info';
//const web3 = new Web3(`https://${serverNode}:10002`);
//const web3 = new Web3(`https://${serverNode}`);
const web3 = new Web3(`http://${serverNode}`);
// process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
// Address of target contract
const contractAddress = '0x3C46A8127083EF698A32daDdB6Bc9b919612F207';
const contractAddress_2 = "0x25BE07479146D3a032D0aCEb06e8a2D8E1AAC762";
const contractAddress_3 = "0x58fF7f8EA3ba7dfe74952A1082cCd8B95aad9a9B";
const operator1 = '0x8c3AE5DbE2900bfBA1Bdb7606D93a96362b0DB33';
const operator1_key = '0x5f00a94a5ea03fe9272e6f04b5c517297bde4d4ead2d7b1af443971dff2049f1';
// function f(x: Object) {
//   delete x.prop; 
// }
function onlyNumbers(str) {
    var pattern = /[^,0-9]/;
    str = str.replace(pattern, "*");
    str = str.replace(/,0/, ",*");
    var indices = [];
    for (var i = 0; i < str.length; i++) {
        if (str[i] === "*")
            indices.push(i);
    }
    return indices;
}
function getErrorMessage(error) {
    if (error instanceof Error)
        return error.message;
    return String(error);
}
exports.getErrorMessage = getErrorMessage;
class Token_Controller {
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
    //   public async callFunction(callData) {
    //     var callObj = {
    //         to: contractAddress,
    //         data: callData,
    //     }
    //     return await web3.eth.call(callObj);
    // }
    // Get Token (s)
    get_Token(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_lib_1.Logger.getInstance().info(`GET Token  - Accept request from ${req.get('User-Agent')} - ${req.ip}`);
            logger_lib_1.Logger.getInstance().info(`GET Token  - Request with params ${JSON.stringify(req.query)}`);
            var status;
            try {
                // var tokenId_: number[] = []
                // const req_ = JSON.stringify(req.query)
                var array = String(req.query.tokenIds); //Math.round(Math.random() * 5 + 1);
                // console.log(array,typeof array)
                array = array.replace("[", "");
                array = array.replace("]", "");
                const check_array = onlyNumbers(array);
                if (check_array.length != 0) {
                    var err_ = JSON.stringify({ message: "Unexpected number in JSON at position ${check_array[0] +1 }", statusCode: http_status_codes_1.default.INTERNAL_SERVER_ERROR }, null, 2);
                    throw new Error(err_);
                }
                let tokenId_ = array.split(",").map(Number);
                // retrieve token from mySql
                const data_tokens = yield token_model_1.token_db.findAll({
                    attributes: ["templateId", "props", "stardust_tokenId", "name"],
                    where: {
                        stardust_tokenId: tokenId_
                    }
                });
                //Check gameId
                // var gameId_tmp
                // for (var i=0; i<data_tokens.length;i++){
                //   var gameId_ith = await template_ver2_db.findOne({
                //     attributes:["gameId"],
                //     where: {
                //       id:data_tokens[i].templateId
                //     }
                //   })
                //   if ()
                //   console.log(gameId_ith.gameId)
                //   if (i===0){
                //     gameId_tmp = gameId_ith;
                //     continue;
                //   } 
                //   if (gameId_tmp != gameId_ith){
                //     var err_token_found = JSON.stringify({message:"Tokens should belong to the same Game",statusCode: HttpStatus.INTERNAL_SERVER_ERROR}, null, 2) ;
                //     throw  new Error(err_token_found);
                //   } 
                // }
                var data_tmp = [];
                for (var i = 0; i < data_tokens.length; i++) {
                    var new_obj = {
                        templateId: data_tokens[i].templateId,
                        props: data_tokens[i].props,
                        id: data_tokens[i].stardust_tokenId,
                        name: data_tokens[i].name,
                    };
                    data_tmp.push(new_obj);
                }
                var res_test = JSON.stringify(data_tmp, null, 2);
                logger_lib_1.Logger.getInstance().info(`Get Tokens success `);
                res.status(http_status_codes_1.default.OK).send(res_test);
                // }
            }
            catch (err) {
                logger_lib_1.Logger.getInstance().error(`Get Token error`);
                res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send(getErrorMessage(err));
            }
        });
    }
    // Transfer Token (s)
    transfer_token(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_lib_1.Logger.getInstance().info(`Transfer Token - Accept request from ${req.get('User-Agent')} - ${req.ip}`);
            logger_lib_1.Logger.getInstance().info(`Transfer Token- Request with body ${JSON.stringify(req.body)}`);
            var status_error = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
            var message_error;
            try {
                //Check invalid req body
                if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                    status_error = http_status_codes_1.default.BAD_REQUEST;
                    message_error = JSON.stringify({ message: "Invalid request body" }, null, 2);
                    throw new Error(message_error);
                }
                const fromPlayerId = req.body.fromPlayerId;
                const toPlayerId = req.body.toPlayerId;
                const isUuid_from = validator_1.default.isUUID(fromPlayerId, 4);
                const isUuid_to = validator_1.default.isUUID(toPlayerId, 4);
                if (!isUuid_from) {
                    status_error = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
                    message_error = JSON.stringify({ message: "invalid input syntax for type uuid: " + String(fromPlayerId), stack: "error: invalid input syntax for type uuid: " + String(fromPlayerId) }, null, 2);
                    throw new Error(message_error);
                }
                else if (!isUuid_to) {
                    status_error = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
                    message_error = JSON.stringify({ message: "invalid input syntax for type uuid: " + String(toPlayerId), stack: "error: invalid input syntax for type uuid:  " + String(toPlayerId) }, null, 2);
                    throw new Error(message_error);
                }
                //Check self transfer
                if (fromPlayerId === toPlayerId) {
                    status_error = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
                    message_error = JSON.stringify({ message: "Cannot transfer to self", stack: "Error: Cannot transfer to self" }, null, 2);
                    throw new Error(message_error);
                }
                var address_from = "default";
                var address_to = "default";
                const tokenObjects = req.body.tokenObjects;
                const wallet_data_from = yield wallet_model_1.wallet_db.findOne({
                    where: {
                        playerId: fromPlayerId
                    }
                });
                if (wallet_data_from) {
                    address_from = wallet_data_from.Address;
                    // console.log("get wallet of fromplayerId:")
                    // console.log(address_from)
                }
                else {
                    status_error = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
                    message_error = JSON.stringify({ message: "Can not get wallet of fromplayerId", stack: "Error: Can not get wallet of fromplayerId" }, null, 2);
                    throw new Error(message_error);
                }
                const wallet_data_to = yield wallet_model_1.wallet_db.findOne({
                    where: {
                        playerId: toPlayerId
                    }
                });
                if (wallet_data_to) { //Checkl wallet exist
                    address_to = wallet_data_to.Address;
                    // console.log("get wallet of toplayerId:")
                    // console.log(address_to)
                }
                else {
                    status_error = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
                    message_error = JSON.stringify({ message: "Can not get wallet of toplayerId", stack: "Error: Can not get wallet of fromplayerId" }, null, 2);
                    throw new Error(message_error);
                }
                const template_data = yield wallet_model_1.wallet_db.findOne({
                    where: {
                        playerId: toPlayerId
                    }
                });
                if (wallet_data_to) { //Checkl wallet exist
                    address_to = wallet_data_to.Address;
                    // console.log("get wallet of toplayerId:")
                    // console.log(address_to)
                }
                else {
                    status_error = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
                    message_error = JSON.stringify({ message: "Can not get wallet of toplayerId", stack: "Error: Can not get wallet of fromplayerId" }, null, 2);
                    throw new Error(message_error);
                }
                var tokenId_ = [];
                for (var i = 0; i < tokenObjects.length; i++) {
                    tokenId_.push(tokenObjects[i].tokenId);
                }
                var check_owner = true;
                var wrong_tokenID_owner = [];
                var blockchain_tokenId_list = [];
                var contract_address_list = [];
                // Check owner tokenId
                // var check_ = [];
                for (var i = 0; i < tokenObjects.length; i++) {
                    var check_ = yield token_model_1.token_db.findOne({
                        where: {
                            stardust_tokenId: tokenObjects[i].tokenId,
                            playerId: fromPlayerId
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
                        wrong_tokenID_owner.push(tokenObjects[i].tokenId);
                    }
                }
                if (check_owner) {
                    //   // transfer(address_from)
                    // Update DB token_db: playerId
                    for (var i = 0; i < tokenObjects.length; i++) {
                        var result_transfer = yield test_nfts_edge2_copy_1.transfer(address_from, address_to, blockchain_tokenId_list[i], operator1, operator1_key, contract_address_list[i]);
                        // res.send(result_transfer)
                        if (result_transfer) {
                            yield token_model_1.token_db.update({ playerId: toPlayerId }, {
                                where: {
                                    stardust_tokenId: tokenObjects[i].tokenId
                                }
                            });
                        }
                        else {
                            status_error = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
                            message_error = JSON.stringify({ message: "ERROR when TRANSFER Token: " + String(tokenObjects[i].tokenId) }, null, 2);
                            throw new Error(message_error);
                        }
                    }
                    res.status(http_status_codes_1.default.OK).send({});
                }
                else {
                    status_error = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
                    message_error = JSON.stringify({ message: "Player " + String(fromPlayerId) + " does not own token " + String(wrong_tokenID_owner[0]), stack: "Error: Player " + String(fromPlayerId) + " does not own token" + String(wrong_tokenID_owner[0]) }, null, 2);
                    throw new Error(message_error);
                }
            }
            catch (err) {
                logger_lib_1.Logger.getInstance().error(`Transfer token error: ${getErrorMessage(err)}`);
                res.status(status_error).send(getErrorMessage(err));
            }
        });
    }
    // Burn Token(s)
    burn_token(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_lib_1.Logger.getInstance().info(`BURN TOKEN - Accept request from ${req.get('User-Agent')} - ${req.ip}`);
            logger_lib_1.Logger.getInstance().info(`BURN TOKEN - Request with body ${JSON.stringify(req.body)}`);
            var status_error = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
            var message_error;
            try {
                //Check invalid req body
                if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                    status_error = http_status_codes_1.default.BAD_REQUEST;
                    message_error = JSON.stringify({ message: "Invalid request body" }, null, 2);
                    throw new Error(message_error);
                }
                const PlayerId = req.body.playerId;
                const isUuid = validator_1.default.isUUID(PlayerId, 4);
                if (!isUuid) {
                    status_error = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
                    message_error = JSON.stringify({ message: "invalid input syntax for type uuid: " + String(PlayerId), stack: "error: invalid input syntax for type uuid: " + String(PlayerId) }, null, 2);
                    throw new Error(message_error);
                }
                const tokenObjects = req.body.tokenObjects;
                var check_owner = true;
                var wrong_tokenID_owner = [];
                var blockchain_tokenId_list = [];
                var contract_address_list = [];
                var template_list = [];
                // Check owner tokenId
                // var check_ = [];
                for (var i = 0; i < tokenObjects.length; i++) {
                    var check_ = yield token_model_1.token_db.findOne({
                        where: {
                            stardust_tokenId: tokenObjects[i].tokenId,
                            playerId: PlayerId
                        }
                    });
                    if (check_) {
                        blockchain_tokenId_list[i] = check_.blockchain_tokenId;
                        template_list[i] = check_.templateId;
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
                    }
                    else {
                        check_owner = false;
                        wrong_tokenID_owner.push(tokenObjects[i].tokenId);
                    }
                }
                if (check_owner) {
                    // Update DB token_db: playerId
                    for (var i = 0; i < tokenObjects.length; i++) {
                        var result_burn = yield test_nfts_edge2_copy_1.burn(operator1, operator1_key, blockchain_tokenId_list[i], contract_address_list[i]);
                        if (result_burn) {
                            yield token_model_1.token_db.destroy({
                                where: {
                                    stardust_tokenId: tokenObjects[i].tokenId
                                }
                            });
                            // Update totalSupply in template DB
                            yield update_totalSuply(-1, Number(template_list[i]));
                        }
                        else {
                            status_error = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
                            message_error = JSON.stringify({ message: "Burn Token on blockchain error: ID" + String(tokenObjects[i].tokenId),
                                stack: "Error: Burn Token on blockchain error: ID" + String(tokenObjects[i].tokenId) }, null, 2);
                            throw new Error(message_error);
                        }
                    }
                    res.status(http_status_codes_1.default.OK).send({});
                }
                else {
                    status_error = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
                    message_error = JSON.stringify({ message: "Player does not own token", stack: "Error: Player does not own token" }, null, 2);
                    throw new Error(message_error);
                }
            }
            catch (err) {
                logger_lib_1.Logger.getInstance().error(`Burn token error: ${getErrorMessage(err)}`);
                res.status(status_error).send(getErrorMessage(err));
            }
        });
    }
    // Bulk Mint Tokens
    bulk_mint_token(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_lib_1.Logger.getInstance().info(`BULK MINT TOKEN - Accept request from ${req.get('User-Agent')} - ${req.ip}`);
            logger_lib_1.Logger.getInstance().info(`BULK MINT TOKEN - Request with body ${JSON.stringify(req.body)}`);
            var status_error = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
            var message_error;
            try {
                const playerId = req.body.playerId;
                const isUuid = validator_1.default.isUUID(playerId, 4);
                if (!isUuid) {
                    status_error = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
                    message_error = JSON.stringify({ message: "invalid input syntax for type uuid: " + String(playerId), stack: "error: invalid input syntax for type uuid: " + String(playerId) }, null, 2);
                    throw new Error(message_error);
                }
                const tokenObjects = req.body.tokenObjects;
                // Check exist token in DB
                var list_blockchain_Id = [];
                var list_contractAdderss = [];
                var list_templateID = [];
                for (var i = 0; i < tokenObjects.length; i++) {
                    list_blockchain_Id.push(tokenObjects[i].props.immutable.blockchainTokenId);
                    list_contractAdderss.push(tokenObjects[i].props.immutable.blockchainContractAddress);
                    list_templateID.push(tokenObjects[i].templateId);
                }
                // Check token in token_db
                const data_check_exist_bcID = yield token_model_1.token_db.findAll({
                    attributes: ["blockchain_tokenId", "props"],
                    where: {
                        blockchain_tokenId: list_blockchain_Id,
                        templateId: list_templateID
                    }
                });
                // console.log("OK here")
                if (data_check_exist_bcID.length != 0) {
                    status_error = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
                    const ID_exist = data_check_exist_bcID[0].blockchain_tokenId;
                    message_error = JSON.stringify({ message: "Found existed token in DB: " + String(ID_exist), statusCode: 500 }, null, 2);
                    throw new Error(message_error);
                }
                // Get contractAddress data
                const data_contractAddress = yield template2_model_1.template_ver2_db.findAll({
                    attributes: ["ContractAddress"],
                    where: {
                        id: list_templateID
                    }
                });
                if (data_contractAddress.length != 0) {
                    // console.log(data_contractAddress)
                    var list_contractAdderss_withdraw = [];
                    for (var contract_add = 0; contract_add < data_contractAddress.length; contract_add++) {
                        // console.log(data_contractAddress[0].ContractAddress)
                        list_contractAdderss_withdraw.push(data_contractAddress[contract_add].ContractAddress);
                    }
                    // Check token in token_db
                    const check_exist_bcID_withdrawDB = yield withdraw_token_model_1.withdrawn_token_db.findAll({
                        attributes: ["tokenID", "contractAddress"],
                        where: {
                            tokenID: list_blockchain_Id,
                            contractAddress: list_contractAdderss_withdraw
                        }
                    });
                    // console.log(`check_exist_bcID_withdrawDB ${check_exist_bcID_withdrawDB}, ${list_contractAdderss_withdraw}`)
                    if (check_exist_bcID_withdrawDB.length != 0) {
                        status_error = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
                        const ID_exist_Withdraw_DB = check_exist_bcID_withdrawDB[0].tokenID;
                        message_error = JSON.stringify({ message: `Found existed token in Withdraw_DB: ${ID_exist_Withdraw_DB} - contractAddress: ${check_exist_bcID_withdrawDB[0].contractAddress}`, statusCode: 500 }, null, 2);
                        throw new Error(message_error);
                    }
                }
                for (var i = 0; i < tokenObjects.length; i++) {
                    var stardust_tokenId; //= Math.floor(100000 + Math.random() * 900000);
                    var props = tokenObjects[i].props;
                    var blockchain_tokenId = props.immutable.blockchainTokenId;
                    var name;
                    var contractAddress_;
                    var wallet_address;
                    var templateId = tokenObjects[i].templateId;
                    const template_data = yield template2_model_1.template_ver2_db.findOne({
                        where: {
                            id: templateId
                        }
                    });
                    const wallet_data = yield wallet_model_1.wallet_db.findOne({
                        where: {
                            playerId: playerId
                        }
                    });
                    if (wallet_data) {
                        wallet_address = wallet_data.Address;
                        // mint(playerId,,3);
                        if (template_data) {
                            name = template_data.Name;
                            contractAddress_ = template_data.ContractAddress;
                            var amount = tokenObjects[i].amount;
                            var props_tmp = {
                                inherited: props.inherited,
                                immutable: {
                                    blockchain_token_id: blockchain_tokenId,
                                    blockchain_contract_address: contractAddress_
                                },
                                mutable: props.mutable
                            };
                            // Add new Token
                            var newToken = yield new token_model_1.token_db({
                                playerId: playerId,
                                // stardust_tokenId: 0,
                                props: props_tmp,
                                name: name,
                                templateId: templateId,
                                amount: amount,
                                blockchain_tokenId: blockchain_tokenId
                            }).save();
                            // Send response
                            if (newToken) {
                                var result_mint = yield test_nfts_edge2_copy_1.mint(operator1, operator1_key, wallet_address, blockchain_tokenId, '', contractAddress_);
                                if (!result_mint) {
                                    // Delete token just added to DB
                                    yield token_model_1.token_db.destroy({
                                        where: {
                                            blockchain_tokenId: blockchain_tokenId,
                                            templateId: templateId
                                        }
                                    });
                                    status_error = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
                                    message_error = JSON.stringify({ message: "ERROR when Mint Token" }, null, 2);
                                    throw new Error(message_error);
                                }
                                else {
                                    // Update totalSuply
                                    yield update_totalSuply(1, templateId);
                                    var new_token = yield token_model_1.token_db.findOne({
                                        where: { blockchain_tokenId: blockchain_tokenId }
                                    });
                                    // console.log(new_token)
                                    var stardust_ID_new = new_token === null || new_token === void 0 ? void 0 : new_token.stardust_tokenId;
                                    logger_lib_1.Logger.getInstance().info(`Add Token success. Token id ${stardust_ID_new}`);
                                }
                            }
                            else {
                                logger_lib_1.Logger.getInstance().error(`Add Token error`);
                                res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send(JSON.stringify({ status: http_status_codes_1.default.INTERNAL_SERVER_ERROR, message: "Add Token error" }, null, 2));
                            }
                        }
                        else {
                            logger_lib_1.Logger.getInstance().error(`GET Template DATA error`);
                            res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send(JSON.stringify({ status: http_status_codes_1.default.INTERNAL_SERVER_ERROR, message: "GET Template error" }, null, 2));
                        }
                    }
                    else {
                        status_error = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
                        var err_user = JSON.stringify({ message: "User not found", stack: "User not found" }, null, 2);
                        throw new Error(err_user);
                    }
                }
                res.status(http_status_codes_1.default.OK).send({});
                // res.send(ownerOf(1))
            }
            catch (err) {
                logger_lib_1.Logger.getInstance().error(`Bulk mint token error: ${getErrorMessage(err)}`);
                res.status(status_error).send(getErrorMessage(err));
            }
        });
    }
    // Mutate Token
    mutate_token(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_lib_1.Logger.getInstance().info(`MUTATE TOKEN - Accept request from ${req.get('User-Agent')} - ${req.ip}`);
            logger_lib_1.Logger.getInstance().info(`MUTATE TOKEN - Request with body ${JSON.stringify(req.body)}`);
            var status_error = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
            var message_error;
            try {
                //Check invalid req body
                if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                    status_error = http_status_codes_1.default.BAD_REQUEST;
                    message_error = JSON.stringify({ message: "Invalid request body" }, null, 2);
                    logger_lib_1.Logger.getInstance().error(`PUT TEMPLATE MUTATE FAILED: ${message_error}`);
                    res.status(status_error).send(getErrorMessage(message_error));
                    throw new Error(message_error);
                }
                // Get request params
                const tokenId = req.body.tokenId;
                const props = req.body.props;
                // Retrieve data from mySql
                const data = yield token_model_1.token_db.findOne({
                    where: {
                        stardust_tokenId: tokenId
                    }
                });
                // Modify data
                const token_props = data === null || data === void 0 ? void 0 : data.props;
                const props_json = JSON.stringify(token_props);
                const props_parsed = JSON.parse(props_json);
                const mutable_props = props_parsed.mutable;
                for (let key of Object.keys(props)) {
                    mutable_props[key] = props[key];
                }
                // Save to object
                props_parsed.mutable = mutable_props;
                // Update to database
                const update_result = yield token_model_1.token_db.update({ props: props_parsed }, {
                    where: { stardust_tokenId: tokenId }
                });
                // Send response
                if (update_result) {
                    logger_lib_1.Logger.getInstance().info(`MUTATE TOKEN SUCCESS`);
                    res.status(http_status_codes_1.default.OK).send({});
                }
                else {
                    status_error = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
                    message_error = JSON.stringify({ message: "UPDATE TOKEN PROPERTIES FAILED", stack: "Error: UPDATE TOKEN PROPERTIES FAILED" }, null, 2);
                    throw new Error(message_error);
                }
            }
            catch (err) {
                logger_lib_1.Logger.getInstance().error(`Mutate token error: ${err}`);
                res.status(status_error).send(getErrorMessage(err));
            }
        });
    }
    // Remove Token Property
    remove_property_token(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_lib_1.Logger.getInstance().info(`REMOVE TOKEN - Accept request from ${req.get('User-Agent')} - ${req.ip}`);
            logger_lib_1.Logger.getInstance().info(`REMOVE TOKEN - Request with body ${JSON.stringify(req.body)}`);
            var status_error = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
            var message_error;
            try {
                // Get params from request
                const tokenID = req.query.tokenId;
                const props_to_remove = JSON.parse(String(req.query.props));
                // Retrieve data from mySql
                const data = yield token_model_1.token_db.findOne({
                    where: {
                        stardust_tokenId: tokenID
                    }
                });
                // Modify data
                const token_props = data === null || data === void 0 ? void 0 : data.props;
                const props_json = JSON.stringify(token_props);
                const props_parsed = JSON.parse(props_json);
                let mutable_props = props_parsed.mutable;
                for (let key of props_to_remove) {
                    delete mutable_props[key];
                }
                // Save to object
                props_parsed.mutable = mutable_props;
                // Update to database
                const update_result = yield template2_model_1.template_ver2_db.update({ Props: props_parsed }, {
                    where: { stardust_tokenId: tokenID }
                });
                // Send response
                if (update_result) {
                    logger_lib_1.Logger.getInstance().info(`DELETE TOKEN PROPERTIES SUCCESS`);
                    res.status(http_status_codes_1.default.OK).send(mutable_props);
                }
                else {
                    status_error = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
                    message_error = JSON.stringify({ message: "REMOVE TOKEN PROPERTIES FAILED", stack: "Error: REMOVE TOKEN PROPERTIES FAILED" }, null, 2);
                    throw new Error(message_error);
                }
            }
            catch (err) {
                logger_lib_1.Logger.getInstance().error(`REMOVE TOKEN PROPERTIES error: ${err}`);
                res.status(status_error).send(getErrorMessage(err));
            }
        });
    }
}
exports.Token_Controller = Token_Controller;
//# sourceMappingURL=token.controller.js.map