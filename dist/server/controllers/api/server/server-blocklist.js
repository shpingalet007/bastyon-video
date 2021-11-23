"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverBlocklistRouter = void 0;
const tslib_1 = require("tslib");
require("multer");
const express_1 = (0, tslib_1.__importDefault)(require("express"));
const logger_1 = require("@server/helpers/logger");
const application_1 = require("@server/models/application/application");
const user_notification_1 = require("@server/models/user/user-notification");
const http_error_codes_1 = require("../../../../shared/models/http/http-error-codes");
const utils_1 = require("../../../helpers/utils");
const blocklist_1 = require("../../../lib/blocklist");
const middlewares_1 = require("../../../middlewares");
const validators_1 = require("../../../middlewares/validators");
const account_blocklist_1 = require("../../../models/account/account-blocklist");
const server_blocklist_1 = require("../../../models/server/server-blocklist");
const serverBlocklistRouter = express_1.default.Router();
exports.serverBlocklistRouter = serverBlocklistRouter;
serverBlocklistRouter.get('/blocklist/accounts', middlewares_1.authenticate, (0, middlewares_1.ensureUserHasRight)(10), middlewares_1.paginationValidator, validators_1.accountsBlocklistSortValidator, middlewares_1.setDefaultSort, middlewares_1.setDefaultPagination, (0, middlewares_1.asyncMiddleware)(listBlockedAccounts));
serverBlocklistRouter.post('/blocklist/accounts', middlewares_1.authenticate, (0, middlewares_1.ensureUserHasRight)(10), (0, middlewares_1.asyncMiddleware)(validators_1.blockAccountValidator), (0, middlewares_1.asyncRetryTransactionMiddleware)(blockAccount));
serverBlocklistRouter.delete('/blocklist/accounts/:accountName', middlewares_1.authenticate, (0, middlewares_1.ensureUserHasRight)(10), (0, middlewares_1.asyncMiddleware)(validators_1.unblockAccountByServerValidator), (0, middlewares_1.asyncRetryTransactionMiddleware)(unblockAccount));
serverBlocklistRouter.get('/blocklist/servers', middlewares_1.authenticate, (0, middlewares_1.ensureUserHasRight)(11), middlewares_1.paginationValidator, validators_1.serversBlocklistSortValidator, middlewares_1.setDefaultSort, middlewares_1.setDefaultPagination, (0, middlewares_1.asyncMiddleware)(listBlockedServers));
serverBlocklistRouter.post('/blocklist/servers', middlewares_1.authenticate, (0, middlewares_1.ensureUserHasRight)(11), (0, middlewares_1.asyncMiddleware)(validators_1.blockServerValidator), (0, middlewares_1.asyncRetryTransactionMiddleware)(blockServer));
serverBlocklistRouter.delete('/blocklist/servers/:host', middlewares_1.authenticate, (0, middlewares_1.ensureUserHasRight)(11), (0, middlewares_1.asyncMiddleware)(validators_1.unblockServerByServerValidator), (0, middlewares_1.asyncRetryTransactionMiddleware)(unblockServer));
function listBlockedAccounts(req, res) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const serverActor = yield (0, application_1.getServerActor)();
        const resultList = yield account_blocklist_1.AccountBlocklistModel.listForApi({
            start: req.query.start,
            count: req.query.count,
            sort: req.query.sort,
            search: req.query.search,
            accountId: serverActor.Account.id
        });
        return res.json((0, utils_1.getFormattedObjects)(resultList.data, resultList.total));
    });
}
function blockAccount(req, res) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const serverActor = yield (0, application_1.getServerActor)();
        const accountToBlock = res.locals.account;
        yield (0, blocklist_1.addAccountInBlocklist)(serverActor.Account.id, accountToBlock.id);
        user_notification_1.UserNotificationModel.removeNotificationsOf({
            id: accountToBlock.id,
            type: 'account',
            forUserId: null
        }).catch(err => logger_1.logger.error('Cannot remove notifications after an account mute.', { err }));
        return res.status(http_error_codes_1.HttpStatusCode.NO_CONTENT_204).end();
    });
}
function unblockAccount(req, res) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const accountBlock = res.locals.accountBlock;
        yield (0, blocklist_1.removeAccountFromBlocklist)(accountBlock);
        return res.status(http_error_codes_1.HttpStatusCode.NO_CONTENT_204).end();
    });
}
function listBlockedServers(req, res) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const serverActor = yield (0, application_1.getServerActor)();
        const resultList = yield server_blocklist_1.ServerBlocklistModel.listForApi({
            start: req.query.start,
            count: req.query.count,
            sort: req.query.sort,
            search: req.query.search,
            accountId: serverActor.Account.id
        });
        return res.json((0, utils_1.getFormattedObjects)(resultList.data, resultList.total));
    });
}
function blockServer(req, res) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const serverActor = yield (0, application_1.getServerActor)();
        const serverToBlock = res.locals.server;
        yield (0, blocklist_1.addServerInBlocklist)(serverActor.Account.id, serverToBlock.id);
        user_notification_1.UserNotificationModel.removeNotificationsOf({
            id: serverToBlock.id,
            type: 'server',
            forUserId: null
        }).catch(err => logger_1.logger.error('Cannot remove notifications after a server mute.', { err }));
        return res.status(http_error_codes_1.HttpStatusCode.NO_CONTENT_204).end();
    });
}
function unblockServer(req, res) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const serverBlock = res.locals.serverBlock;
        yield (0, blocklist_1.removeServerFromBlocklist)(serverBlock);
        return res.status(http_error_codes_1.HttpStatusCode.NO_CONTENT_204).end();
    });
}