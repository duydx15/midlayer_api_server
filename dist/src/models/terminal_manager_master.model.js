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
exports.TerminalManagerMaster = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let TerminalManagerMaster = class TerminalManagerMaster extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column({ allowNull: false, type: sequelize_typescript_1.DataType.STRING(50).toSql(), field: 'TER_SER' }),
    __metadata("design:type", String)
], TerminalManagerMaster.prototype, "TerminalSerialNo", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: false, type: sequelize_typescript_1.DataType.CHAR(8), field: 'TER_ID' }),
    __metadata("design:type", String)
], TerminalManagerMaster.prototype, "TerminalId", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.STRING(40), field: 'TER_NM' }),
    __metadata("design:type", String)
], TerminalManagerMaster.prototype, "TerminalName", void 0);
TerminalManagerMaster = __decorate([
    sequelize_typescript_1.Table({ modelName: 'TerminalManagerMaster', tableName: 'M_TER', timestamps: false })
], TerminalManagerMaster);
exports.TerminalManagerMaster = TerminalManagerMaster;
//# sourceMappingURL=terminal_manager_master.model.js.map