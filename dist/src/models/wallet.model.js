"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wallet_db = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let wallet_db = class wallet_db extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column({ allowNull: false, type: sequelize_typescript_1.DataType.CHAR(36), field: 'playerId' }),
    __metadata("design:type", String)
], wallet_db.prototype, "PlayerId", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: false, type: sequelize_typescript_1.DataType.CHAR(50), field: 'address' }),
    __metadata("design:type", String)
], wallet_db.prototype, "Address", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: false, type: sequelize_typescript_1.DataType.STRING(), field: 'blockchain' }),
    __metadata("design:type", Number)
], wallet_db.prototype, "Blockchain", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: false, type: sequelize_typescript_1.DataType.STRING(), field: 'privateKey' }),
    __metadata("design:type", String)
], wallet_db.prototype, "PrivateKey", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: false, type: sequelize_typescript_1.DataType.STRING(), field: 'publicKey' }),
    __metadata("design:type", String)
], wallet_db.prototype, "PublicKey", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.FLOAT(), field: 'balance' }),
    __metadata("design:type", Number)
], wallet_db.prototype, "Balance", void 0);
wallet_db = __decorate([
    sequelize_typescript_1.Table({ modelName: 'wallet', tableName: 'wallet', timestamps: false })
], wallet_db);
exports.wallet_db = wallet_db;
//# sourceMappingURL=wallet.model.js.map