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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const middleware_config_1 = require("@/config/middleware.config");
const logger_lib_1 = require("../lib/logger.lib");
const template_ver2_controller_1 = require("@/controllers/template_ver2.controller");
class Template_Ver2_Route {
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
        const controller = new template_ver2_controller_1.Template_Ver2_Controller();
        this.express.post('/create', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            yield controller.PostCreateTemplate(req, res)
                .catch(err => {
                logger_lib_1.Logger.getInstance().error(err);
            });
        }));
        this.express.get('/get', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            yield controller.GetTemplate(req, res)
                .catch(err => {
                logger_lib_1.Logger.getInstance().error(err);
            });
        }));
        this.express.get('/get-all', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            yield controller.GetAllTemplates(req, res)
                .catch(err => {
                logger_lib_1.Logger.getInstance().error(err);
            });
        }));
        this.express.get('/count', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            yield controller.GetTemplateCount(req, res)
                .catch(err => {
                logger_lib_1.Logger.getInstance().error(err);
            });
        }));
        this.express.get('/get-tokens', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            yield controller.GetTokens(req, res)
                .catch(err => {
                logger_lib_1.Logger.getInstance().error(err);
            });
        }));
        this.express.delete('/remove', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            yield controller.DeleteTemplate(req, res)
                .catch(err => {
                logger_lib_1.Logger.getInstance().error(err);
            });
        }));
        this.express.put('/mutate', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            yield controller.putTemplateMutate(req, res)
                .catch(err => {
                logger_lib_1.Logger.getInstance().error(err);
            });
        }));
        this.express.delete('/props-remove', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            yield controller.deleteTemplatePropsRemove(req, res)
                .catch(err => {
                logger_lib_1.Logger.getInstance().error(err);
            });
        }));
    }
}
exports.default = new Template_Ver2_Route().express;
//# sourceMappingURL=template_ver2.route.js.map