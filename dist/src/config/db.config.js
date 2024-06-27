'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const dbConfig = {
    HOST: process.env.DB_HOST || "192.168.1.26",
    USER: process.env.DB_USER || "achilles",
    PASSWORD: process.env.DB_PASSWORD || "XbK8wndu",
    DB: process.env.DB_NAME || "Achilles_7seg",
    PORT: process.env.DB_PORT || 63837,
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};
exports.default = dbConfig;
//# sourceMappingURL=db.config.js.map