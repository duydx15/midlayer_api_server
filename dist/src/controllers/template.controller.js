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
exports.Template_Controller = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const enums_1 = require("@/helper/enums");
const logger_lib_1 = require("@/lib/logger.lib");
const template_model_1 = require("@/models/template.model");
// import { player_db } from '@/models/player.model';
class Template_Controller {
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
    // Create Template
    add_Template(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_lib_1.Logger.getInstance().info(`POST ADD TEMPLATE - Accept request from ${req.get('User-Agent')} - ${req.ip}`);
            logger_lib_1.Logger.getInstance().info(`POST ADD TEMPLATE - Request with body ${JSON.stringify(req.body)}`);
            try {
                const cap = req.body.cap;
                const image = req.body.image;
                const id = req.body.id; //Math.floor(1000 + Math.random() * 9000);
                const props = req.body.props;
                const type = req.body.type;
                const totalSupply = req.body.totalSupply;
                const gameId = req.body.gameId;
                const name = req.body.name;
                // res.send(req.body.blockchain_contract_address)
                const blockchain_contract_address_ = req.body.blockchain_contract_address;
                console.log(req.body.blockchain_contract_address);
                console.log(req.body);
                // Create new PlayerData
                const new_template = yield new template_model_1.template_db({
                    id: id,
                    name: name,
                    image: image,
                    gameId: gameId,
                    cap: cap,
                    totalSupply: totalSupply,
                    type: type,
                    blockchain_contract_address: blockchain_contract_address_,
                    props: props
                }).save();
                console.log('New template: ', new_template.toJSON());
                // Send response
                if (new_template) {
                    logger_lib_1.Logger.getInstance().info(`Add TEMPLATE success - id: ${id} `);
                    res.status(http_status_codes_1.default.OK).send({ status: enums_1.ReturnCode.Success, result: new_template });
                }
                else {
                    logger_lib_1.Logger.getInstance().error(`Add TEMPLATE error`);
                    res.status(http_status_codes_1.default.BAD_REQUEST).send({ status: enums_1.ReturnCode.Error, result: "Add TEMPLATE error" });
                }
            }
            catch (err) {
                logger_lib_1.Logger.getInstance().error(`Add user reject: ${err}`);
                res.status(http_status_codes_1.default.NOT_ACCEPTABLE).send({ status: enums_1.ReturnCode.Error, error: err });
            }
        });
    }
    // Get Template
    get_Template(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_lib_1.Logger.getInstance().info(`GET template - Accept request from ${req.get('User-Agent')} - ${req.ip}`);
            logger_lib_1.Logger.getInstance().info(`GET template - Request with body ${JSON.stringify(req.body)}`);
            try {
                const templateId = Number(req.query.templateId);
                const data = yield template_model_1.template_db.findOne({
                    where: {
                        id: templateId
                    }
                });
                if (data) {
                    logger_lib_1.Logger.getInstance().info(`GET Template success. id ${templateId}`);
                    res.status(http_status_codes_1.default.OK).send(data);
                }
                else {
                    logger_lib_1.Logger.getInstance().error(`GET Template error`);
                    res.status(http_status_codes_1.default.BAD_REQUEST).send({ status: enums_1.ReturnCode.Error, result: "GET Template error" });
                }
            }
            catch (err) {
                logger_lib_1.Logger.getInstance().error(`GET template reject: ${err}`);
                res.status(http_status_codes_1.default.NOT_ACCEPTABLE).send({ status: enums_1.ReturnCode.Error, error: err });
            }
        });
    }
    // Get All Templates
    get_all_Templates(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_lib_1.Logger.getInstance().info(`GET All templates - Accept request from ${req.get('User-Agent')} - ${req.ip}`);
            logger_lib_1.Logger.getInstance().info(`GET All templates  - Request with body ${JSON.stringify(req.body)}`);
            try {
                const filter = req.query.filter;
                const start = Number(req.query.start);
                const limit = Number(req.query.limit);
                if (filter == undefined) {
                    yield template_model_1.template_db.findAll({
                        offset: start,
                        limit: limit
                    }).then(data => res.send(data));
                }
                else if (filter !== undefined) {
                    res.send("Filter can use");
                }
            }
            catch (err) {
                logger_lib_1.Logger.getInstance().error(`Get All templates  reject: ${err}`);
                res.status(http_status_codes_1.default.NOT_ACCEPTABLE).send({ status: enums_1.ReturnCode.Error, error: err });
            }
        });
    }
    // Get Template Count
    get_Template_Count(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_lib_1.Logger.getInstance().info(`GET templates count  - Accept request from ${req.get('User-Agent')} - ${req.ip}`);
            logger_lib_1.Logger.getInstance().info(`GET templates count - Request with body ${JSON.stringify(req.body)}`);
            try {
            }
            catch (err) {
                logger_lib_1.Logger.getInstance().error(`GET templates count countreject: ${err}`);
                res.status(http_status_codes_1.default.NOT_ACCEPTABLE).send({ status: enums_1.ReturnCode.Error, error: err });
            }
        });
    }
    // Get Tokens
    get_Tokens(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_lib_1.Logger.getInstance().info(`GET Tokens - Accept request from ${req.get('User-Agent')} - ${req.ip}`);
            logger_lib_1.Logger.getInstance().info(`GET Tokens - Request with body ${JSON.stringify(req.body)}`);
            try {
            }
            catch (err) {
                logger_lib_1.Logger.getInstance().error(`GET Tokens reject: ${err}`);
                res.status(http_status_codes_1.default.NOT_ACCEPTABLE).send({ status: enums_1.ReturnCode.Error, error: err });
            }
        });
    }
    // Mutate Template
    mutate_Template(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_lib_1.Logger.getInstance().info(`PUT Template - Accept request from ${req.get('User-Agent')} - ${req.ip}`);
            logger_lib_1.Logger.getInstance().info(`PUT Template - Request with body ${JSON.stringify(req.body)}`);
            try {
            }
            catch (err) {
                logger_lib_1.Logger.getInstance().error(`PUT Template reject: ${err}`);
                res.status(http_status_codes_1.default.NOT_ACCEPTABLE).send({ status: enums_1.ReturnCode.Error, error: err });
            }
        });
    }
    // Remove Template
    remove_Template(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_lib_1.Logger.getInstance().info(`DELETE Template- Accept request from ${req.get('User-Agent')} - ${req.ip}`);
            logger_lib_1.Logger.getInstance().info(`DELETE Template - Request with body ${JSON.stringify(req.body)}`);
            try {
                const templateId = Number(req.query.templateId);
                // templateId = templateId.map(Number)
                // templateId = templateId.map(Number)
                // templateId = Number(templateId)
                yield template_model_1.template_db.destroy({
                    where: {
                        id: templateId
                    }
                });
                res.send({});
            }
            catch (err) {
                logger_lib_1.Logger.getInstance().error(`DELETE Template reject: ${err}`);
                res.status(http_status_codes_1.default.NOT_ACCEPTABLE).send({ status: enums_1.ReturnCode.Error, error: String(err) });
            }
        });
    }
    // Remove Template Property
    remove_Template_property(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_lib_1.Logger.getInstance().info(`DELETE Template Property - Accept request from ${req.get('User-Agent')} - ${req.ip}`);
            logger_lib_1.Logger.getInstance().info(`DELETE Template Property - Request with body ${JSON.stringify(req.body)}`);
            try {
            }
            catch (err) {
                logger_lib_1.Logger.getInstance().error(`DELETE Template Property reject: ${err}`);
                res.status(http_status_codes_1.default.NOT_ACCEPTABLE).send({ status: enums_1.ReturnCode.Error, error: err });
            }
        });
    }
}
exports.Template_Controller = Template_Controller;
//# sourceMappingURL=template.controller.js.map