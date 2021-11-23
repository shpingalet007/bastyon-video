"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeVideoRedundancyValidator = exports.addVideoRedundancyValidator = exports.listVideoRedundanciesValidator = exports.updateServerRedundancyValidator = exports.videoPlaylistRedundancyGetValidator = exports.videoFileRedundancyGetValidator = void 0;
const tslib_1 = require("tslib");
const express_validator_1 = require("express-validator");
const video_redundancies_1 = require("@server/helpers/custom-validators/video-redundancies");
const http_error_codes_1 = require("../../../shared/models/http/http-error-codes");
const misc_1 = require("../../helpers/custom-validators/misc");
const servers_1 = require("../../helpers/custom-validators/servers");
const logger_1 = require("../../helpers/logger");
const video_redundancy_1 = require("../../models/redundancy/video-redundancy");
const server_1 = require("../../models/server/server");
const shared_1 = require("./shared");
const videoFileRedundancyGetValidator = [
    (0, shared_1.isValidVideoIdParam)('videoId'),
    (0, express_validator_1.param)('resolution')
        .customSanitizer(misc_1.toIntOrNull)
        .custom(misc_1.exists).withMessage('Should have a valid resolution'),
    (0, express_validator_1.param)('fps')
        .optional()
        .customSanitizer(misc_1.toIntOrNull)
        .custom(misc_1.exists).withMessage('Should have a valid fps'),
    (req, res, next) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        logger_1.logger.debug('Checking videoFileRedundancyGetValidator parameters', { parameters: req.params });
        if ((0, shared_1.areValidationErrors)(req, res))
            return;
        if (!(yield (0, shared_1.doesVideoExist)(req.params.videoId, res)))
            return;
        const video = res.locals.videoAll;
        const paramResolution = req.params.resolution;
        const paramFPS = req.params.fps;
        const videoFile = video.VideoFiles.find(f => {
            return f.resolution === paramResolution && (!req.params.fps || paramFPS);
        });
        if (!videoFile) {
            return res.fail({
                status: http_error_codes_1.HttpStatusCode.NOT_FOUND_404,
                message: 'Video file not found.'
            });
        }
        res.locals.videoFile = videoFile;
        const videoRedundancy = yield video_redundancy_1.VideoRedundancyModel.loadLocalByFileId(videoFile.id);
        if (!videoRedundancy) {
            return res.fail({
                status: http_error_codes_1.HttpStatusCode.NOT_FOUND_404,
                message: 'Video redundancy not found.'
            });
        }
        res.locals.videoRedundancy = videoRedundancy;
        return next();
    })
];
exports.videoFileRedundancyGetValidator = videoFileRedundancyGetValidator;
const videoPlaylistRedundancyGetValidator = [
    (0, shared_1.isValidVideoIdParam)('videoId'),
    (0, express_validator_1.param)('streamingPlaylistType')
        .customSanitizer(misc_1.toIntOrNull)
        .custom(misc_1.exists).withMessage('Should have a valid streaming playlist type'),
    (req, res, next) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        logger_1.logger.debug('Checking videoPlaylistRedundancyGetValidator parameters', { parameters: req.params });
        if ((0, shared_1.areValidationErrors)(req, res))
            return;
        if (!(yield (0, shared_1.doesVideoExist)(req.params.videoId, res)))
            return;
        const video = res.locals.videoAll;
        const paramPlaylistType = req.params.streamingPlaylistType;
        const videoStreamingPlaylist = video.VideoStreamingPlaylists.find(p => p.type === paramPlaylistType);
        if (!videoStreamingPlaylist) {
            return res.fail({
                status: http_error_codes_1.HttpStatusCode.NOT_FOUND_404,
                message: 'Video playlist not found.'
            });
        }
        res.locals.videoStreamingPlaylist = videoStreamingPlaylist;
        const videoRedundancy = yield video_redundancy_1.VideoRedundancyModel.loadLocalByStreamingPlaylistId(videoStreamingPlaylist.id);
        if (!videoRedundancy) {
            return res.fail({
                status: http_error_codes_1.HttpStatusCode.NOT_FOUND_404,
                message: 'Video redundancy not found.'
            });
        }
        res.locals.videoRedundancy = videoRedundancy;
        return next();
    })
];
exports.videoPlaylistRedundancyGetValidator = videoPlaylistRedundancyGetValidator;
const updateServerRedundancyValidator = [
    (0, express_validator_1.param)('host').custom(servers_1.isHostValid).withMessage('Should have a valid host'),
    (0, express_validator_1.body)('redundancyAllowed')
        .customSanitizer(misc_1.toBooleanOrNull)
        .custom(misc_1.isBooleanValid).withMessage('Should have a valid redundancyAllowed attribute'),
    (req, res, next) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        logger_1.logger.debug('Checking updateServerRedundancy parameters', { parameters: req.params });
        if ((0, shared_1.areValidationErrors)(req, res))
            return;
        const server = yield server_1.ServerModel.loadByHost(req.params.host);
        if (!server) {
            return res.fail({
                status: http_error_codes_1.HttpStatusCode.NOT_FOUND_404,
                message: `Server ${req.params.host} not found.`
            });
        }
        res.locals.server = server;
        return next();
    })
];
exports.updateServerRedundancyValidator = updateServerRedundancyValidator;
const listVideoRedundanciesValidator = [
    (0, express_validator_1.query)('target')
        .custom(video_redundancies_1.isVideoRedundancyTarget).withMessage('Should have a valid video redundancies target'),
    (req, res, next) => {
        logger_1.logger.debug('Checking listVideoRedundanciesValidator parameters', { parameters: req.query });
        if ((0, shared_1.areValidationErrors)(req, res))
            return;
        return next();
    }
];
exports.listVideoRedundanciesValidator = listVideoRedundanciesValidator;
const addVideoRedundancyValidator = [
    (0, express_validator_1.body)('videoId')
        .customSanitizer(misc_1.toCompleteUUID)
        .custom(misc_1.isIdOrUUIDValid)
        .withMessage('Should have a valid video id'),
    (req, res, next) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        logger_1.logger.debug('Checking addVideoRedundancyValidator parameters', { parameters: req.query });
        if ((0, shared_1.areValidationErrors)(req, res))
            return;
        if (!(yield (0, shared_1.doesVideoExist)(req.body.videoId, res, 'only-video')))
            return;
        if (res.locals.onlyVideo.remote === false) {
            return res.fail({ message: 'Cannot create a redundancy on a local video' });
        }
        if (res.locals.onlyVideo.isLive) {
            return res.fail({ message: 'Cannot create a redundancy of a live video' });
        }
        const alreadyExists = yield video_redundancy_1.VideoRedundancyModel.isLocalByVideoUUIDExists(res.locals.onlyVideo.uuid);
        if (alreadyExists) {
            return res.fail({
                status: http_error_codes_1.HttpStatusCode.CONFLICT_409,
                message: 'This video is already duplicated by your instance.'
            });
        }
        return next();
    })
];
exports.addVideoRedundancyValidator = addVideoRedundancyValidator;
const removeVideoRedundancyValidator = [
    (0, express_validator_1.param)('redundancyId')
        .custom(misc_1.isIdValid)
        .withMessage('Should have a valid redundancy id'),
    (req, res, next) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        logger_1.logger.debug('Checking removeVideoRedundancyValidator parameters', { parameters: req.query });
        if ((0, shared_1.areValidationErrors)(req, res))
            return;
        const redundancy = yield video_redundancy_1.VideoRedundancyModel.loadByIdWithVideo(parseInt(req.params.redundancyId, 10));
        if (!redundancy) {
            return res.fail({
                status: http_error_codes_1.HttpStatusCode.NOT_FOUND_404,
                message: 'Video redundancy not found'
            });
        }
        res.locals.videoRedundancy = redundancy;
        return next();
    })
];
exports.removeVideoRedundancyValidator = removeVideoRedundancyValidator;