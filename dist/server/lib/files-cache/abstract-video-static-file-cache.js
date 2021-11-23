"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractVideoStaticFileCache = void 0;
const tslib_1 = require("tslib");
const fs_extra_1 = require("fs-extra");
const logger_1 = require("../../helpers/logger");
const memoizee_1 = (0, tslib_1.__importDefault)(require("memoizee"));
class AbstractVideoStaticFileCache {
    init(max, maxAge) {
        this.getFilePath = (0, memoizee_1.default)(this.getFilePathImpl, {
            maxAge,
            max,
            promise: true,
            dispose: (result) => {
                if (result && result.isOwned !== true) {
                    (0, fs_extra_1.remove)(result.path)
                        .then(() => logger_1.logger.debug('%s removed from %s', result.path, this.constructor.name))
                        .catch(err => logger_1.logger.error('Cannot remove %s from cache %s.', result.path, this.constructor.name, { err }));
                }
            }
        });
    }
}
exports.AbstractVideoStaticFileCache = AbstractVideoStaticFileCache;