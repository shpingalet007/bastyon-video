"use strict";
var VideoShareModel_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoShareModel = void 0;
const tslib_1 = require("tslib");
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const misc_1 = require("../../helpers/custom-validators/activitypub/misc");
const constants_1 = require("../../initializers/constants");
const actor_1 = require("../actor/actor");
const utils_1 = require("../utils");
const video_1 = require("./video");
var ScopeNames;
(function (ScopeNames) {
    ScopeNames["FULL"] = "FULL";
    ScopeNames["WITH_ACTOR"] = "WITH_ACTOR";
})(ScopeNames || (ScopeNames = {}));
let VideoShareModel = VideoShareModel_1 = class VideoShareModel extends sequelize_typescript_1.Model {
    static load(actorId, videoId, t) {
        return VideoShareModel_1.scope(ScopeNames.WITH_ACTOR).findOne({
            where: {
                actorId,
                videoId
            },
            transaction: t
        });
    }
    static loadByUrl(url, t) {
        return VideoShareModel_1.scope(ScopeNames.FULL).findOne({
            where: {
                url
            },
            transaction: t
        });
    }
    static loadActorsByShare(videoId, t) {
        const query = {
            where: {
                videoId
            },
            include: [
                {
                    model: actor_1.ActorModel,
                    required: true
                }
            ],
            transaction: t
        };
        return VideoShareModel_1.scope(ScopeNames.FULL).findAll(query)
            .then((res) => res.map(r => r.Actor));
    }
    static loadActorsWhoSharedVideosOf(actorOwnerId, t) {
        const safeOwnerId = parseInt(actorOwnerId + '', 10);
        const query = {
            where: {
                [sequelize_1.Op.and]: [
                    (0, sequelize_1.literal)(`EXISTS (` +
                        `  SELECT 1 FROM "videoShare" ` +
                        `  INNER JOIN "video" ON "videoShare"."videoId" = "video"."id" ` +
                        `  INNER JOIN "videoChannel" ON "videoChannel"."id" = "video"."channelId" ` +
                        `  INNER JOIN "account" ON "account"."id" = "videoChannel"."accountId" ` +
                        `  WHERE "videoShare"."actorId" = "ActorModel"."id" AND "account"."actorId" = ${safeOwnerId} ` +
                        `  LIMIT 1` +
                        `)`)
                ]
            },
            transaction: t
        };
        return actor_1.ActorModel.findAll(query);
    }
    static loadActorsByVideoChannel(videoChannelId, t) {
        const safeChannelId = parseInt(videoChannelId + '', 10);
        const query = {
            where: {
                [sequelize_1.Op.and]: [
                    (0, sequelize_1.literal)(`EXISTS (` +
                        `  SELECT 1 FROM "videoShare" ` +
                        `  INNER JOIN "video" ON "videoShare"."videoId" = "video"."id" ` +
                        `  WHERE "videoShare"."actorId" = "ActorModel"."id" AND "video"."channelId" = ${safeChannelId} ` +
                        `  LIMIT 1` +
                        `)`)
                ]
            },
            transaction: t
        };
        return actor_1.ActorModel.findAll(query);
    }
    static listAndCountByVideoId(videoId, start, count, t) {
        const query = {
            offset: start,
            limit: count,
            where: {
                videoId
            },
            transaction: t
        };
        return VideoShareModel_1.findAndCountAll(query);
    }
    static listRemoteShareUrlsOfLocalVideos() {
        const query = `SELECT "videoShare".url FROM "videoShare" ` +
            `INNER JOIN actor ON actor.id = "videoShare"."actorId" AND actor."serverId" IS NOT NULL ` +
            `INNER JOIN video ON video.id = "videoShare"."videoId" AND video.remote IS FALSE`;
        return VideoShareModel_1.sequelize.query(query, {
            type: sequelize_1.QueryTypes.SELECT,
            raw: true
        }).then(rows => rows.map(r => r.url));
    }
    static cleanOldSharesOf(videoId, beforeUpdatedAt) {
        const query = {
            where: {
                updatedAt: {
                    [sequelize_1.Op.lt]: beforeUpdatedAt
                },
                videoId,
                actorId: {
                    [sequelize_1.Op.notIn]: (0, utils_1.buildLocalActorIdsIn)()
                }
            }
        };
        return VideoShareModel_1.destroy(query);
    }
};
(0, tslib_1.__decorate)([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Is)('VideoShareUrl', value => (0, utils_1.throwIfNotValid)(value, misc_1.isActivityPubUrlValid, 'url')),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(constants_1.CONSTRAINTS_FIELDS.VIDEO_SHARE.URL.max)),
    (0, tslib_1.__metadata)("design:type", String)
], VideoShareModel.prototype, "url", void 0);
(0, tslib_1.__decorate)([
    sequelize_typescript_1.CreatedAt,
    (0, tslib_1.__metadata)("design:type", Date)
], VideoShareModel.prototype, "createdAt", void 0);
(0, tslib_1.__decorate)([
    sequelize_typescript_1.UpdatedAt,
    (0, tslib_1.__metadata)("design:type", Date)
], VideoShareModel.prototype, "updatedAt", void 0);
(0, tslib_1.__decorate)([
    (0, sequelize_typescript_1.ForeignKey)(() => actor_1.ActorModel),
    sequelize_typescript_1.Column,
    (0, tslib_1.__metadata)("design:type", Number)
], VideoShareModel.prototype, "actorId", void 0);
(0, tslib_1.__decorate)([
    (0, sequelize_typescript_1.BelongsTo)(() => actor_1.ActorModel, {
        foreignKey: {
            allowNull: false
        },
        onDelete: 'cascade'
    }),
    (0, tslib_1.__metadata)("design:type", actor_1.ActorModel)
], VideoShareModel.prototype, "Actor", void 0);
(0, tslib_1.__decorate)([
    (0, sequelize_typescript_1.ForeignKey)(() => video_1.VideoModel),
    sequelize_typescript_1.Column,
    (0, tslib_1.__metadata)("design:type", Number)
], VideoShareModel.prototype, "videoId", void 0);
(0, tslib_1.__decorate)([
    (0, sequelize_typescript_1.BelongsTo)(() => video_1.VideoModel, {
        foreignKey: {
            allowNull: false
        },
        onDelete: 'cascade'
    }),
    (0, tslib_1.__metadata)("design:type", video_1.VideoModel)
], VideoShareModel.prototype, "Video", void 0);
VideoShareModel = VideoShareModel_1 = (0, tslib_1.__decorate)([
    (0, sequelize_typescript_1.Scopes)(() => ({
        [ScopeNames.FULL]: {
            include: [
                {
                    model: actor_1.ActorModel,
                    required: true
                },
                {
                    model: video_1.VideoModel,
                    required: true
                }
            ]
        },
        [ScopeNames.WITH_ACTOR]: {
            include: [
                {
                    model: actor_1.ActorModel,
                    required: true
                }
            ]
        }
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'videoShare',
        indexes: [
            {
                fields: ['actorId']
            },
            {
                fields: ['videoId']
            },
            {
                fields: ['url'],
                unique: true
            }
        ]
    })
], VideoShareModel);
exports.VideoShareModel = VideoShareModel;