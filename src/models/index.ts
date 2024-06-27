import { Sequelize } from "sequelize-typescript";
import { Dialect } from "sequelize/types";

import dbConfig from "@/config/db.config";
// import { UserData } from "./user.model";
// import { wallet_db } from "./wallet.model";
// import { player_db } from "./player.model";
// import { template_db } from "./template.model";
import { token_db } from "./token.model";
// import { props_db } from "./props.model";
// import { template_ver2_db } from "./template2.model";
// import { contract_address_db } from "./contract_address.model";
// import { withdrawn_token_db } from "./withdraw_token.model";

// import { MediumClassifyMaster } from "./medium_classify_master.model";
// import { SmallClassifyMaster } from "./small_classify_master.model";
// import { ItemMaster } from "./item_master.model";
// import { TaskIdMaster } from "./task_id_master.model";
// import { TaskManagerMaster } from "./task_manager_master.model";
// import { MeterData } from "./meter_data.model";
// import { TerminalManagerMaster } from "./terminal_manager_master.model";
import { Logger } from '../lib/logger.lib';
// import { token_listed } from "./marketplace.model";

const sequelize = new Sequelize({
    host: dbConfig.HOST,
    username: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB,
    dialect: dbConfig.dialect as Dialect,
    port: dbConfig.PORT as number,
    pool: dbConfig.pool,
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
        // player_db,
        // wallet_db,
        token_db,
        // props_db,
        // template_ver2_db,
        // token_listed,
        // withdrawn_token_db
    ],
    logging: false //console.log
});

sequelize.authenticate().then((err) => {
    Logger.getInstance().info('Connection successful', err);
}).catch((err) => {
    Logger.getInstance().error('Unable to connect to database', err);
});

export default sequelize;