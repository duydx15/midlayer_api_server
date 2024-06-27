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
exports.withdrawn_token_db = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let withdrawn_token_db = class withdrawn_token_db extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column({ allowNull: false, type: sequelize_typescript_1.DataType.INTEGER.UNSIGNED, field: 'tokenId' }),
    __metadata("design:type", Number)
], withdrawn_token_db.prototype, "tokenID", void 0);
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column({ allowNull: false, type: sequelize_typescript_1.DataType.CHAR(50), field: 'contractAddress' }),
    __metadata("design:type", String)
], withdrawn_token_db.prototype, "contractAddress", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: false, type: sequelize_typescript_1.DataType.CHAR(50), field: 'L1WalletAddress' }),
    __metadata("design:type", String)
], withdrawn_token_db.prototype, "L1WalletAddress", void 0);
withdrawn_token_db = __decorate([
    sequelize_typescript_1.Table({ modelName: 'withdrawn_token', tableName: 'withdrawn_token', timestamps: false })
], withdrawn_token_db);
exports.withdrawn_token_db = withdrawn_token_db;
//# sourceMappingURL=withdraw_token.model.js.map