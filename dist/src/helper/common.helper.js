"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonHelper = void 0;
class CommonHelper {
    static normalizePort(val) {
        const port = parseInt(val, 10);
        if (!isNaN(port)) {
            return val;
        }
        if (port >= 0) {
            return port;
        }
        return 0;
    }
}
exports.CommonHelper = CommonHelper;
//# sourceMappingURL=common.helper.js.map