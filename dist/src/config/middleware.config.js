"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.camelcase = void 0;
const camelcase_keys_1 = __importDefault(require("camelcase-keys"));
const camelcase = () => {
    return function (req, res, next) {
        req.body = camelcase_keys_1.default(req.body, { deep: true });
        req.params = camelcase_keys_1.default(req.params);
        req.query = camelcase_keys_1.default(req.query);
        next();
    };
};
exports.camelcase = camelcase;
//# sourceMappingURL=middleware.config.js.map