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
exports.player_db = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let player_db = class player_db extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column({ allowNull: false, type: sequelize_typescript_1.DataType.CHAR(36), field: 'playerId' }),
    __metadata("design:type", String)
], player_db.prototype, "PlayerId", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.INTEGER(), field: 'id' }),
    __metadata("design:type", Number)
], player_db.prototype, "Id", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: false, type: sequelize_typescript_1.DataType.STRING(), field: 'uniqueId' }),
    __metadata("design:type", String)
], player_db.prototype, "UniqueId", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.STRING(), field: 'image' }),
    __metadata("design:type", String)
], player_db.prototype, "Image", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.INTEGER(), field: 'gameId' }),
    __metadata("design:type", Number)
], player_db.prototype, "GameId", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.STRING(), field: 'lastSeen' }),
    __metadata("design:type", String)
], player_db.prototype, "LastSeen", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true, type: sequelize_typescript_1.DataType.JSON, field: 'userData' }),
    __metadata("design:type", Object)
], player_db.prototype, "UserData", void 0);
player_db = __decorate([
    sequelize_typescript_1.Table({ modelName: 'player', tableName: 'Player', timestamps: false })
], player_db);
exports.player_db = player_db;
//# sourceMappingURL=player.model.js.map