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
exports.template_db = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let template_db = class template_db extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column({ allowNull: false, type: sequelize_typescript_1.DataType.INTEGER(), field: 'id' }),
    __metadata("design:type", Number)
], template_db.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: false, type: sequelize_typescript_1.DataType.INTEGER(), field: 'gameId' }),
    __metadata("design:type", Number)
], template_db.prototype, "gameId", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: false, type: sequelize_typescript_1.DataType.STRING(), field: 'cap' }),
    __metadata("design:type", String)
], template_db.prototype, "cap", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: false, type: sequelize_typescript_1.DataType.STRING(), field: 'type' }),
    __metadata("design:type", String)
], template_db.prototype, "type", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.STRING(), field: 'Image' }),
    __metadata("design:type", String)
], template_db.prototype, "image", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.STRING(), field: 'totalSupply' }),
    __metadata("design:type", String)
], template_db.prototype, "totalSupply", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.STRING(), field: 'name' }),
    __metadata("design:type", String)
], template_db.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.JSON, field: 'props' }),
    __metadata("design:type", String)
], template_db.prototype, "props", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.STRING(), field: 'blockchain_contract_address' }),
    __metadata("design:type", String)
], template_db.prototype, "blockchain_contract_address", void 0);
template_db = __decorate([
    sequelize_typescript_1.Table({ modelName: 'template', tableName: 'Template', timestamps: false })
], template_db);
exports.template_db = template_db;
//# sourceMappingURL=template.model.js.map