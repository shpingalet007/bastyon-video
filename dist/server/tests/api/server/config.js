"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("mocha");
const chai = (0, tslib_1.__importStar)(require("chai"));
const extra_utils_1 = require("@shared/extra-utils");
const models_1 = require("@shared/models");
const expect = chai.expect;
function checkInitialConfig(server, data) {
    expect(data.instance.name).to.equal('PeerTube');
    expect(data.instance.shortDescription).to.equal('PeerTube, an ActivityPub-federated video streaming platform using P2P directly in your web browser.');
    expect(data.instance.description).to.equal('Welcome to this PeerTube instance!');
    expect(data.instance.terms).to.equal('No terms for now.');
    expect(data.instance.creationReason).to.be.empty;
    expect(data.instance.codeOfConduct).to.be.empty;
    expect(data.instance.moderationInformation).to.be.empty;
    expect(data.instance.administrator).to.be.empty;
    expect(data.instance.maintenanceLifetime).to.be.empty;
    expect(data.instance.businessModel).to.be.empty;
    expect(data.instance.hardwareInformation).to.be.empty;
    expect(data.instance.languages).to.have.lengthOf(0);
    expect(data.instance.categories).to.have.lengthOf(0);
    expect(data.instance.defaultClientRoute).to.equal('/videos/trending');
    expect(data.instance.isNSFW).to.be.false;
    expect(data.instance.defaultNSFWPolicy).to.equal('display');
    expect(data.instance.customizations.css).to.be.empty;
    expect(data.instance.customizations.javascript).to.be.empty;
    expect(data.services.twitter.username).to.equal('@Chocobozzz');
    expect(data.services.twitter.whitelisted).to.be.false;
    expect(data.cache.previews.size).to.equal(1);
    expect(data.cache.captions.size).to.equal(1);
    expect(data.cache.torrents.size).to.equal(1);
    expect(data.signup.enabled).to.be.true;
    expect(data.signup.limit).to.equal(4);
    expect(data.signup.minimumAge).to.equal(16);
    expect(data.signup.requiresEmailVerification).to.be.false;
    expect(data.admin.email).to.equal('admin' + server.internalServerNumber + '@example.com');
    expect(data.contactForm.enabled).to.be.true;
    expect(data.user.videoQuota).to.equal(5242880);
    expect(data.user.videoQuotaDaily).to.equal(-1);
    expect(data.transcoding.enabled).to.be.false;
    expect(data.transcoding.allowAdditionalExtensions).to.be.false;
    expect(data.transcoding.allowAudioFiles).to.be.false;
    expect(data.transcoding.threads).to.equal(2);
    expect(data.transcoding.concurrency).to.equal(2);
    expect(data.transcoding.profile).to.equal('default');
    expect(data.transcoding.resolutions['240p']).to.be.true;
    expect(data.transcoding.resolutions['360p']).to.be.true;
    expect(data.transcoding.resolutions['480p']).to.be.true;
    expect(data.transcoding.resolutions['720p']).to.be.true;
    expect(data.transcoding.resolutions['1080p']).to.be.true;
    expect(data.transcoding.resolutions['1440p']).to.be.true;
    expect(data.transcoding.resolutions['2160p']).to.be.true;
    expect(data.transcoding.webtorrent.enabled).to.be.true;
    expect(data.transcoding.hls.enabled).to.be.true;
    expect(data.live.enabled).to.be.false;
    expect(data.live.allowReplay).to.be.false;
    expect(data.live.maxDuration).to.equal(-1);
    expect(data.live.maxInstanceLives).to.equal(20);
    expect(data.live.maxUserLives).to.equal(3);
    expect(data.live.transcoding.enabled).to.be.false;
    expect(data.live.transcoding.threads).to.equal(2);
    expect(data.live.transcoding.profile).to.equal('default');
    expect(data.live.transcoding.resolutions['240p']).to.be.false;
    expect(data.live.transcoding.resolutions['360p']).to.be.false;
    expect(data.live.transcoding.resolutions['480p']).to.be.false;
    expect(data.live.transcoding.resolutions['720p']).to.be.false;
    expect(data.live.transcoding.resolutions['1080p']).to.be.false;
    expect(data.live.transcoding.resolutions['1440p']).to.be.false;
    expect(data.live.transcoding.resolutions['2160p']).to.be.false;
    expect(data.import.videos.concurrency).to.equal(2);
    expect(data.import.videos.http.enabled).to.be.true;
    expect(data.import.videos.torrent.enabled).to.be.true;
    expect(data.autoBlacklist.videos.ofUsers.enabled).to.be.false;
    expect(data.followers.instance.enabled).to.be.true;
    expect(data.followers.instance.manualApproval).to.be.false;
    expect(data.followings.instance.autoFollowBack.enabled).to.be.false;
    expect(data.followings.instance.autoFollowIndex.enabled).to.be.false;
    expect(data.followings.instance.autoFollowIndex.indexUrl).to.equal('');
    expect(data.broadcastMessage.enabled).to.be.false;
    expect(data.broadcastMessage.level).to.equal('info');
    expect(data.broadcastMessage.message).to.equal('');
    expect(data.broadcastMessage.dismissable).to.be.false;
}
function checkUpdatedConfig(data) {
    expect(data.instance.name).to.equal('PeerTube updated');
    expect(data.instance.shortDescription).to.equal('my short description');
    expect(data.instance.description).to.equal('my super description');
    expect(data.instance.terms).to.equal('my super terms');
    expect(data.instance.creationReason).to.equal('my super creation reason');
    expect(data.instance.codeOfConduct).to.equal('my super coc');
    expect(data.instance.moderationInformation).to.equal('my super moderation information');
    expect(data.instance.administrator).to.equal('Kuja');
    expect(data.instance.maintenanceLifetime).to.equal('forever');
    expect(data.instance.businessModel).to.equal('my super business model');
    expect(data.instance.hardwareInformation).to.equal('2vCore 3GB RAM');
    expect(data.instance.languages).to.deep.equal(['en', 'es']);
    expect(data.instance.categories).to.deep.equal([1, 2]);
    expect(data.instance.defaultClientRoute).to.equal('/videos/recently-added');
    expect(data.instance.isNSFW).to.be.true;
    expect(data.instance.defaultNSFWPolicy).to.equal('blur');
    expect(data.instance.customizations.javascript).to.equal('alert("coucou")');
    expect(data.instance.customizations.css).to.equal('body { background-color: red; }');
    expect(data.services.twitter.username).to.equal('@Kuja');
    expect(data.services.twitter.whitelisted).to.be.true;
    expect(data.cache.previews.size).to.equal(2);
    expect(data.cache.captions.size).to.equal(3);
    expect(data.cache.torrents.size).to.equal(4);
    expect(data.signup.enabled).to.be.false;
    expect(data.signup.limit).to.equal(5);
    expect(data.signup.requiresEmailVerification).to.be.false;
    expect(data.signup.minimumAge).to.equal(10);
    if ((0, extra_utils_1.parallelTests)() === false) {
        expect(data.admin.email).to.equal('superadmin1@example.com');
    }
    expect(data.contactForm.enabled).to.be.false;
    expect(data.user.videoQuota).to.equal(5242881);
    expect(data.user.videoQuotaDaily).to.equal(318742);
    expect(data.transcoding.enabled).to.be.true;
    expect(data.transcoding.threads).to.equal(1);
    expect(data.transcoding.concurrency).to.equal(3);
    expect(data.transcoding.allowAdditionalExtensions).to.be.true;
    expect(data.transcoding.allowAudioFiles).to.be.true;
    expect(data.transcoding.profile).to.equal('vod_profile');
    expect(data.transcoding.resolutions['240p']).to.be.false;
    expect(data.transcoding.resolutions['360p']).to.be.true;
    expect(data.transcoding.resolutions['480p']).to.be.true;
    expect(data.transcoding.resolutions['720p']).to.be.false;
    expect(data.transcoding.resolutions['1080p']).to.be.false;
    expect(data.transcoding.resolutions['2160p']).to.be.false;
    expect(data.transcoding.hls.enabled).to.be.false;
    expect(data.transcoding.webtorrent.enabled).to.be.true;
    expect(data.live.enabled).to.be.true;
    expect(data.live.allowReplay).to.be.true;
    expect(data.live.maxDuration).to.equal(5000);
    expect(data.live.maxInstanceLives).to.equal(-1);
    expect(data.live.maxUserLives).to.equal(10);
    expect(data.live.transcoding.enabled).to.be.true;
    expect(data.live.transcoding.threads).to.equal(4);
    expect(data.live.transcoding.profile).to.equal('live_profile');
    expect(data.live.transcoding.resolutions['240p']).to.be.true;
    expect(data.live.transcoding.resolutions['360p']).to.be.true;
    expect(data.live.transcoding.resolutions['480p']).to.be.true;
    expect(data.live.transcoding.resolutions['720p']).to.be.true;
    expect(data.live.transcoding.resolutions['1080p']).to.be.true;
    expect(data.live.transcoding.resolutions['2160p']).to.be.true;
    expect(data.import.videos.concurrency).to.equal(4);
    expect(data.import.videos.http.enabled).to.be.false;
    expect(data.import.videos.torrent.enabled).to.be.false;
    expect(data.autoBlacklist.videos.ofUsers.enabled).to.be.true;
    expect(data.followers.instance.enabled).to.be.false;
    expect(data.followers.instance.manualApproval).to.be.true;
    expect(data.followings.instance.autoFollowBack.enabled).to.be.true;
    expect(data.followings.instance.autoFollowIndex.enabled).to.be.true;
    expect(data.followings.instance.autoFollowIndex.indexUrl).to.equal('https://updated.example.com');
    expect(data.broadcastMessage.enabled).to.be.true;
    expect(data.broadcastMessage.level).to.equal('error');
    expect(data.broadcastMessage.message).to.equal('super bad message');
    expect(data.broadcastMessage.dismissable).to.be.true;
}
describe('Test config', function () {
    let server = null;
    before(function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            this.timeout(30000);
            server = yield (0, extra_utils_1.createSingleServer)(1);
            yield (0, extra_utils_1.setAccessTokensToServers)([server]);
        });
    });
    it('Should have a correct config on a server with registration enabled', function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const data = yield server.config.getConfig();
            expect(data.signup.allowed).to.be.true;
        });
    });
    it('Should have a correct config on a server with registration enabled and a users limit', function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            this.timeout(5000);
            yield Promise.all([
                server.users.register({ username: 'user1' }),
                server.users.register({ username: 'user2' }),
                server.users.register({ username: 'user3' })
            ]);
            const data = yield server.config.getConfig();
            expect(data.signup.allowed).to.be.false;
        });
    });
    it('Should have the correct video allowed extensions', function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const data = yield server.config.getConfig();
            expect(data.video.file.extensions).to.have.lengthOf(3);
            expect(data.video.file.extensions).to.contain('.mp4');
            expect(data.video.file.extensions).to.contain('.webm');
            expect(data.video.file.extensions).to.contain('.ogv');
            yield server.videos.upload({ attributes: { fixture: 'video_short.mkv' }, expectedStatus: models_1.HttpStatusCode.UNSUPPORTED_MEDIA_TYPE_415 });
            yield server.videos.upload({ attributes: { fixture: 'sample.ogg' }, expectedStatus: models_1.HttpStatusCode.UNSUPPORTED_MEDIA_TYPE_415 });
            expect(data.contactForm.enabled).to.be.true;
        });
    });
    it('Should get the customized configuration', function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const data = yield server.config.getCustomConfig();
            checkInitialConfig(server, data);
        });
    });
    it('Should update the customized configuration', function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const newCustomConfig = {
                instance: {
                    name: 'PeerTube updated',
                    shortDescription: 'my short description',
                    description: 'my super description',
                    terms: 'my super terms',
                    codeOfConduct: 'my super coc',
                    creationReason: 'my super creation reason',
                    moderationInformation: 'my super moderation information',
                    administrator: 'Kuja',
                    maintenanceLifetime: 'forever',
                    businessModel: 'my super business model',
                    hardwareInformation: '2vCore 3GB RAM',
                    languages: ['en', 'es'],
                    categories: [1, 2],
                    isNSFW: true,
                    defaultNSFWPolicy: 'blur',
                    defaultClientRoute: '/videos/recently-added',
                    customizations: {
                        javascript: 'alert("coucou")',
                        css: 'body { background-color: red; }'
                    }
                },
                theme: {
                    default: 'default'
                },
                services: {
                    twitter: {
                        username: '@Kuja',
                        whitelisted: true
                    }
                },
                cache: {
                    previews: {
                        size: 2
                    },
                    captions: {
                        size: 3
                    },
                    torrents: {
                        size: 4
                    }
                },
                signup: {
                    enabled: false,
                    limit: 5,
                    requiresEmailVerification: false,
                    minimumAge: 10
                },
                admin: {
                    email: 'superadmin1@example.com'
                },
                contactForm: {
                    enabled: false
                },
                user: {
                    videoQuota: 5242881,
                    videoQuotaDaily: 318742
                },
                transcoding: {
                    enabled: true,
                    allowAdditionalExtensions: true,
                    allowAudioFiles: true,
                    threads: 1,
                    concurrency: 3,
                    profile: 'vod_profile',
                    resolutions: {
                        '0p': false,
                        '240p': false,
                        '360p': true,
                        '480p': true,
                        '720p': false,
                        '1080p': false,
                        '1440p': false,
                        '2160p': false
                    },
                    webtorrent: {
                        enabled: true
                    },
                    hls: {
                        enabled: false
                    }
                },
                live: {
                    enabled: true,
                    allowReplay: true,
                    maxDuration: 5000,
                    maxInstanceLives: -1,
                    maxUserLives: 10,
                    transcoding: {
                        enabled: true,
                        threads: 4,
                        profile: 'live_profile',
                        resolutions: {
                            '240p': true,
                            '360p': true,
                            '480p': true,
                            '720p': true,
                            '1080p': true,
                            '1440p': true,
                            '2160p': true
                        }
                    }
                },
                import: {
                    videos: {
                        concurrency: 4,
                        http: {
                            enabled: false
                        },
                        torrent: {
                            enabled: false
                        }
                    }
                },
                trending: {
                    videos: {
                        algorithms: {
                            enabled: ['best', 'hot', 'most-viewed', 'most-liked'],
                            default: 'hot'
                        }
                    }
                },
                autoBlacklist: {
                    videos: {
                        ofUsers: {
                            enabled: true
                        }
                    }
                },
                followers: {
                    instance: {
                        enabled: false,
                        manualApproval: true
                    }
                },
                followings: {
                    instance: {
                        autoFollowBack: {
                            enabled: true
                        },
                        autoFollowIndex: {
                            enabled: true,
                            indexUrl: 'https://updated.example.com'
                        }
                    }
                },
                broadcastMessage: {
                    enabled: true,
                    level: 'error',
                    message: 'super bad message',
                    dismissable: true
                },
                search: {
                    remoteUri: {
                        anonymous: true,
                        users: true
                    },
                    searchIndex: {
                        enabled: true,
                        url: 'https://search.joinpeertube.org',
                        disableLocalSearch: true,
                        isDefaultSearch: true
                    }
                }
            };
            yield server.config.updateCustomConfig({ newCustomConfig });
            const data = yield server.config.getCustomConfig();
            checkUpdatedConfig(data);
        });
    });
    it('Should have the correct updated video allowed extensions', function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            this.timeout(10000);
            const data = yield server.config.getConfig();
            expect(data.video.file.extensions).to.have.length.above(4);
            expect(data.video.file.extensions).to.contain('.mp4');
            expect(data.video.file.extensions).to.contain('.webm');
            expect(data.video.file.extensions).to.contain('.ogv');
            expect(data.video.file.extensions).to.contain('.flv');
            expect(data.video.file.extensions).to.contain('.wmv');
            expect(data.video.file.extensions).to.contain('.mkv');
            expect(data.video.file.extensions).to.contain('.mp3');
            expect(data.video.file.extensions).to.contain('.ogg');
            expect(data.video.file.extensions).to.contain('.flac');
            yield server.videos.upload({ attributes: { fixture: 'video_short.mkv' }, expectedStatus: models_1.HttpStatusCode.OK_200 });
            yield server.videos.upload({ attributes: { fixture: 'sample.ogg' }, expectedStatus: models_1.HttpStatusCode.OK_200 });
        });
    });
    it('Should have the configuration updated after a restart', function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            this.timeout(30000);
            yield (0, extra_utils_1.killallServers)([server]);
            yield server.run();
            const data = yield server.config.getCustomConfig();
            checkUpdatedConfig(data);
        });
    });
    it('Should fetch the about information', function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const data = yield server.config.getAbout();
            expect(data.instance.name).to.equal('PeerTube updated');
            expect(data.instance.shortDescription).to.equal('my short description');
            expect(data.instance.description).to.equal('my super description');
            expect(data.instance.terms).to.equal('my super terms');
            expect(data.instance.codeOfConduct).to.equal('my super coc');
            expect(data.instance.creationReason).to.equal('my super creation reason');
            expect(data.instance.moderationInformation).to.equal('my super moderation information');
            expect(data.instance.administrator).to.equal('Kuja');
            expect(data.instance.maintenanceLifetime).to.equal('forever');
            expect(data.instance.businessModel).to.equal('my super business model');
            expect(data.instance.hardwareInformation).to.equal('2vCore 3GB RAM');
            expect(data.instance.languages).to.deep.equal(['en', 'es']);
            expect(data.instance.categories).to.deep.equal([1, 2]);
        });
    });
    it('Should remove the custom configuration', function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            this.timeout(10000);
            yield server.config.deleteCustomConfig();
            const data = yield server.config.getCustomConfig();
            checkInitialConfig(server, data);
        });
    });
    it('Should enable frameguard', function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            this.timeout(25000);
            {
                const res = yield (0, extra_utils_1.makeGetRequest)({
                    url: server.url,
                    path: '/api/v1/config',
                    expectedStatus: 200
                });
                expect(res.headers['x-frame-options']).to.exist;
            }
            yield (0, extra_utils_1.killallServers)([server]);
            const config = {
                security: {
                    frameguard: { enabled: false }
                }
            };
            yield server.run(config);
            {
                const res = yield (0, extra_utils_1.makeGetRequest)({
                    url: server.url,
                    path: '/api/v1/config',
                    expectedStatus: 200
                });
                expect(res.headers['x-frame-options']).to.not.exist;
            }
        });
    });
    after(function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            yield (0, extra_utils_1.cleanupTests)([server]);
        });
    });
});