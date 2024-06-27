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
exports.token_db = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let token_db = class token_db extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.BIGINT.UNSIGNED, field: 'stardust_tokenId' }),
    __metadata("design:type", Number)
], token_db.prototype, "stardust_tokenId", void 0);
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column({ allowNull: false, type: sequelize_typescript_1.DataType.INTEGER(), field: 'templateId' }),
    __metadata("design:type", String)
], token_db.prototype, "templateId", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: false, type: sequelize_typescript_1.DataType.INTEGER(), field: 'amount' }),
    __metadata("design:type", String)
], token_db.prototype, "amount", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: false, type: sequelize_typescript_1.DataType.CHAR(36), field: 'playerId' }),
    __metadata("design:type", Number)
], token_db.prototype, "playerId", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.STRING(), field: 'name' }),
    __metadata("design:type", String)
], token_db.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.JSON, field: 'props' }),
    __metadata("design:type", String)
], token_db.prototype, "props", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: false, type: sequelize_typescript_1.DataType.BIGINT.UNSIGNED, field: 'blockchain_tokenId' }),
    __metadata("design:type", Number)
], token_db.prototype, "blockchain_tokenId", void 0);
token_db = __decorate([
    sequelize_typescript_1.Table({ modelName: 'token', tableName: 'token_db', timestamps: false })
], token_db);
exports.token_db = token_db;
//# sourceMappingURL=token.model.js.map