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
exports.template_ver2_db = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let template_ver2_db = class template_ver2_db extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.INTEGER.UNSIGNED, field: 'gameId' }),
    __metadata("design:type", Number)
], template_ver2_db.prototype, "GameId", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.STRING, field: 'cap' }),
    __metadata("design:type", String)
], template_ver2_db.prototype, "Cap", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, unique: true, type: sequelize_typescript_1.DataType.STRING, field: 'name' }),
    __metadata("design:type", String)
], template_ver2_db.prototype, "Name", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.ENUM('NFT', 'FT'), field: 'type' }),
    __metadata("design:type", String)
], template_ver2_db.prototype, "Type", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.JSON, field: 'props' }),
    __metadata("design:type", String)
], template_ver2_db.prototype, "Props", void 0);
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.INTEGER, field: 'id' }),
    __metadata("design:type", Number)
], template_ver2_db.prototype, "Id", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.INTEGER.UNSIGNED, field: 'totalSupply' }),
    __metadata("design:type", Number)
], template_ver2_db.prototype, "TotalSupply", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.INTEGER, field: 'royalty' }),
    __metadata("design:type", Number)
], template_ver2_db.prototype, "Royalty", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.BOOLEAN, field: 'activeListing' }),
    __metadata("design:type", Boolean)
], template_ver2_db.prototype, "ActiveListing", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.STRING, field: 'metadata' }),
    __metadata("design:type", String)
], template_ver2_db.prototype, "Metadata", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.ENUM('interal-mint', 'external-no-mint'), field: 'templateContractType' }),
    __metadata("design:type", String)
], template_ver2_db.prototype, "TemplateContractType", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.JSON, field: 'fees' }),
    __metadata("design:type", String)
], template_ver2_db.prototype, "Fees", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.STRING, field: 'image' }),
    __metadata("design:type", String)
], template_ver2_db.prototype, "Image", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.STRING, field: 'contractAddress' }),
    __metadata("design:type", String)
], template_ver2_db.prototype, "ContractAddress", void 0);
template_ver2_db = __decorate([
    sequelize_typescript_1.Table({ modelName: 'template_ver2', tableName: 'template', timestamps: false })
], template_ver2_db);
exports.template_ver2_db = template_ver2_db;
//# sourceMappingURL=template2.model.js.map