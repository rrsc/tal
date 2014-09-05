/**
 * @preserve Copyright (c) 2014 British Broadcasting Corporation
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
    this.SamsungMapleMediaPlayerTests = AsyncTestCase("SamsungMapleMediaPlayer");

    var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/mediaplayer/samsung_maple"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

    // Setup device specific mocking
    var deviceMockingHooks = {
        setup: function(sandbox, application) {

        },
        sendMetadata: function(mediaPlayer, currentTime, range) {
            mediaPlayer._range = range; // FIXME - do not do this in an actual implementation - replace it with proper event mock / whatever.
            mediaPlayer._currentTime = currentTime; // FIXME - do not do this in an actual implementation - replace it with proper event mock / whatever.
        },
        finishBuffering: function(mediaPlayer) {
            mediaPlayer._currentTime = mediaPlayer._targetSeekTime ? mediaPlayer._targetSeekTime : mediaPlayer._currentTime;  // FIXME - do not do this in an actual implementation - replace it with proper event mock / whatever.
            mediaPlayer._onFinishedBuffering(); // FIXME - do not do this in an actual implementation - replace it with proper event mock / whatever.
        },
        emitPlaybackError: function(mediaPlayer) {
            mediaPlayer._onDeviceError(); // FIXME - do not do this in an actual implementation - replace it with proper event mock / whatever.
        },
        reachEndOfMedia: function(mediaPlayer) {
            mediaPlayer._onEndOfMedia();  // FIXME - do not do this in an actual implementation - replace it with proper event mock / whatever.
        },
        startBuffering: function(mediaPlayer) {
            mediaPlayer._onDeviceBuffering();  // FIXME - do not do this in an actual implementation - replace it with proper event mock / whatever.
        },
        mockTime: function(mediaplayer) {
            // FIXME - Implementations can use this hook to set up fake timers if required
        },
        makeOneSecondPass: function(mediaplayer, time) {
            mediaplayer._onStatus();  // FIXME - do not do this in an actual implementation - replace it with proper event / setTimeout mock / whatever.
        },
        unmockTime: function(mediaplayer) {
            // FIXME - Implementations can use this hook to tear down fake timers if required
        }
    };

    this.SamsungMapleMediaPlayerTests.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.SamsungMapleMediaPlayerTests.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    //---------------------
    // Samsung Maple specific tests
    //---------------------

    // **** WARNING **** WARNING **** WARNING: These TODOs are NOT complete/exhaustive
    // TODO: Ensure errors are logged.
    // TODO: Ensure playFrom(...) and play() both clamp to the available range (there's a _getClampedTime helper in the MediaPlayer)
    // TODO: Check if we should comment in implementation that only one video component can be added to the design at a time - http://www.samsungdforum.com/Guide/tut00078/index.html
    // -- Not clear at time of writing if the tutorial is limiting it based on some sort of SDK/WYSIWYG restriction, or a Samsung Maple restriction
    // TODO: See if all three plugins required by the media/samsung_maple modifier are required
    // TODO: Investigate if we should keep a reference to the original player plugin and restore on tear-down in the same way media/samsung_maple modifier
    // TODO: Clean up methods added to window (for use as e.g. playerPlugin.OnRenderingComplete) on tear-down
    // TODO: Investigate if we should do the teardown in window.hide that is done in the media/samsung_maple modifier
    // -- "hide" is needed for newer devices
    // -- "unload" is needed for older devices - media/samsung_maple_unload
    // BE AWARE: Properties are set on the plugin that contain the name of a function on window which are the callback to call when the given event happens (e.g. media/samsung_maple.js:125)
    // TODO: Determine if we need to call our own time update method - media/samsung_maple calls it in a ocuple of places (onRenderingComplete and onCurrentPlayTime)
    // TODO: Determine if we should be disabling the screen saver (this is commented out in media/samsung_maple and the associated URL now 404s.
    // TODO: Determine if calls (e.g. JumpForward) are blocking
    // BE AWARE: JumpForward does not work consistently between either different points in the playback cycle, or depending on the age of the device: see media/samsung_maple:279-281

    //---------------------
    // Common tests
    //---------------------

    // Mixin the common tests shared by all MediaPlayer implementations (last, so it can detect conflicts)
    MixinCommonMediaTests(this.SamsungMapleMediaPlayerTests, "antie/devices/mediaplayer/samsung_maple", config, deviceMockingHooks);

})();
