"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountsRouter = void 0;
const tslib_1 = require("tslib");
const express_1 = (0, tslib_1.__importDefault)(require("express"));
const query_1 = require("@server/helpers/query");
const application_1 = require("@server/models/application/application");
const express_utils_1 = require("../../helpers/express-utils");
const utils_1 = require("../../helpers/utils");
const job_queue_1 = require("../../lib/job-queue");
const hooks_1 = require("../../lib/plugins/hooks");
const middlewares_1 = require("../../middlewares");
const validators_1 = require("../../middlewares/validators");
const video_playlists_1 = require("../../middlewares/validators/videos/video-playlists");
const account_1 = require("../../models/account/account");
const account_video_rate_1 = require("../../models/account/account-video-rate");
const video_1 = require("../../models/video/video");
const video_channel_1 = require("../../models/video/video-channel");
const video_playlist_1 = require("../../models/video/video-playlist");
const accountsRouter = express_1.default.Router();
exports.accountsRouter = accountsRouter;
accountsRouter.get('/', middlewares_1.paginationValidator, validators_1.accountsSortValidator, middlewares_1.setDefaultSort, middlewares_1.setDefaultPagination, (0, middlewares_1.asyncMiddleware)(listAccounts));
accountsRouter.get('/:accountName', (0, middlewares_1.asyncMiddleware)(validators_1.accountNameWithHostGetValidator), getAccount);
accountsRouter.get('/:accountName/videos', (0, middlewares_1.asyncMiddleware)(validators_1.accountNameWithHostGetValidator), middlewares_1.paginationValidator, validators_1.videosSortValidator, middlewares_1.setDefaultVideosSort, middlewares_1.setDefaultPagination, middlewares_1.optionalAuthenticate, middlewares_1.commonVideosFiltersValidator, (0, middlewares_1.asyncMiddleware)(listAccountVideos));
accountsRouter.get('/:accountName/video-channels', (0, middlewares_1.asyncMiddleware)(validators_1.accountNameWithHostGetValidator), validators_1.videoChannelStatsValidator, middlewares_1.paginationValidator, validators_1.videoChannelsSortValidator, middlewares_1.setDefaultSort, middlewares_1.setDefaultPagination, (0, middlewares_1.asyncMiddleware)(listAccountChannels));
accountsRouter.get('/:accountName/video-playlists', middlewares_1.optionalAuthenticate, (0, middlewares_1.asyncMiddleware)(validators_1.accountNameWithHostGetValidator), middlewares_1.paginationValidator, middlewares_1.videoPlaylistsSortValidator, middlewares_1.setDefaultSort, middlewares_1.setDefaultPagination, video_playlists_1.commonVideoPlaylistFiltersValidator, video_playlists_1.videoPlaylistsSearchValidator, (0, middlewares_1.asyncMiddleware)(listAccountPlaylists));
accountsRouter.get('/:accountName/ratings', middlewares_1.authenticate, (0, middlewares_1.asyncMiddleware)(validators_1.accountNameWithHostGetValidator), validators_1.ensureAuthUserOwnsAccountValidator, middlewares_1.paginationValidator, middlewares_1.videoRatesSortValidator, middlewares_1.setDefaultSort, middlewares_1.setDefaultPagination, middlewares_1.videoRatingValidator, (0, middlewares_1.asyncMiddleware)(listAccountRatings));
function getAccount(req, res) {
    const account = res.locals.account;
    if (account.isOutdated()) {
        job_queue_1.JobQueue.Instance.createJob({ type: 'activitypub-refresher', payload: { type: 'actor', url: account.Actor.url } });
    }
    return res.json(account.toFormattedJSON());
}
function listAccounts(req, res) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const resultList = yield account_1.AccountModel.listForApi(req.query.start, req.query.count, req.query.sort);
        return res.json((0, utils_1.getFormattedObjects)(resultList.data, resultList.total));
    });
}
function listAccountChannels(req, res) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const options = {
            accountId: res.locals.account.id,
            start: req.query.start,
            count: req.query.count,
            sort: req.query.sort,
            withStats: req.query.withStats,
            search: req.query.search
        };
        const resultList = yield video_channel_1.VideoChannelModel.listByAccount(options);
        return res.json((0, utils_1.getFormattedObjects)(resultList.data, resultList.total));
    });
}
function listAccountPlaylists(req, res) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const serverActor = yield (0, application_1.getServerActor)();
        let listMyPlaylists = false;
        if (res.locals.oauth && res.locals.oauth.token.User.Account.id === res.locals.account.id) {
            listMyPlaylists = true;
        }
        const resultList = yield video_playlist_1.VideoPlaylistModel.listForApi({
            search: req.query.search,
            followerActorId: serverActor.id,
            start: req.query.start,
            count: req.query.count,
            sort: req.query.sort,
            accountId: res.locals.account.id,
            listMyPlaylists,
            type: req.query.playlistType
        });
        return res.json((0, utils_1.getFormattedObjects)(resultList.data, resultList.total));
    });
}
function listAccountVideos(req, res) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const account = res.locals.account;
        const followerActorId = (0, express_utils_1.isUserAbleToSearchRemoteURI)(res) ? null : undefined;
        const countVideos = (0, express_utils_1.getCountVideos)(req);
        const query = (0, query_1.pickCommonVideoQuery)(req.query);
        const apiOptions = yield hooks_1.Hooks.wrapObject(Object.assign(Object.assign({}, query), { followerActorId, search: req.query.search, includeLocalVideos: true, nsfw: (0, express_utils_1.buildNSFWFilter)(res, query.nsfw), withFiles: false, accountId: account.id, user: res.locals.oauth ? res.locals.oauth.token.User : undefined, countVideos }), 'filter:api.accounts.videos.list.params');
        const resultList = yield hooks_1.Hooks.wrapPromiseFun(video_1.VideoModel.listForApi, apiOptions, 'filter:api.accounts.videos.list.result');
        return res.json((0, utils_1.getFormattedObjects)(resultList.data, resultList.total));
    });
}
function listAccountRatings(req, res) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const account = res.locals.account;
        const resultList = yield account_video_rate_1.AccountVideoRateModel.listByAccountForApi({
            accountId: account.id,
            start: req.query.start,
            count: req.query.count,
            sort: req.query.sort,
            type: req.query.rating
        });
        return res.json((0, utils_1.getFormattedObjects)(resultList.rows, resultList.count));
    });
}