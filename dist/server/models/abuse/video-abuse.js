"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoAbuseModel = void 0;
const tslib_1 = require("tslib");
const sequelize_typescript_1 = require("sequelize-typescript");
const video_1 = require("../video/video");
const abuse_1 = require("./abuse");
let VideoAbuseModel = class VideoAbuseModel extends sequelize_typescript_1.Model {
};
(0, tslib_1.__decorate)([
    sequelize_typescript_1.CreatedAt,
    (0, tslib_1.__metadata)("design:type", Date)
], VideoAbuseModel.prototype, "createdAt", void 0);
(0, tslib_1.__decorate)([
    sequelize_typescript_1.UpdatedAt,
    (0, tslib_1.__metadata)("design:type", Date)
], VideoAbuseModel.prototype, "updatedAt", void 0);
(0, tslib_1.__decorate)([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Default)(null),
    sequelize_typescript_1.Column,
    (0, tslib_1.__metadata)("design:type", Number)
], VideoAbuseModel.prototype, "startAt", void 0);
(0, tslib_1.__decorate)([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Default)(null),
    sequelize_typescript_1.Column,
    (0, tslib_1.__metadata)("design:type", Number)
], VideoAbuseModel.prototype, "endAt", void 0);
(0, tslib_1.__decorate)([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Default)(null),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB),
    (0, tslib_1.__metadata)("design:type", Object)
], VideoAbuseModel.prototype, "deletedVideo", void 0);
(0, tslib_1.__decorate)([
    (0, sequelize_typescript_1.ForeignKey)(() => abuse_1.AbuseModel),
    sequelize_typescript_1.Column,
    (0, tslib_1.__metadata)("design:type", Number)
], VideoAbuseModel.prototype, "abuseId", void 0);
(0, tslib_1.__decorate)([
    (0, sequelize_typescript_1.BelongsTo)(() => abuse_1.AbuseModel, {
        foreignKey: {
            allowNull: false
        },
        onDelete: 'cascade'
    }),
    (0, tslib_1.__metadata)("design:type", abuse_1.AbuseModel)
], VideoAbuseModel.prototype, "Abuse", void 0);
(0, tslib_1.__decorate)([
    (0, sequelize_typescript_1.ForeignKey)(() => video_1.VideoModel),
    sequelize_typescript_1.Column,
    (0, tslib_1.__metadata)("design:type", Number)
], VideoAbuseModel.prototype, "videoId", void 0);
(0, tslib_1.__decorate)([
    (0, sequelize_typescript_1.BelongsTo)(() => video_1.VideoModel, {
        foreignKey: {
            allowNull: true
        },
        onDelete: 'set null'
    }),
    (0, tslib_1.__metadata)("design:type", video_1.VideoModel)
], VideoAbuseModel.prototype, "Video", void 0);
VideoAbuseModel = (0, tslib_1.__decorate)([
    (0, sequelize_typescript_1.Table)({
        tableName: 'videoAbuse',
        indexes: [
            {
                fields: ['abuseId']
            },
            {
                fields: ['videoId']
            }
        ]
    })
], VideoAbuseModel);
exports.VideoAbuseModel = VideoAbuseModel;