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
exports.contract_address_db = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let contract_address_db = class contract_address_db extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column({ allowNull: false, type: sequelize_typescript_1.DataType.CHAR(50), field: 'contractAddress' }),
    __metadata("design:type", String)
], contract_address_db.prototype, "ContractAddress", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.INTEGER.UNSIGNED, field: 'currentBlocknum' }),
    __metadata("design:type", Number)
], contract_address_db.prototype, "CurrentBlocknum", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.BOOLEAN, field: 'addedToMainThread' }),
    __metadata("design:type", Boolean)
], contract_address_db.prototype, "AddedToMainThread", void 0);
contract_address_db = __decorate([
    sequelize_typescript_1.Table({ modelName: 'contract_address', tableName: 'contract_address', timestamps: false })
], contract_address_db);
exports.contract_address_db = contract_address_db;
//# sourceMappingURL=contract_address.model.js.map