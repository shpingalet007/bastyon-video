"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStateLabel = exports.getPrivacyLabel = exports.getLanguageLabel = exports.getLicenceLabel = exports.getCategoryLabel = exports.getActivityStreamDuration = exports.videoModelToActivityPubObject = exports.videoFilesModelToFormattedJSON = exports.videoModelToFormattedDetailsJSON = exports.videoModelToFormattedJSON = void 0;
const uuid_1 = require("@server/helpers/uuid");
const webtorrent_1 = require("@server/helpers/webtorrent");
const video_urls_1 = require("@server/lib/video-urls");
const misc_1 = require("../../../helpers/custom-validators/misc");
const constants_1 = require("../../../initializers/constants");
const url_1 = require("../../../lib/activitypub/url");
const video_caption_1 = require("../video-caption");
function videoModelToFormattedJSON(video, options) {
    const userHistory = (0, misc_1.isArray)(video.UserVideoHistories) ? video.UserVideoHistories[0] : undefined;
    const videoObject = {
        id: video.id,
        uuid: video.uuid,
        shortUUID: (0, uuid_1.uuidToShort)(video.uuid),
        name: video.name,
        category: {
            id: video.category,
            label: getCategoryLabel(video.category)
        },
        licence: {
            id: video.licence,
            label: getLicenceLabel(video.licence)
        },
        language: {
            id: video.language,
            label: getLanguageLabel(video.language)
        },
        privacy: {
            id: video.privacy,
            label: getPrivacyLabel(video.privacy)
        },
        nsfw: video.nsfw,
        description: options && options.completeDescription === true
            ? video.description
            : video.getTruncatedDescription(),
        isLocal: video.isOwned(),
        duration: video.duration,
        views: video.views,
        likes: video.likes,
        dislikes: video.dislikes,
        thumbnailPath: video.getMiniatureStaticPath(),
        previewPath: video.getPreviewStaticPath(),
        embedPath: video.getEmbedStaticPath(),
        createdAt: video.createdAt,
        updatedAt: video.updatedAt,
        publishedAt: video.publishedAt,
        originallyPublishedAt: video.originallyPublishedAt,
        aspectRatio: video.aspectRatio,
        isLive: video.isLive,
        account: video.VideoChannel.Account.toFormattedSummaryJSON(),
        channel: video.VideoChannel.toFormattedSummaryJSON(),
        userHistory: userHistory
            ? { currentTime: userHistory.currentTime }
            : undefined,
        pluginData: video.pluginData
    };
    if (options) {
        if (options.additionalAttributes.state === true) {
            videoObject.state = {
                id: video.state,
                label: getStateLabel(video.state)
            };
        }
        if (options.additionalAttributes.waitTranscoding === true) {
            videoObject.waitTranscoding = video.waitTranscoding;
        }
        if (options.additionalAttributes.scheduledUpdate === true && video.ScheduleVideoUpdate) {
            videoObject.scheduledUpdate = {
                updateAt: video.ScheduleVideoUpdate.updateAt,
                privacy: video.ScheduleVideoUpdate.privacy || undefined
            };
        }
        if (options.additionalAttributes.blacklistInfo === true) {
            videoObject.blacklisted = !!video.VideoBlacklist;
            videoObject.blacklistedReason = video.VideoBlacklist ? video.VideoBlacklist.reason : null;
        }
    }
    return videoObject;
}
exports.videoModelToFormattedJSON = videoModelToFormattedJSON;
function videoModelToFormattedDetailsJSON(video) {
    const formattedJson = video.toFormattedJSON({
        additionalAttributes: {
            scheduledUpdate: true,
            blacklistInfo: true
        }
    });
    const tags = video.Tags ? video.Tags.map(t => t.name) : [];
    const streamingPlaylists = streamingPlaylistsModelToFormattedJSON(video, video.VideoStreamingPlaylists);
    const detailsJson = {
        support: video.support,
        descriptionPath: video.getDescriptionAPIPath(),
        channel: video.VideoChannel.toFormattedJSON(),
        account: video.VideoChannel.Account.toFormattedJSON(),
        tags,
        commentsEnabled: video.commentsEnabled,
        downloadEnabled: video.downloadEnabled,
        waitTranscoding: video.waitTranscoding,
        state: {
            id: video.state,
            label: getStateLabel(video.state)
        },
        trackerUrls: video.getTrackerUrls(),
        files: [],
        streamingPlaylists,
        aspectRatio: video.aspectRatio
    };
    detailsJson.files = videoFilesModelToFormattedJSON(video, video.VideoFiles);
    return Object.assign(formattedJson, detailsJson);
}
exports.videoModelToFormattedDetailsJSON = videoModelToFormattedDetailsJSON;
function streamingPlaylistsModelToFormattedJSON(video, playlists) {
    if ((0, misc_1.isArray)(playlists) === false)
        return [];
    return playlists
        .map(playlist => {
        const redundancies = (0, misc_1.isArray)(playlist.RedundancyVideos)
            ? playlist.RedundancyVideos.map(r => ({ baseUrl: r.fileUrl }))
            : [];
        const files = videoFilesModelToFormattedJSON(video, playlist.VideoFiles);
        return {
            id: playlist.id,
            type: playlist.type,
            playlistUrl: playlist.getMasterPlaylistUrl(video),
            segmentsSha256Url: playlist.getSha256SegmentsUrl(video),
            redundancies,
            files
        };
    });
}
function sortByResolutionDesc(fileA, fileB) {
    if (fileA.resolution < fileB.resolution)
        return 1;
    if (fileA.resolution === fileB.resolution)
        return 0;
    return -1;
}
function videoFilesModelToFormattedJSON(video, videoFiles, includeMagnet = true) {
    const trackerUrls = includeMagnet
        ? video.getTrackerUrls()
        : [];
    return (videoFiles || [])
        .filter(f => !f.isLive())
        .sort(sortByResolutionDesc)
        .map(videoFile => {
        var _a;
        return {
            resolution: {
                id: videoFile.resolution,
                label: videoFile.resolution === 0 ? 'Audio' : `${videoFile.resolution}p`
            },
            magnetUri: includeMagnet && videoFile.hasTorrent()
                ? (0, webtorrent_1.generateMagnetUri)(video, videoFile, trackerUrls)
                : undefined,
            size: videoFile.size,
            fps: videoFile.fps,
            torrentUrl: videoFile.getTorrentUrl(),
            torrentDownloadUrl: videoFile.getTorrentDownloadUrl(),
            fileUrl: videoFile.getFileUrl(video),
            fileDownloadUrl: videoFile.getFileDownloadUrl(video),
            metadataUrl: (_a = videoFile.metadataUrl) !== null && _a !== void 0 ? _a : (0, video_urls_1.getLocalVideoFileMetadataUrl)(video, videoFile)
        };
    });
}
exports.videoFilesModelToFormattedJSON = videoFilesModelToFormattedJSON;
function addVideoFilesInAPAcc(acc, video, files) {
    const trackerUrls = video.getTrackerUrls();
    const sortedFiles = (files || [])
        .filter(f => !f.isLive())
        .sort(sortByResolutionDesc);
    for (const file of sortedFiles) {
        acc.push({
            type: 'Link',
            mediaType: constants_1.MIMETYPES.VIDEO.EXT_MIMETYPE[file.extname],
            href: file.getFileUrl(video),
            height: file.resolution,
            size: file.size,
            fps: file.fps
        });
        acc.push({
            type: 'Link',
            rel: ['metadata', constants_1.MIMETYPES.VIDEO.EXT_MIMETYPE[file.extname]],
            mediaType: 'application/json',
            href: (0, video_urls_1.getLocalVideoFileMetadataUrl)(video, file),
            height: file.resolution,
            fps: file.fps
        });
        if (file.hasTorrent()) {
            acc.push({
                type: 'Link',
                mediaType: 'application/x-bittorrent',
                href: file.getTorrentUrl(),
                height: file.resolution
            });
            acc.push({
                type: 'Link',
                mediaType: 'application/x-bittorrent;x-scheme-handler/magnet',
                href: (0, webtorrent_1.generateMagnetUri)(video, file, trackerUrls),
                height: file.resolution
            });
        }
    }
}
function videoModelToActivityPubObject(video) {
    if (!video.Tags)
        video.Tags = [];
    const tag = video.Tags.map(t => ({
        type: 'Hashtag',
        name: t.name
    }));
    let language;
    if (video.language) {
        language = {
            identifier: video.language,
            name: getLanguageLabel(video.language)
        };
    }
    let category;
    if (video.category) {
        category = {
            identifier: video.category + '',
            name: getCategoryLabel(video.category)
        };
    }
    let licence;
    if (video.licence) {
        licence = {
            identifier: video.licence + '',
            name: getLicenceLabel(video.licence)
        };
    }
    const url = [
        {
            type: 'Link',
            mediaType: 'text/html',
            href: constants_1.WEBSERVER.URL + '/videos/watch/' + video.uuid
        }
    ];
    addVideoFilesInAPAcc(url, video, video.VideoFiles || []);
    for (const playlist of (video.VideoStreamingPlaylists || [])) {
        const tag = playlist.p2pMediaLoaderInfohashes
            .map(i => ({ type: 'Infohash', name: i }));
        tag.push({
            type: 'Link',
            name: 'sha256',
            mediaType: 'application/json',
            href: playlist.getSha256SegmentsUrl(video)
        });
        addVideoFilesInAPAcc(tag, video, playlist.VideoFiles || []);
        url.push({
            type: 'Link',
            mediaType: 'application/x-mpegURL',
            href: playlist.getMasterPlaylistUrl(video),
            tag
        });
    }
    for (const trackerUrl of video.getTrackerUrls()) {
        const rel2 = trackerUrl.startsWith('http')
            ? 'http'
            : 'websocket';
        url.push({
            type: 'Link',
            name: `tracker-${rel2}`,
            rel: ['tracker', rel2],
            href: trackerUrl
        });
    }
    const subtitleLanguage = [];
    for (const caption of video.VideoCaptions) {
        subtitleLanguage.push({
            identifier: caption.language,
            name: video_caption_1.VideoCaptionModel.getLanguageLabel(caption.language),
            url: caption.getFileUrl(video)
        });
    }
    const icons = [video.getMiniature(), video.getPreview()];
    return {
        type: 'Video',
        id: video.url,
        name: video.name,
        duration: getActivityStreamDuration(video.duration),
        uuid: video.uuid,
        tag,
        category,
        licence,
        language,
        views: video.views,
        sensitive: video.nsfw,
        waitTranscoding: video.waitTranscoding,
        isLiveBroadcast: video.isLive,
        aspectRatio: video.aspectRatio,
        liveSaveReplay: video.isLive
            ? video.VideoLive.saveReplay
            : null,
        permanentLive: video.isLive
            ? video.VideoLive.permanentLive
            : null,
        state: video.state,
        commentsEnabled: video.commentsEnabled,
        downloadEnabled: video.downloadEnabled,
        published: video.publishedAt.toISOString(),
        originallyPublishedAt: video.originallyPublishedAt
            ? video.originallyPublishedAt.toISOString()
            : null,
        updated: video.updatedAt.toISOString(),
        mediaType: 'text/markdown',
        content: video.description,
        support: video.support,
        subtitleLanguage,
        icon: icons.map(i => ({
            type: 'Image',
            url: i.getFileUrl(video),
            mediaType: 'image/jpeg',
            width: i.width,
            height: i.height
        })),
        url,
        likes: (0, url_1.getLocalVideoLikesActivityPubUrl)(video),
        dislikes: (0, url_1.getLocalVideoDislikesActivityPubUrl)(video),
        shares: (0, url_1.getLocalVideoSharesActivityPubUrl)(video),
        comments: (0, url_1.getLocalVideoCommentsActivityPubUrl)(video),
        attributedTo: [
            {
                type: 'Person',
                id: video.VideoChannel.Account.Actor.url
            },
            {
                type: 'Group',
                id: video.VideoChannel.Actor.url
            }
        ]
    };
}
exports.videoModelToActivityPubObject = videoModelToActivityPubObject;
function getActivityStreamDuration(duration) {
    return 'PT' + duration + 'S';
}
exports.getActivityStreamDuration = getActivityStreamDuration;
function getCategoryLabel(id) {
    return constants_1.VIDEO_CATEGORIES[id] || 'Misc';
}
exports.getCategoryLabel = getCategoryLabel;
function getLicenceLabel(id) {
    return constants_1.VIDEO_LICENCES[id] || 'Unknown';
}
exports.getLicenceLabel = getLicenceLabel;
function getLanguageLabel(id) {
    return constants_1.VIDEO_LANGUAGES[id] || 'Unknown';
}
exports.getLanguageLabel = getLanguageLabel;
function getPrivacyLabel(id) {
    return constants_1.VIDEO_PRIVACIES[id] || 'Unknown';
}
exports.getPrivacyLabel = getPrivacyLabel;
function getStateLabel(id) {
    return constants_1.VIDEO_STATES[id] || 'Unknown';
}
exports.getStateLabel = getStateLabel;