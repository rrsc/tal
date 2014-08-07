/**
 * @preserve Copyright (c) 2013 British Broadcasting Corporation
 * (http://www.bbc.co.uk) and TAL Contributors (1)
 *
 * (1) TAL Contributors are listed in the AUTHORS file and at
 *     https://github.com/fmtvp/TAL/AUTHORS - please extend this file,
 *     not this notice.
 *
 * @license Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * All rights reserved
 * Please contact us for an alternative licence
 */

(function() {
    this.MediaPlayerTest = AsyncTestCase("MediaPlayerTest");

    this.MediaPlayerTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.MediaPlayerTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    this.MediaPlayerTest.prototype.testMediaPlayerInitDoesNotThrowAnExceptionWhenCalled = function (queue) {
        expectAsserts(1);
        queuedRequire(queue, ["antie/devices/mediaplayer/mediaplayer"], function(MediaPlayer) {
            assertNoException(function() {
                new MediaPlayer();
            });
        });
    };

    var createSubClass = function(MediaPlayer) {
        return MediaPlayer.extend({
            doEvent: function(type) {
                this._emitEvent(type);
            },
            getSource: function () { return "url"; },
            getMimeType: function () { return "mime/type"; },
            getCurrentTime: function () { return 0; },
            getRange: function () { return { start: 0, end: 100 }; },
            getState: function () { return MediaPlayer.STATE.PLAYING; }
        });
    };

    this.MediaPlayerTest.prototype.testEventsEmittedBySubclassGoToAddedCallbackWithAllMetadata = function (queue) {
        expectAsserts(2);
        queuedRequire(queue, ["antie/devices/mediaplayer/mediaplayer"], function(MediaPlayer) {

            var SubClass = createSubClass(MediaPlayer);
            var instance = new SubClass();
            var callback = this.sandbox.stub();

            instance.addEventCallback(null, callback);
            instance.doEvent(MediaPlayer.EVENT.STATUS);

            assert(callback.calledOnce);
            assert(callback.calledWith({
                type: MediaPlayer.EVENT.STATUS,
                currentTime: 0,
                range: { start: 0, end: 100 },
                url: "url",
                mimeType: "mime/type",
                state: MediaPlayer.STATE.PLAYING
            }));
        });
    };

    this.MediaPlayerTest.prototype.testEventsEmittedBySubclassHaveMetaDataCollectedFromAccessors = function (queue) {
        expectAsserts(2);
        queuedRequire(queue, ["antie/devices/mediaplayer/mediaplayer"], function(MediaPlayer) {

            var SubClass = MediaPlayer.extend({
                doEvent: function(type) {
                    this._emitEvent(type);
                },
                getSource: function () { return "url2"; },
                getMimeType: function () { return "mime/type2"; },
                getCurrentTime: function () { return 2; },
                getRange: function () { return { start: 22, end: 200 }; },
                getState: function () { return MediaPlayer.STATE.BUFFERING; }
            });

            var instance = new SubClass();
            var callback = this.sandbox.stub();

            instance.addEventCallback(null, callback);
            instance.doEvent(MediaPlayer.EVENT.BUFFERING);

            assert(callback.calledOnce);
            assert(callback.calledWith({
                type: MediaPlayer.EVENT.BUFFERING,
                currentTime: 2,
                range: { start: 22, end: 200 },
                url: "url2",
                mimeType: "mime/type2",
                state: MediaPlayer.STATE.BUFFERING
            }));
        });
    };

    this.MediaPlayerTest.prototype.testEventsEmittedBySubclassDoNotGoToSpecificallyRemovedCallback = function (queue) {
        expectAsserts(2);
        queuedRequire(queue, ["antie/devices/mediaplayer/mediaplayer"], function(MediaPlayer) {

            var SubClass = createSubClass(MediaPlayer);
            var instance = new SubClass();
            var callback = this.sandbox.stub();
            var callback2 = this.sandbox.stub();

            instance.addEventCallback(null, callback);
            instance.addEventCallback(null, callback2);
            instance.removeEventCallback(null, callback);
            instance.doEvent(MediaPlayer.EVENT.STATUS);

            assert(callback.notCalled);
            assert(callback2.calledOnce);
        });
    };

    this.MediaPlayerTest.prototype.testEventsEmittedBySubclassDoNotGoToAnyRemovedCallback = function (queue) {
        expectAsserts(2);
        queuedRequire(queue, ["antie/devices/mediaplayer/mediaplayer"], function(MediaPlayer) {

            var SubClass = createSubClass(MediaPlayer);
            var instance = new SubClass();
            var callback = this.sandbox.stub();
            var callback2 = this.sandbox.stub();

            instance.addEventCallback(null, callback);
            instance.addEventCallback(null, callback2);
            instance.removeAllEventCallbacks();
            instance.doEvent(MediaPlayer.EVENT.STATUS);

            assert(callback.notCalled);
            assert(callback2.notCalled);
        });
    };


    var testThatMediaPlayerFunctionThrowsError = function (action) {
        return function (queue) {
            expectAsserts(1);
            queuedRequire(queue, ["antie/devices/mediaplayer/mediaplayer"], function(MediaPlayer) {
                var mediaPlayer = new MediaPlayer();
                assertException(function() {
                    action(mediaPlayer);
                }, "Error");
            });
        };
    };

    this.MediaPlayerTest.prototype.testMediaPlayerSetSourceThrowsAnExceptionWhenNotOverridden = testThatMediaPlayerFunctionThrowsError(function(mediaPlayer) {
        mediaPlayer.setSource('url', 'mime');
    });

    this.MediaPlayerTest.prototype.testMediaPlayerpPlayThrowsAnExceptionWhenNotOverridden = testThatMediaPlayerFunctionThrowsError(function(mediaPlayer) {
        mediaPlayer.play();
    });

    this.MediaPlayerTest.prototype.testMediaPlayerPlayFromThrowsAnExceptionWhenNotOverridden = testThatMediaPlayerFunctionThrowsError(function(mediaPlayer) {
        mediaPlayer.playFrom("jumbo");
    });

    this.MediaPlayerTest.prototype.testMediaPlayerPauseThrowsAnExceptionWhenNotOverridden = testThatMediaPlayerFunctionThrowsError(function(mediaPlayer) {
        mediaPlayer.pause();
    });

    this.MediaPlayerTest.prototype.testMediaPlayerStopThrowsAnExceptionWhenNotOverridden = testThatMediaPlayerFunctionThrowsError(function(mediaPlayer) {
        mediaPlayer.stop();
    });

    this.MediaPlayerTest.prototype.testMediaPlayerResetThrowsAnExceptionWhenNotOverridden = testThatMediaPlayerFunctionThrowsError(function(mediaPlayer) {
        mediaPlayer.reset();
    });

    this.MediaPlayerTest.prototype.testMediaPlayerGetSourceThrowsAnExceptionWhenNotOverridden = testThatMediaPlayerFunctionThrowsError(function(mediaPlayer) {
        mediaPlayer.getSource();
    });

    this.MediaPlayerTest.prototype.testMediaPlayerGetMimeTypeThrowsAnExceptionWhenNotOverridden = testThatMediaPlayerFunctionThrowsError(function(mediaPlayer) {
        mediaPlayer.getMimeType();
    });

    this.MediaPlayerTest.prototype.testMediaPlayerGetCurrentTimeThrowsAnExceptionWhenNotOverridden = testThatMediaPlayerFunctionThrowsError(function(mediaPlayer) {
        mediaPlayer.getCurrentTime();
    });

    this.MediaPlayerTest.prototype.testMediaPlayerGetRangeThrowsAnExceptionWhenNotOverridden = testThatMediaPlayerFunctionThrowsError(function(mediaPlayer) {
        mediaPlayer.getRange();
    });

    this.MediaPlayerTest.prototype.testMediaPlayerGetStateThrowsAnExceptionWhenNotOverridden = testThatMediaPlayerFunctionThrowsError(function(mediaPlayer) {
        mediaPlayer.getState();
    });

})();