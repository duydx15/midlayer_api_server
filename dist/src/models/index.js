"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const db_config_1 = __importDefault(require("@/config/db.config"));
// import { UserData } from "./user.model";
const wallet_model_1 = require("./wallet.model");
const player_model_1 = require("./player.model");
const token_model_1 = require("./token.model");
const props_model_1 = require("./props.model");
const template2_model_1 = require("./template2.model");
const withdraw_token_model_1 = require("./withdraw_token.model");
// import { MediumClassifyMaster } from "./medium_classify_master.model";
// import { SmallClassifyMaster } from "./small_classify_master.model";
// import { ItemMaster } from "./item_master.model";
// import { TaskIdMaster } from "./task_id_master.model";
// import { TaskManagerMaster } from "./task_manager_master.model";
// import { MeterData } from "./meter_data.model";
// import { TerminalManagerMaster } from "./terminal_manager_master.model";
const logger_lib_1 = require("../lib/logger.lib");
const token_listed_model_1 = require("./token_listed.model");
const sequelize = new sequelize_typescript_1.Sequelize({
    host: db_config_1.default.HOST,
    username: db_config_1.default.USER,
    password: db_config_1.default.PASSWORD,
    database: db_config_1.default.DB,
    dialect: db_config_1.default.dialect,
    port: db_config_1.default.PORT,
    pool: db_config_1.default.pool,
    models: [
        // MeterData,
        // LargeClassifyMaster,
        // MediumClassifyMaster,
        // SmallClassifyMaster,
        // ItemMaster,
        // TaskIdMaster,
        // TaskManagerMaster,
        // TerminalManagerMaster,
        // UserData,
        player_model_1.player_db,
        wallet_model_1.wallet_db,
        token_model_1.token_db,
        props_model_1.props_db,
        template2_model_1.template_ver2_db,
        token_listed_model_1.token_listed,
        withdraw_token_model_1.withdrawn_token_db
    ],
    logging: false //console.log
});
sequelize.authenticate().then((err) => {
    logger_lib_1.Logger.getInstance().info('Connection successful', err);
}).catch((err) => {
    logger_lib_1.Logger.getInstance().error('Unable to connect to database', err);
});
exports.default = sequelize;
//# sourceMappingURL=index.js.map