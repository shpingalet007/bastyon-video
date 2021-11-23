"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoPathManager = void 0;
const tslib_1 = require("tslib");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const uuid_1 = require("@server/helpers/uuid");
const video_1 = require("@server/helpers/video");
const config_1 = require("@server/initializers/config");
const object_storage_1 = require("./object-storage");
const paths_1 = require("./paths");
class VideoPathManager {
    constructor() { }
    getFSHLSOutputPath(video, filename) {
        const base = (0, paths_1.getHLSDirectory)(video);
        if (!filename)
            return base;
        return (0, path_1.join)(base, filename);
    }
    getFSRedundancyVideoFilePath(videoOrPlaylist, videoFile) {
        if (videoFile.isHLS()) {
            const video = (0, video_1.extractVideo)(videoOrPlaylist);
            return (0, path_1.join)((0, paths_1.getHLSRedundancyDirectory)(video), videoFile.filename);
        }
        return (0, path_1.join)(config_1.CONFIG.STORAGE.REDUNDANCY_DIR, videoFile.filename);
    }
    getFSVideoFileOutputPath(videoOrPlaylist, videoFile) {
        if (videoFile.isHLS()) {
            const video = (0, video_1.extractVideo)(videoOrPlaylist);
            return (0, path_1.join)((0, paths_1.getHLSDirectory)(video), videoFile.filename);
        }
        return (0, path_1.join)(config_1.CONFIG.STORAGE.VIDEOS_DIR, videoFile.filename);
    }
    makeAvailableVideoFile(videoOrPlaylist, videoFile, cb) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            if (videoFile.storage === 0) {
                return this.makeAvailableFactory(() => this.getFSVideoFileOutputPath(videoOrPlaylist, videoFile), false, cb);
            }
            const destination = this.buildTMPDestination(videoFile.filename);
            if (videoFile.isHLS()) {
                const video = (0, video_1.extractVideo)(videoOrPlaylist);
                return this.makeAvailableFactory(() => (0, object_storage_1.makeHLSFileAvailable)(videoOrPlaylist, video, videoFile.filename, destination), true, cb);
            }
            return this.makeAvailableFactory(() => (0, object_storage_1.makeWebTorrentFileAvailable)(videoFile.filename, destination), true, cb);
        });
    }
    makeAvailableResolutionPlaylistFile(playlist, videoFile, cb) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const filename = (0, paths_1.getHlsResolutionPlaylistFilename)(videoFile.filename);
            if (videoFile.storage === 0) {
                return this.makeAvailableFactory(() => (0, path_1.join)((0, paths_1.getHLSDirectory)(playlist.Video), filename), false, cb);
            }
            return this.makeAvailableFactory(() => (0, object_storage_1.makeHLSFileAvailable)(playlist, playlist.Video, filename, this.buildTMPDestination(filename)), true, cb);
        });
    }
    makeAvailablePlaylistFile(playlist, filename, cb) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            if (playlist.storage === 0) {
                return this.makeAvailableFactory(() => (0, path_1.join)((0, paths_1.getHLSDirectory)(playlist.Video), filename), false, cb);
            }
            return this.makeAvailableFactory(() => (0, object_storage_1.makeHLSFileAvailable)(playlist, playlist.Video, filename, this.buildTMPDestination(filename)), true, cb);
        });
    }
    makeAvailableFactory(method, clean, cb) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            let result;
            const destination = yield method();
            try {
                result = yield cb(destination);
            }
            catch (err) {
                if (destination && clean)
                    yield (0, fs_extra_1.remove)(destination);
                throw err;
            }
            if (clean)
                yield (0, fs_extra_1.remove)(destination);
            return result;
        });
    }
    buildTMPDestination(filename) {
        return (0, path_1.join)(config_1.CONFIG.STORAGE.TMP_DIR, (0, uuid_1.buildUUID)() + (0, path_1.extname)(filename));
    }
    static get Instance() {
        return this.instance || (this.instance = new this());
    }
}
exports.VideoPathManager = VideoPathManager;