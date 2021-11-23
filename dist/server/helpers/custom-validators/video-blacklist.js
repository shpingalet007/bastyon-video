"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVideoBlacklistTypeValid = exports.isVideoBlacklistReasonValid = void 0;
const tslib_1 = require("tslib");
const validator_1 = (0, tslib_1.__importDefault)(require("validator"));
const misc_1 = require("./misc");
const constants_1 = require("../../initializers/constants");
const VIDEO_BLACKLIST_CONSTRAINTS_FIELDS = constants_1.CONSTRAINTS_FIELDS.VIDEO_BLACKLIST;
function isVideoBlacklistReasonValid(value) {
    return value === null || validator_1.default.isLength(value, VIDEO_BLACKLIST_CONSTRAINTS_FIELDS.REASON);
}
exports.isVideoBlacklistReasonValid = isVideoBlacklistReasonValid;
function isVideoBlacklistTypeValid(value) {
    return (0, misc_1.exists)(value) &&
        (value === 2 || value === 1);
}
exports.isVideoBlacklistTypeValid = isVideoBlacklistTypeValid;