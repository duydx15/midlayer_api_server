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
exports.props_db = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let props_db = class props_db extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column({ allowNull: false, type: sequelize_typescript_1.DataType.INTEGER(), field: 'templateId' }),
    __metadata("design:type", String)
], props_db.prototype, "TemplateId", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: false, type: sequelize_typescript_1.DataType.STRING(), field: 'inherited' }),
    __metadata("design:type", String)
], props_db.prototype, "Inherited", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: false, type: sequelize_typescript_1.DataType.STRING(), field: 'mutable' }),
    __metadata("design:type", Number)
], props_db.prototype, "Mutable", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: false, type: sequelize_typescript_1.DataType.STRING(), field: 'immutable' }),
    __metadata("design:type", String)
], props_db.prototype, "Immutable", void 0);
props_db = __decorate([
    sequelize_typescript_1.Table({ modelName: 'props', tableName: 'props_db', timestamps: false })
], props_db);
exports.props_db = props_db;
//# sourceMappingURL=props.model.js.map