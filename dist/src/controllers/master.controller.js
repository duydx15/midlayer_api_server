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
exports.MasterController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const large_classify_master_model_1 = require("@/models/large_classify_master.model");
const enums_1 = require("@/helper/enums");
const medium_classify_master_model_1 = require("@/models/medium_classify_master.model");
const item_master_model_1 = require("@/models/item_master.model");
const small_classify_master_model_1 = require("@/models/small_classify_master.model");
const logger_lib_1 = require("@/lib/logger.lib");
class MasterController {
    delete(req, res) {
        throw new Error('Method not implemented.');
    }
    put(req, res) {
        throw new Error('Method not implemented.');
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_lib_1.Logger.getInstance().info(`Accept request from ${req.get('User-Agent')} - ${req.ip}`);
            try {
                const largeClassifies = yield large_classify_master_model_1.LargeClassifyMaster.findAll();
                const mediumClassifies = yield medium_classify_master_model_1.MediumClassifyMaster.findAll();
                const smallClassifies = yield small_classify_master_model_1.SmallClassifyMaster.findAll();
                const items = yield item_master_model_1.ItemMaster.findAll();
                res.status(http_status_codes_1.default.OK).send({
                    status: enums_1.ReturnCode.Success,
                    largeClassifies: largeClassifies,
                    mediumClassifies: mediumClassifies,
                    smallClassifies: smallClassifies,
                    items: items
                });
            }
            catch (err) {
                res.status(http_status_codes_1.default.NOT_ACCEPTABLE).send({ status: enums_1.ReturnCode.Error, error: err });
            }
        });
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            Promise.reject(new Error('Method not implemented.'));
        });
    }
}
exports.MasterController = MasterController;
//# sourceMappingURL=master.controller.js.map