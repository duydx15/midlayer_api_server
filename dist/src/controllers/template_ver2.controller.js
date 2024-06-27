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
exports.Template_Ver2_Controller = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sequelize_1 = require("sequelize");
const validator_1 = __importDefault(require("validator"));
const logger_lib_1 = require("@/lib/logger.lib");
const template2_model_1 = require("@/models/template2.model");
const index_1 = __importDefault(require("@/models/index"));
const contractAddress_1 = "0x3C46A8127083EF698A32daDdB6Bc9b919612F207";
const contractAddress_2 = "0x25BE07479146D3a032D0aCEb06e8a2D8E1AAC762";
const contractAddress_3 = "0x58fF7f8EA3ba7dfe74952A1082cCd8B95aad9a9B";
class Template_Ver2_Controller {
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
    /* POST create Template */
    PostCreateTemplate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_lib_1.Logger.getInstance().info(`POST CREATE TEMPLATE - Accept request from ${req.get('User-Agent')} - ${req.ip}`);
            logger_lib_1.Logger.getInstance().info(`POST CREATE TEMPLATE - Request with body ${JSON.stringify(req.body)}`);
            try {
                // Get request params
                const templateName = req.body.name;
                const templateCap = req.body.cap;
                const templateType = req.body.type;
                const templateProps = req.body.props;
                const templateContractAddress = req.body.contractAddress;
                // Check invalid req body
                if (templateName == null || templateCap == null || templateType == null || templateProps == null || templateContractAddress == null) {
                    let errMessage = "Invalid Request Body. Please include: ";
                    if (templateName == null) {
                        errMessage += "templateName, ";
                    }
                    if (templateCap == null) {
                        errMessage += "templateCap, ";
                    }
                    if (templateType == null) {
                        errMessage += "templateType, ";
                    }
                    if (templateProps == null) {
                        errMessage += "templateProps, ";
                    }
                    if (templateContractAddress == null) {
                        errMessage += "contractAddress, ";
                    }
                    errMessage += "in your request body.";
                    let err = new Error(errMessage);
                    err.name = "InvalidRequestBody";
                    throw err;
                }
                // Check if name is duplicated
                const checkName = yield template2_model_1.template_ver2_db.findOne({
                    where: {
                        Name: templateName
                    }
                });
                if (checkName) {
                    const err = new Error(`templateName: ${templateName} is already in use. Please choose another name`);
                    err.name = "DuplicateDataError";
                    throw err;
                }
                // Check if contractAddress is duplicated
                const checkContractAddress = yield template2_model_1.template_ver2_db.findOne({
                    where: {
                        ContractAddress: templateContractAddress
                    }
                });
                if (checkContractAddress) {
                    const err = new Error(`contractAddress: ${templateContractAddress} existed. Please choose another contractAddress`);
                    err.name = "DuplicateDataError";
                    throw err;
                }
                // Check if contractAddress is a valid address
                const checkContractAddressValid = validator_1.default.isEthereumAddress(templateContractAddress);
                if (!checkContractAddressValid) {
                    const err = new Error(`contractAddress: ${templateContractAddress} is not a valid eth address`);
                    err.name = "ValidDataError";
                    throw err;
                }
                // Fake data
                const templateGameId = 1;
                const templateRoyalty = 0;
                const templateActiveListing = false;
                const templateContractType = 'internal-mint';
                const templateFees = {
                    "feePercentage": 0,
                    "feeType": "game_royalty"
                };
                const templateImage = "https://sd-game-assets.s3.amazonaws.com/game_1/templates/2203";
                // const templateContractAddress = "0x3C46A8127083EF698A32daDdB6Bc9b919612F207" // Contract address 1
                // const templateContractAddress = "0x58fF7f8EA3ba7dfe74952A1082cCd8B95aad9a9B" // Contract address 2
                // Create new template on database
                const create_template = yield new template2_model_1.template_ver2_db({
                    GameId: templateGameId,
                    Cap: templateCap,
                    Name: templateName,
                    Type: templateType,
                    Props: templateProps,
                    Royalty: templateRoyalty,
                    ActiveListing: templateActiveListing,
                    TemplateContractType: templateContractType,
                    Fees: templateFees,
                    Image: templateImage,
                    ContractAddress: templateContractAddress
                }).save();
                if (create_template) {
                    logger_lib_1.Logger.getInstance().info(`POST CREATE TEMPLATE success: `);
                    // Get the new created id
                    const new_template = yield template2_model_1.template_ver2_db.findOne({
                        where: { name: templateName }
                    });
                    const new_id = new_template === null || new_template === void 0 ? void 0 : new_template.Id;
                    if (new_id) {
                        logger_lib_1.Logger.getInstance().info(`TEMPLATE ID: ${new_id}`);
                        res.status(http_status_codes_1.default.OK).send(JSON.stringify({ id: new_id }, null, 2));
                    }
                    else {
                        const err = new Error("Create Template success but cannot retrieve for new Id");
                        err.name = "InternalServerError";
                        throw err;
                    }
                }
                else {
                    logger_lib_1.Logger.getInstance().error(`POST CREATE TEMPLATE error`);
                    const err = new Error("Create Template failed.");
                    err.name = "InternalServerError";
                    throw err;
                }
            }
            catch (err) {
                if (err.name == "InvalidRequestBody") {
                    logger_lib_1.Logger.getInstance().error(`POST CREATE TEMPLATE FAILED: ${err}`);
                    res.status(400).send(JSON.stringify({ "message": "Invalid Request Body" }, null, 2));
                }
                else if (err.name == "DuplicateDataError") {
                    logger_lib_1.Logger.getInstance().error(`POST CREATE TEMPLATE FAILED: ${err}`);
                    res.status(500).send(JSON.stringify({ "error": "Duplicate Data Error", "message": err.message }, null, 2));
                }
                else if (err.name == "ValidDataError") {
                    logger_lib_1.Logger.getInstance().error(`POST CREATE TEMPLATE FAILED: ${err}`);
                    res.status(500).send(JSON.stringify({ "error": "Valid Data Error", "message": err.message }, null, 2));
                }
                else if (err.name == "InternalServerError") {
                    logger_lib_1.Logger.getInstance().error(`POST CREATE TEMPLATE FAILED: ${err}`);
                    res.status(500).send(JSON.stringify({ "error": "Internal Server Error", "message": err.message }, null, 2));
                }
                else {
                    logger_lib_1.Logger.getInstance().error(`POST CREATE TEMPLATE FAILED: ${err}`);
                    res.status(500).send(JSON.stringify({ "message": err.message, "stack": err.stack }, null, 2));
                }
            }
        });
    }
    /* GET template */
    GetTemplate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_lib_1.Logger.getInstance().info(`GET TEMPLATE - Accept request from ${req.get('User-Agent')} - ${req.ip}`);
            logger_lib_1.Logger.getInstance().info(`GET TEMPLATE - Request with params ${JSON.stringify(req.query)}`);
            try {
                // Get request params
                const templateId = req.query.templateId;
                if (templateId == null) {
                    const err = new Error("Invalid Request Body");
                    err.name = "InvalidRequestBody";
                    throw err;
                }
                // Query for data
                const data = yield index_1.default.query(`SELECT gameId, cap, name, type, props, id,\
        totalSupply, royalty, contractAddress AS blockchain_contract_address,\
        activeListing, metadata,\
        templateContractType as template_contract_type,\
        fees, image\
        FROM template\
        WHERE template.id = ${templateId}`, { type: sequelize_1.QueryTypes.SELECT });
                if (!data.length) {
                    const message_error = JSON.stringify({ message: "Unable to find template by templateId:" + String(templateId) + " in game: " + String(1),
                        statusCode: http_status_codes_1.default.BAD_REQUEST,
                        errorCode: "template_validation_error",
                        displayMessage: "" }, null, 2);
                    const err = new Error(message_error);
                    err.name = "TemplateIdNotFound";
                    throw err;
                }
                logger_lib_1.Logger.getInstance().info(`GET TEMPLATE success`);
                res.status(http_status_codes_1.default.OK).send(JSON.stringify(data[0], null, 2));
            }
            catch (err) {
                if (err.name == "InvalidRequestBody") {
                    logger_lib_1.Logger.getInstance().error(`GET ALL TEMPLATES FAILED: ${err}`);
                    res.status(400).send(JSON.stringify({ "message": "Invalid Request Body" }, null, 2));
                }
                else if (err.name == "TemplateIdNotFound") {
                    logger_lib_1.Logger.getInstance().error(`GET ALL TEMPLATES FAILED: ${err}`);
                    res.status(500).send(err.message);
                }
                else {
                    logger_lib_1.Logger.getInstance().error(`GET TEMPLATE FAILED: ${err}`);
                    res.status(500).send(JSON.stringify({ "message": err.message, "stack": err.stack }, null, 2));
                }
            }
        });
    }
    /* GET all templates */
    GetAllTemplates(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_lib_1.Logger.getInstance().info(`GET ALL TEMPLATES - Accept request from ${req.get('User-Agent')} - ${req.ip}`);
            logger_lib_1.Logger.getInstance().info(`GET ALL TEMPLATES - Request with params ${JSON.stringify(req.query)}`);
            try {
                // Get request params
                const limit = req.query.limit;
                const offset = req.query.start;
                let filter = String(req.query.filter);
                if (limit == null || offset == null) {
                    const err = new Error("Invalid Request Body");
                    err.name = "InvalidRequestBody";
                    throw err;
                }
                let sql = `SELECT gameId, cap, name, type, props, id, totalSupply, royalty,\
                  contractAddress AS blockchain_contract_address, activeListing, metadata,\
                  templateContractType AS template_contract_type, fees, image\
                  FROM template ORDER BY template.id DESC\
                  LIMIT ${offset},${limit}`;
                if (filter != "") {
                    filter = "'%" + filter.slice(1, -1) + "%'";
                    sql = `SELECT gameId, cap, name, type, props, id, totalSupply, royalty,\
                contractAddress AS blockchain_contract_address, activeListing, metadata,\
                templateContractType AS template_contract_type, fees, image\
                FROM template\
                WHERE name NOT LIKE ${filter}\
                ORDER BY template.id DESC\
                LIMIT ${offset},${limit}`;
                }
                // Logger.getInstance().info(sql)
                const data = yield index_1.default.query(sql, { type: sequelize_1.QueryTypes.SELECT });
                logger_lib_1.Logger.getInstance().info(`GET ALL TEMPLATES success`);
                res.status(http_status_codes_1.default.OK).send(JSON.stringify(data, null, 2));
            }
            catch (err) {
                if (err.name == "InvalidRequestBody") {
                    logger_lib_1.Logger.getInstance().error(`GET ALL TEMPLATES FAILED: ${err}`);
                    res.status(400).send(JSON.stringify({ "message": "Invalid Request Body" }, null, 2));
                }
                else {
                    logger_lib_1.Logger.getInstance().error(`GET ALL TEMPLATES FAILED: ${err}`);
                    res.status(500).send(JSON.stringify({ "message": err.message, "stack": err.stack }, null, 2));
                }
            }
        });
    }
    /* GET Template Count */
    GetTemplateCount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_lib_1.Logger.getInstance().info(`GET TEMPLATE COUNT - Accept request from ${req.get('User-Agent')} - ${req.ip}`);
            logger_lib_1.Logger.getInstance().info(`GET TEMPLATE COUNT - Request with query ${JSON.stringify(req.query)}`);
            try {
                // Get request params
                let filter = String(req.query.filter);
                let sql = `SELECT COUNT(name) AS count FROM template`;
                if (filter != "") {
                    filter = "'%" + filter.slice(1, -1) + "%'";
                    sql = `SELECT COUNT(name) AS count FROM template WHERE name NOT LIKE ${filter}`;
                }
                // Query for data
                const data = yield index_1.default.query(sql, { type: sequelize_1.QueryTypes.SELECT });
                logger_lib_1.Logger.getInstance().info(`GET TEMPLATE COUNT success`);
                res.status(http_status_codes_1.default.OK).send(JSON.stringify(data[0], null, 2));
            }
            catch (err) {
                logger_lib_1.Logger.getInstance().error(`GET TEMPLATE COUNT FAILED: ${err}`);
                res.status(500).send(JSON.stringify({ "message": err.message, "stack": err.stack }, null, 2));
            }
        });
    }
    /* GET Tokens */
    GetTokens(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_lib_1.Logger.getInstance().info(`TEMPLATE GET TOKENS - Accept request from ${req.get('User-Agent')} - ${req.ip}`);
            logger_lib_1.Logger.getInstance().info(`TEMPLATE GET TOKENS - Request with params ${JSON.stringify(req.query)}`);
            var status_error = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
            var message_error;
            try {
                // Get request params
                const templateId = req.query.templateId;
                const start = Number(req.query.start);
                const limit = Number(req.query.limit);
                if (templateId == null) {
                    const err = new Error("Invalid Request Body");
                    err.name = "InvalidRequestBody";
                    throw err;
                }
                let sql_query = `SELECT JSON_ARRAYAGG(JSON_OBJECT('token', JSON_OBJECT('id', token_db.stardust_tokenId, 'amount', token_db.amount),\
        'player', JSON_OBJECT('id', Player.playerId, 'uniqueId', Player.uniqueId)))\
        FROM token_db LEFT JOIN Player  ON token_db.playerId = Player.playerId WHERE token_db.templateId = ${templateId}`;
                const data = yield index_1.default.query(sql_query, { type: sequelize_1.QueryTypes.SELECT });
                logger_lib_1.Logger.getInstance().info(`TEMPLATE GET TOKENS success`);
                if (start) {
                    if (limit) {
                        res.status(http_status_codes_1.default.OK).send(JSON.stringify(Object.values(data[0])[0].slice(start, start + limit), null, 2));
                    }
                    else {
                        res.status(http_status_codes_1.default.OK).send(JSON.stringify(Object.values(data[0])[0].slice(start), null, 2));
                    }
                }
                else {
                    if (limit) {
                        res.status(http_status_codes_1.default.OK).send(JSON.stringify(Object.values(data[0])[0].slice(0, limit), null, 2));
                    }
                    else {
                        res.status(http_status_codes_1.default.OK).send(JSON.stringify(Object.values(data[0])[0], null, 2));
                    }
                }
            }
            catch (err) {
                if (err.name == "InvalidRequestBody") {
                    logger_lib_1.Logger.getInstance().error(`TEMPLATE GET TOKENS FAILED: ${err}`);
                    res.status(400).send(JSON.stringify({ "message": "Invalid Request Body" }, null, 2));
                }
                else {
                    logger_lib_1.Logger.getInstance().error(`TEMPLATE GET TOKENS FAILED: ${err}`);
                    res.status(500).send(JSON.stringify({ "message": err.message, "stack": err.stack }, null, 2));
                }
            }
        });
    }
    /* DELETE template */
    DeleteTemplate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_lib_1.Logger.getInstance().info(`DELETE TEMPLATE - Accept request from ${req.get('User-Agent')} - ${req.ip}`);
            logger_lib_1.Logger.getInstance().info(`DELETE TEMPLATE - Request with query ${JSON.stringify(req.query)}`);
            try {
                // Get request params
                const templateId = req.query.templateId;
                if (templateId == null) {
                    const err = new Error("Invalid Request Body");
                    err.name = "InvalidRequestBody";
                    throw err;
                }
                const sql_query = `DELETE FROM template WHERE id = ${templateId}`;
                const [results, metadata] = yield index_1.default.query(sql_query);
                const metadata_json = JSON.stringify(metadata);
                const metadata_parsed = JSON.parse(metadata_json);
                const affectedRows = metadata_parsed.affectedRows;
                // if (affectedRows) {
                res.status(http_status_codes_1.default.OK).send({});
                // } 
                // else {
                //   res.status(HttpStatus.OK).send({
                //     "message": `Template ${templateId} does not exist in Game: 1`,
                //     "statusCode": 400,
                //     "errorCode": "template_validation_error",
                //     "displayMessage": ""
                //   })
                // }
            }
            catch (err) {
                if (err.name == "InvalidRequestBody") {
                    logger_lib_1.Logger.getInstance().error(`DELETE TEMPLATE FAILED: ${err}`);
                    res.status(400).send(JSON.stringify({ "message": "Invalid Request Body" }, null, 2));
                }
                else {
                    logger_lib_1.Logger.getInstance().error(`DELETE TEMPLATE FAILED: ${err}`);
                    res.status(500).send(JSON.stringify({ "message": err.message, "stack": err.stack }, null, 2));
                }
            }
        });
    }
    /* PUT template mutate */
    putTemplateMutate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_lib_1.Logger.getInstance().info(`PUT TEMPLATE MUTATE - Accept request from ${req.get('User-Agent')} - ${req.ip}`);
            logger_lib_1.Logger.getInstance().info(`PUT TEMPLATE MUTATE - Request with body ${JSON.stringify(req.body)}`);
            try {
                // Get request params
                const templateId = req.body.templateId;
                const props = req.body.props;
                if (templateId == null || props == null) {
                    const err = new Error("Invalid Request Body");
                    err.name = "InvalidRequestBody";
                    throw err;
                }
                // Retrieve data from mySql
                const data = yield template2_model_1.template_ver2_db.findOne({
                    where: {
                        Id: templateId
                    }
                });
                // Modify data
                const template_props = data === null || data === void 0 ? void 0 : data.Props;
                const props_json = JSON.stringify(template_props);
                const props_parsed = JSON.parse(props_json);
                const mutable_props = props_parsed.mutable;
                for (let key of Object.keys(props)) {
                    mutable_props[key] = props[key];
                }
                // Save to object
                props_parsed.mutable = mutable_props;
                // Update to database
                const update_result = yield template2_model_1.template_ver2_db.update({ Props: props_parsed }, {
                    where: { Id: templateId }
                });
                // Send response
                if (update_result) {
                    logger_lib_1.Logger.getInstance().info(`PUT TEMPLATE MUTATE success`);
                    res.status(http_status_codes_1.default.OK).send({});
                }
                else {
                    logger_lib_1.Logger.getInstance().error(`PUT TEMPLATE MUTATE error`);
                    const err = new Error("PUT TEMPLATE MUTATE FAILED: cannot update new props to db.");
                    err.name = "InternalServerError";
                    throw err;
                }
            }
            catch (err) {
                if (err.name == "InvalidRequestBody") {
                    logger_lib_1.Logger.getInstance().error(`PUT TEMPLATE MUTATE FAILED: ${err}`);
                    res.status(400).send(JSON.stringify({ "message": "Invalid Request Body" }, null, 2));
                }
                else if (err.name == "InternalServerError") {
                    logger_lib_1.Logger.getInstance().error(`PUT TEMPLATE MUTATE FAILED: ${err}`);
                    res.status(500).send(JSON.stringify({ "message": err.message }, null, 2));
                }
                else {
                    logger_lib_1.Logger.getInstance().error(`GET TEMPLATE FAILED: ${err}`);
                    res.status(500).send(JSON.stringify({ "message": err.message, "stack": err.stack }, null, 2));
                }
            }
        });
    }
    /* DELETE template remove property */
    deleteTemplatePropsRemove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_lib_1.Logger.getInstance().info(`DELETE TEMPLATE PROP REMOVE - Accept request from ${req.get('User-Agent')} - ${req.ip}`);
            logger_lib_1.Logger.getInstance().info(`DELETE TEMPLATE PROP REMOVE - Request with params ${JSON.stringify(req.query)}`);
            try {
                // Get params from request
                const templateId = req.query.templateId;
                const props_to_remove = JSON.parse(String(req.query.props));
                if (templateId == null || props_to_remove == null) {
                    const err = new Error("Invalid Request Body");
                    err.name = "InvalidRequestBody";
                    throw err;
                }
                // Retrieve data from mySql
                const data = yield template2_model_1.template_ver2_db.findOne({
                    where: {
                        Id: templateId
                    }
                });
                // Modify data
                const template_props = data === null || data === void 0 ? void 0 : data.Props;
                const props_json = JSON.stringify(template_props);
                const props_parsed = JSON.parse(props_json);
                let mutable_props = props_parsed.mutable;
                for (let key of props_to_remove) {
                    delete mutable_props[key];
                }
                // Save to object
                props_parsed.mutable = mutable_props;
                // Update to database
                const update_result = yield template2_model_1.template_ver2_db.update({ Props: props_parsed }, {
                    where: { Id: templateId }
                });
                // Send response
                if (update_result) {
                    logger_lib_1.Logger.getInstance().info(`DELETE TEMPLATE PROP REMOVE success`);
                    res.status(http_status_codes_1.default.OK).send(JSON.stringify({}, null, 2));
                }
                else {
                    logger_lib_1.Logger.getInstance().error(`DELETE TEMPLATE PROP REMOVE error`);
                    const err = new Error("DELETE TEMPLATE PROP REMOVE error. Cannot update remove result to database.");
                    err.name = "InternalServerError";
                    throw err;
                }
            }
            catch (err) {
                if (err.name == "InvalidRequestBody") {
                    logger_lib_1.Logger.getInstance().error(`DELETE TEMPLATE PROP REMOVE FAILED: ${err}`);
                    res.status(400).send(JSON.stringify({ "message": "Invalid Request Body" }, null, 2));
                }
                else if (err.name == "InternalServerError") {
                    logger_lib_1.Logger.getInstance().error(`DELETE TEMPLATE PROP REMOVE FAILED: ${err}`);
                    res.status(500).send(JSON.stringify({ "message": err.message }, null, 2));
                }
                else {
                    logger_lib_1.Logger.getInstance().error(`DELETE TEMPLATE PROP REMOVE FAILED: ${err}`);
                    res.status(500).send(JSON.stringify({ "message": err.message, "stack": err.stack }, null, 2));
                }
            }
        });
    }
}
exports.Template_Ver2_Controller = Template_Ver2_Controller;
//# sourceMappingURL=template_ver2.controller.js.map