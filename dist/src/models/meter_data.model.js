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
exports.MeterData = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let MeterData = class MeterData extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column({ allowNull: false, type: sequelize_typescript_1.DataType.CHAR(8), field: 'TER_ID' }),
    __metadata("design:type", String)
], MeterData.prototype, "TerminalId", void 0);
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column({ allowNull: false, type: sequelize_typescript_1.DataType.DATEONLY, field: 'INS_DATE' }),
    __metadata("design:type", Date)
], MeterData.prototype, "RegisterDate", void 0);
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column({ allowNull: false, type: sequelize_typescript_1.DataType.TIME, field: 'INS_TIME' }),
    __metadata("design:type", Date)
], MeterData.prototype, "RegisterTime", void 0);
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column({ allowNull: false, type: sequelize_typescript_1.DataType.CHAR(2), field: 'LAR_CD' }),
    __metadata("design:type", String)
], MeterData.prototype, "LargeClassifyCode", void 0);
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column({ allowNull: false, type: sequelize_typescript_1.DataType.CHAR(2), field: 'MED_CD' }),
    __metadata("design:type", String)
], MeterData.prototype, "MediumClassifyCode", void 0);
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column({ allowNull: false, type: sequelize_typescript_1.DataType.CHAR(2), field: 'SMA_CD' }),
    __metadata("design:type", String)
], MeterData.prototype, "SmallClassifyCode", void 0);
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column({ allowNull: false, type: sequelize_typescript_1.DataType.CHAR(4), field: 'MET_CD' }),
    __metadata("design:type", String)
], MeterData.prototype, "ItemCode", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.STRING(40), field: 'TER_NM' }),
    __metadata("design:type", String)
], MeterData.prototype, "TerminalName", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.STRING(40), field: 'LAR_NM' }),
    __metadata("design:type", String)
], MeterData.prototype, "LargeClassifyTitle", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.STRING(40), field: 'MED_NM' }),
    __metadata("design:type", String)
], MeterData.prototype, "MediumClassifyTitle", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.STRING(40), field: 'SMA_NM' }),
    __metadata("design:type", String)
], MeterData.prototype, "SmallClassifyTitle", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.STRING(40), field: 'MET_NM' }),
    __metadata("design:type", String)
], MeterData.prototype, "ItemName", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.STRING(10).toSql(), field: 'UNIT' }),
    __metadata("design:type", String)
], MeterData.prototype, "Unit", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.DECIMAL(18, 2), field: 'EMP' }),
    __metadata("design:type", Number)
], MeterData.prototype, "UseValue", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.STRING(256), field: 'PIC_PATH' }),
    __metadata("design:type", String)
], MeterData.prototype, "ImagePath", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.STRING(50).toSql(), field: 'PIC_NM' }),
    __metadata("design:type", String)
], MeterData.prototype, "ImageName", void 0);
MeterData = __decorate([
    sequelize_typescript_1.Table({ modelName: 'MeterData', tableName: 'T_MET', timestamps: false })
], MeterData);
exports.MeterData = MeterData;
//# sourceMappingURL=meter_data.model.js.map