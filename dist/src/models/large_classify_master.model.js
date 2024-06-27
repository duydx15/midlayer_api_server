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
exports.LargeClassifyMaster = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let LargeClassifyMaster = class LargeClassifyMaster extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column({ allowNull: false, type: sequelize_typescript_1.DataType.CHAR(2), field: 'LAR_CD' }),
    __metadata("design:type", String)
], LargeClassifyMaster.prototype, "LargeClassifyCode", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.STRING(40), field: 'LAR_NM' }),
    __metadata("design:type", String)
], LargeClassifyMaster.prototype, "LargeClassifyTitle", void 0);
LargeClassifyMaster = __decorate([
    sequelize_typescript_1.Table({ modelName: 'LargeClassifyMaster', tableName: 'M_LAR', timestamps: false })
], LargeClassifyMaster);
exports.LargeClassifyMaster = LargeClassifyMaster;
//# sourceMappingURL=large_classify_master.model.js.map