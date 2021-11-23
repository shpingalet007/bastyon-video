"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const register_ts_paths_1 = require("../server/helpers/register-ts-paths");
(0, register_ts_paths_1.registerTSPaths)();
const commander_1 = require("commander");
const path_1 = require("path");
const video_1 = require("../server/models/video/video");
const database_1 = require("../server/initializers/database");
const job_queue_1 = require("../server/lib/job-queue");
const misc_1 = require("@server/helpers/custom-validators/misc");
commander_1.program
    .option('-v, --video [videoUUID]', 'Video UUID')
    .option('-i, --import [videoFile]', 'Video file')
    .description('Import a video file to replace an already uploaded file or to add a new resolution')
    .parse(process.argv);
const options = commander_1.program.opts();
if (options.video === undefined || options.import === undefined) {
    console.error('All parameters are mandatory.');
    process.exit(-1);
}
run()
    .then(() => process.exit(0))
    .catch(err => {
    console.error(err);
    process.exit(-1);
});
function run() {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        yield (0, database_1.initDatabaseModels)(true);
        const uuid = (0, misc_1.toCompleteUUID)(options.video);
        if ((0, misc_1.isUUIDValid)(uuid) === false) {
            console.error('%s is not a valid video UUID.', options.video);
            return;
        }
        const video = yield video_1.VideoModel.load(uuid);
        if (!video)
            throw new Error('Video not found.');
        if (video.isOwned() === false)
            throw new Error('Cannot import files of a non owned video.');
        const dataInput = {
            videoUUID: video.uuid,
            filePath: (0, path_1.resolve)(options.import)
        };
        job_queue_1.JobQueue.Instance.init();
        yield job_queue_1.JobQueue.Instance.createJobWithPromise({ type: 'video-file-import', payload: dataInput });
        console.log('Import job for video %s created.', video.uuid);
    });
}