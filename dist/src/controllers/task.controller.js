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
exports.TaskController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const enums_1 = require("@/helper/enums");
const terminal_manager_master_model_1 = require("@/models/terminal_manager_master.model");
const task_manager_master_model_1 = require("@/models/task_manager_master.model");
const logger_lib_1 = require("@/lib/logger.lib");
class TaskController {
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
                const serial = req.params.serial;
                if (serial) {
                    const terminal = yield terminal_manager_master_model_1.TerminalManagerMaster.findOne({ where: { TerminalSerialNo: serial } });
                    if (!terminal) {
                        res.status(http_status_codes_1.default.OK).send({ status: enums_1.ReturnCode.None, result: "Serial not match" });
                    }
                    else {
                        const taskManager = yield task_manager_master_model_1.TaskManagerMaster.findOne({ where: { TerminalId: terminal.TerminalId } });
                        res.status(http_status_codes_1.default.OK).send({ status: enums_1.ReturnCode.Success, result: { TerminalId: terminal.TerminalId, TerminalName: terminal.TerminalName, TaskId: taskManager === null || taskManager === void 0 ? void 0 : taskManager.TaskId } });
                    }
                }
                else {
                    res.status(http_status_codes_1.default.OK).send({ status: enums_1.ReturnCode.None });
                }
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
exports.TaskController = TaskController;
//# sourceMappingURL=task.controller.js.map