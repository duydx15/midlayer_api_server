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
exports.ItemMaster = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let ItemMaster = class ItemMaster extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column({ allowNull: false, type: sequelize_typescript_1.DataType.CHAR(2), field: 'LAR_CD' }),
    __metadata("design:type", String)
], ItemMaster.prototype, "LargeClassifyCode", void 0);
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column({ allowNull: false, type: sequelize_typescript_1.DataType.CHAR(2), field: 'MED_CD' }),
    __metadata("design:type", String)
], ItemMaster.prototype, "MediumClassifyCode", void 0);
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column({ allowNull: false, type: sequelize_typescript_1.DataType.CHAR(2), field: 'SMA_CD' }),
    __metadata("design:type", String)
], ItemMaster.prototype, "SmallClassifyCode", void 0);
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column({ allowNull: false, type: sequelize_typescript_1.DataType.CHAR(4), field: 'MET_CD' }),
    __metadata("design:type", String)
], ItemMaster.prototype, "ItemCode", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.STRING(40), field: 'MET_NM' }),
    __metadata("design:type", String)
], ItemMaster.prototype, "ItemName", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.INTEGER, field: 'SEV_FLG' }),
    __metadata("design:type", Number)
], ItemMaster.prototype, "Item7SegFlag", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.DECIMAL, field: 'DEC_POT' }),
    __metadata("design:type", Number)
], ItemMaster.prototype, "DecimalPointPosition", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.STRING(10).toSql(), field: 'UNIT' }),
    __metadata("design:type", String)
], ItemMaster.prototype, "Unit", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.STRING(256), field: 'PIC_PATH' }),
    __metadata("design:type", String)
], ItemMaster.prototype, "ImagePath", void 0);
ItemMaster = __decorate([
    sequelize_typescript_1.Table({ modelName: 'ItemMaster', tableName: 'M_MET', timestamps: false })
], ItemMaster);
exports.ItemMaster = ItemMaster;
//# sourceMappingURL=item_master.model.js.map