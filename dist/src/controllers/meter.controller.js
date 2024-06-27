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
exports.MeterController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const axios_1 = __importDefault(require("axios"));
const moment_1 = __importDefault(require("moment"));
const app_config_1 = __importDefault(require("@/config/app.config"));
const logger_lib_1 = require("@/lib/logger.lib");
const meter_data_model_1 = require("@/models/meter_data.model");
const large_classify_master_model_1 = require("@/models/large_classify_master.model");
const enums_1 = require("@/helper/enums");
const medium_classify_master_model_1 = require("@/models/medium_classify_master.model");
const small_classify_master_model_1 = require("@/models/small_classify_master.model");
const item_master_model_1 = require("@/models/item_master.model");
class MeterController {
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
    // POST add meter
    addNew(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_lib_1.Logger.getInstance().info(`POST ADDMETER - Accept request from ${req.get('User-Agent')} - ${req.ip}`);
            logger_lib_1.Logger.getInstance().info(`POST ADDMETER - Request with body ${JSON.stringify(req.body)}`);
            try {
                const largeClassifyCode = req.body.largeClassifyCode;
                const mediumClassifyCode = req.body.mediumClassifyCode;
                const smallClassifyCode = req.body.smallClassifyCode;
                const itemCode = req.body.itemCode;
                const useValue = req.body.useValue;
                const terminalId = req.body.terminalId;
                const terminalName = req.body.terminalName;
                const feedbackId = req.body.feedbackId;
                const timeNow = moment_1.default(Date.now());
                // Get large info
                const large = yield large_classify_master_model_1.LargeClassifyMaster.findOne({ where: { LargeClassifyCode: largeClassifyCode } });
                if (!large) {
                    res.status(http_status_codes_1.default.NOT_FOUND).send({ status: enums_1.ReturnCode.Error, result: "Large Classify not found" });
                    return;
                }
                // Get medium info
                const medium = yield this.getMedium(largeClassifyCode, mediumClassifyCode);
                if (!medium) {
                    res.status(http_status_codes_1.default.NOT_FOUND).send({ status: enums_1.ReturnCode.Error, result: "Medium Classify not found" });
                    return;
                }
                // Get small info
                const small = yield this.getSmall(largeClassifyCode, mediumClassifyCode, smallClassifyCode);
                if (!small) {
                    res.status(http_status_codes_1.default.NOT_FOUND).send({ status: enums_1.ReturnCode.Error, result: "Small Classify not found" });
                    return;
                }
                // Get item info
                const item = yield this.getItem(largeClassifyCode, mediumClassifyCode, smallClassifyCode, itemCode);
                if (!item) {
                    res.status(http_status_codes_1.default.NOT_FOUND).send({ status: enums_1.ReturnCode.Error, result: "Item not found" });
                    return;
                }
                // Send request get image path
                let imgName = "";
                if (item.Item7SegFlag != 3) {
                    const params = new URLSearchParams();
                    params.append('feedback_id', feedbackId);
                    params.append('item_flag', item.Item7SegFlag.toString());
                    params.append('termial_id', terminalId);
                    params.append('reg_date', timeNow.format('YYYYMMDD'));
                    params.append('reg_time', timeNow.format('HHmmss'));
                    params.append('large_code', largeClassifyCode);
                    params.append('medium_code', mediumClassifyCode);
                    params.append('small_code', smallClassifyCode);
                    params.append('item_code', itemCode);
                    const resSaveFeedback = yield axios_1.default.post(`${app_config_1.default.seven_seg_addr}/save_feedback`, params, {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    });
                    // Save image name to db
                    const resData = resSaveFeedback.data;
                    if (resData['status'] == 0) {
                        logger_lib_1.Logger.getInstance().info(`Get feedback name from ${app_config_1.default.seven_seg_addr} success: ${JSON.stringify(resSaveFeedback.data)}`);
                        // Add image path to item master
                        imgName = resSaveFeedback.data['image_name'];
                    }
                    else {
                        res.status(http_status_codes_1.default.NOT_FOUND).send({ status: enums_1.ReturnCode.Error, result: "Get image name error" });
                        return;
                    }
                }
                // Create new MeterData
                const newMeter = yield new meter_data_model_1.MeterData({
                    TerminalId: terminalId,
                    RegisterDate: timeNow.format('YYYY-MM-DD'),
                    RegisterTime: timeNow.format('HH:mm:ss'),
                    LargeClassifyCode: largeClassifyCode,
                    MediumClassifyCode: mediumClassifyCode,
                    SmallClassifyCode: smallClassifyCode,
                    ItemCode: itemCode,
                    LargeClassifyTitle: large.LargeClassifyTitle,
                    MediumClassifyTitle: medium.MediumClassifyTitle,
                    SmallClassifyTitle: small.SmallClassifyTitle,
                    ItemName: item.ItemName,
                    Unit: item.Unit,
                    UseValue: useValue,
                    ImagePath: item.ImagePath,
                    ImageName: imgName,
                    TerminalName: terminalName,
                }).save();
                // Send response
                if (newMeter) {
                    logger_lib_1.Logger.getInstance().info(`Add meter with terminal_id ${terminalId}, item_code ${itemCode}, value ${useValue} success`);
                    res.status(http_status_codes_1.default.OK).send({ status: enums_1.ReturnCode.Success, result: newMeter });
                }
                else {
                    logger_lib_1.Logger.getInstance().error(`Add meter with item_code ${itemCode}, value ${useValue} error`);
                    res.status(http_status_codes_1.default.BAD_REQUEST).send({ status: enums_1.ReturnCode.Error, result: "Add meter error" });
                }
            }
            catch (err) {
                logger_lib_1.Logger.getInstance().error(`Add meter reject: ${err}`);
                res.status(http_status_codes_1.default.NOT_ACCEPTABLE).send({ status: enums_1.ReturnCode.Error, error: err });
            }
        });
    }
    // POST cancel feedback
    postCancel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_lib_1.Logger.getInstance().info(`POST CANCELMETER - Accept request from ${req.get('User-Agent')} - ${req.ip}`);
            logger_lib_1.Logger.getInstance().info(`POST CANCELMETER - Request with body ${JSON.stringify(req.body)}`);
            try {
                const feedbackId = req.body.feedbackId;
                const params = new URLSearchParams();
                params.append('feedback_id', feedbackId);
                const resSaveFeedback = yield axios_1.default.post(`${app_config_1.default.seven_seg_addr}//remove_feedback`, params, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
                const resData = resSaveFeedback.data;
                if (resData['status'] == 0) {
                    logger_lib_1.Logger.getInstance().info(`Cancel feedback name from ${app_config_1.default.seven_seg_addr} success: ${JSON.stringify(resData)}`);
                    res.status(http_status_codes_1.default.OK).send({ status: enums_1.ReturnCode.Success, result: resData['message'] });
                }
                else {
                    logger_lib_1.Logger.getInstance().error(`Cancel feedback name from ${app_config_1.default.seven_seg_addr} error: ${JSON.stringify(resData)}`);
                    res.status(http_status_codes_1.default.OK).send({ status: enums_1.ReturnCode.Error, result: resData['message'] });
                }
            }
            catch (err) {
                logger_lib_1.Logger.getInstance().error(`Cancel meter reject: ${err}`);
                res.status(http_status_codes_1.default.NOT_ACCEPTABLE).send({ status: enums_1.ReturnCode.Error, error: err });
            }
        });
    }
    getMedium(largeCode, mediumCode) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield medium_classify_master_model_1.MediumClassifyMaster.findOne({
                where: {
                    LargeClassifyCode: largeCode,
                    MediumClassifyCode: mediumCode
                }
            });
        });
    }
    getSmall(largeCode, mediumCode, smallCode) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield small_classify_master_model_1.SmallClassifyMaster.findOne({
                where: {
                    LargeClassifyCode: largeCode,
                    MediumClassifyCode: mediumCode,
                    SmallClassifyCode: smallCode
                }
            });
        });
    }
    getItem(largeCode, mediumCode, smallCode, itemCode) {
        return item_master_model_1.ItemMaster.findOne({
            where: {
                LargeClassifyCode: largeCode,
                MediumClassifyCode: mediumCode,
                SmallClassifyCode: smallCode,
                ItemCode: itemCode
            }
        });
    }
}
exports.MeterController = MeterController;
//# sourceMappingURL=meter.controller.js.map