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
exports.Fun_Controller = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const enums_1 = require("@/helper/enums");
const logger_lib_1 = require("@/lib/logger.lib");
class Fun_Controller {
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
    fun(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_lib_1.Logger.getInstance().info(`POST CREATE TEMPLATE - Accept request from ${req.get('User-Agent')} - ${req.ip}`);
            logger_lib_1.Logger.getInstance().info(`POST CREATE TEMPLATE - Request with body ${JSON.stringify(req.body)}`);
            try {
                // Get request params
                res.status(http_status_codes_1.default.OK).send({ status: 'ok' });
            }
            catch (err) {
                logger_lib_1.Logger.getInstance().error(`POST CREATE TEMPLATE FAILED: ${err}`);
                res.status(http_status_codes_1.default.NOT_ACCEPTABLE).send({ status: enums_1.ReturnCode.Error, error: err });
            }
        });
    }
}
exports.Fun_Controller = Fun_Controller;
//# sourceMappingURL=fun.controller.js.map