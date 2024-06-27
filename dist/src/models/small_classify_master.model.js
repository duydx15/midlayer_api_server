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
exports.SmallClassifyMaster = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let SmallClassifyMaster = class SmallClassifyMaster extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column({ allowNull: false, type: sequelize_typescript_1.DataType.CHAR(2), field: 'LAR_CD' }),
    __metadata("design:type", String)
], SmallClassifyMaster.prototype, "LargeClassifyCode", void 0);
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column({ allowNull: false, type: sequelize_typescript_1.DataType.CHAR(2), field: 'MED_CD' }),
    __metadata("design:type", String)
], SmallClassifyMaster.prototype, "MediumClassifyCode", void 0);
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column({ allowNull: false, type: sequelize_typescript_1.DataType.CHAR(2), field: 'SMA_CD' }),
    __metadata("design:type", String)
], SmallClassifyMaster.prototype, "SmallClassifyCode", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.STRING(40), field: 'SMA_NM' }),
    __metadata("design:type", String)
], SmallClassifyMaster.prototype, "SmallClassifyTitle", void 0);
SmallClassifyMaster = __decorate([
    sequelize_typescript_1.Table({ modelName: 'SmallClassifyMaster', tableName: 'M_SMA', timestamps: false })
], SmallClassifyMaster);
exports.SmallClassifyMaster = SmallClassifyMaster;
//# sourceMappingURL=small_classify_master.model.js.map