"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildConcatenatedName = exports.cleanupLive = void 0;
const tslib_1 = require("tslib");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const paths_1 = require("../paths");
function buildConcatenatedName(segmentOrPlaylistPath) {
    const num = (0, path_1.basename)(segmentOrPlaylistPath).match(/^(\d+)(-|\.)/);
    return 'concat-' + num[1] + '.ts';
}
exports.buildConcatenatedName = buildConcatenatedName;
function cleanupLive(video, streamingPlaylist) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const hlsDirectory = (0, paths_1.getLiveDirectory)(video);
        yield (0, fs_extra_1.remove)(hlsDirectory);
        yield streamingPlaylist.destroy();
    });
}
exports.cleanupLive = cleanupLive;