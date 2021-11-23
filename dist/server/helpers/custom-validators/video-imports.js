"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVideoImportTorrentFile = exports.isVideoImportTargetUrlValid = exports.isVideoImportStateValid = void 0;
const tslib_1 = require("tslib");
require("multer");
const validator_1 = (0, tslib_1.__importDefault)(require("validator"));
const constants_1 = require("../../initializers/constants");
const misc_1 = require("./misc");
function isVideoImportTargetUrlValid(url) {
    const isURLOptions = {
        require_host: true,
        require_tld: true,
        require_protocol: true,
        require_valid_protocol: true,
        protocols: ['http', 'https']
    };
    return (0, misc_1.exists)(url) &&
        validator_1.default.isURL('' + url, isURLOptions) &&
        validator_1.default.isLength('' + url, constants_1.CONSTRAINTS_FIELDS.VIDEO_IMPORTS.URL);
}
exports.isVideoImportTargetUrlValid = isVideoImportTargetUrlValid;
function isVideoImportStateValid(value) {
    return (0, misc_1.exists)(value) && constants_1.VIDEO_IMPORT_STATES[value] !== undefined;
}
exports.isVideoImportStateValid = isVideoImportStateValid;
const videoTorrentImportRegex = Object.keys(constants_1.MIMETYPES.TORRENT.MIMETYPE_EXT)
    .concat(['application/octet-stream'])
    .map(m => `(${m})`)
    .join('|');
function isVideoImportTorrentFile(files) {
    return (0, misc_1.isFileValid)(files, videoTorrentImportRegex, 'torrentfile', constants_1.CONSTRAINTS_FIELDS.VIDEO_IMPORTS.TORRENT_FILE.FILE_SIZE.max, true);
}
exports.isVideoImportTorrentFile = isVideoImportTorrentFile;