/**
 * Heavily modified plain JS fork of github.com/nornagon/atom
 */

var input = require('./input');
var exports;

/**
 * @param {object} [options]
 * @param {function} [options.update]
 * @param {function} [options.draw]
 * @constructor
 */
function Game(options) {
    init.call(this);

    if (options) {
        this.update = options.update || this.update;
        this.draw   = options.draw || this.draw;
    }
}
Game.prototype.update = function update(dt) {};
Game.prototype.draw   = function draw() {};
Game.prototype.run    = function run() {
    var that = this;

    function s() {
        that.step();
        that.frameRequest = requestAnimationFrame(s);
    }

    if (!this.running) {
        this.running      = true;
        this.last_step    = Date.now();
        this.frameRequest = requestAnimationFrame(s);
    }
};

Game.prototype.stop = function stop() {
    if (this.frameRequest) {
        cancelAnimationFrame(this.frameRequest);
    }
    this.frameRequest = null;
    this.running      = false;
};

Game.prototype.step = function step() {
    var now        = Date.now();
    var dt         = (now - this.last_step ) / 1000;
    this.last_step = now;
    this.update(dt);
    this.draw();
    input.clearPressed();
};

function init() {
    if(isAtomReady) {
        return;
    }

    var that = this;

    document.onkeydown = input.onKeyDown;
    document.onkeyup   = input.onKeyUp;
    //document.onmouseup = input.onMouseUp;

    var canvas   = document.createElement('canvas');
    document.body.appendChild(canvas);
    this.canvas  = canvas;
    this.context = canvas.getContext('2d');

    this.context.clear = function () {
        this.clearRect(0, 0, that.width, that.height);
    };

    canvas.onmousemove   = input.onMouseMove;
    canvas.onmousedown   = input.onMouseDown;
    canvas.onmouseup     = input.onMouseUp;
    canvas.onmousewheel  = input.onMouseWheel;
    canvas.oncontextmenu = input.onContextMenu;
    canvas.ontouchstart  = input.onTouchStart;
    canvas.ontouchmove   = input.onTouchMove;
    canvas.ontouchend    = input.onTouchEnd;
    canvas.ontouchcancel = input.onTouchEnd;
    canvas.ontouchleave  = input.onTouchEnd;

    window.onresize = function () {
        that.canvas.width  = window.innerWidth;
        that.canvas.height = window.innerHeight;
        that.width         = that.canvas.width;
        that.height        = that.canvas.height;
    };

    window.onresize();

    isAtomReady = true;
}

function loadSound(url, callback, name) {
    if (this.audioContext) {
        var that             = this;
        var request          = new XMLHttpRequest();
        request.responseType = 'arraybuffer';

        request.open('GET', url, true);

        request.onload = function () {
            that.audioContext.decodeAudioData(
                request.response,
                function (buffer) {
                    if (callback) {
                        callback(null, buffer, name);
                    }
                },
                function (error) {
                    if (callback) {
                        callback(error);
                    }
                }
            );
        };

        try {
            request.send();
        } catch (e) {
            if (callback) {
                callback(e.message);
            }
        }

    } else {
        callback('No audio support');
    }
}

var SFX = {};

function preloadSounds(soundDict, callback) {
    this.audioContext = new AudioContext();
    this._mixer       = this.audioContext.createGain();
    this._mixer.connect(this.audioContext.destination);

    var toLoad = 0;
    var soundName;
    var that   = this;

    function loadCb(error, buffer, name) {
        if (error) {
            console.error(error);
        }

        if (buffer) {
            that.SFX[name] = buffer;
        }

        toLoad--;

        if (callback && toLoad === 0) {
            callback();
        }
    }

    if (this.audioContext) {
        for (soundName in soundDict) {
            var soundUrl = soundDict[soundName];
            toLoad++;
            loadSound.call(this, soundUrl, loadCb, soundName);
        }
    } else {
        if (callback) {
            callback('No audio support');
        }
    }
}

function playSound(name) {
    // todo: add audio sprite support with AudioBufferSourceNode.loopStart
    // AudioBufferSourceNode.loopEnd
    var buffer = this.SFX[name];
    if (buffer && this.audioContext) {
        var source    = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this._mixer);
        source.start();
        return source;
    }
}

function setVolume(v) {
    this._mixer.gain.value = v;
}

var GFX = {};

function loadImage(url, callback, name) {
    try {
        var request     = new Image();
        request.onload  = function () {
            if (callback) {
                callback(null, request, name);
            }
        };
        request.onerror = function (error) {
            if (callback) {
                callback(error);
            }
        };

        request.src = url;
    } catch (e) {
        if (callback) {
            callback(error);
        }
    }
}

function preloadImages(imageDict, callback) {
    var toLoad = 0;
    var that   = this;
    var imageName;

    function loadCb(error, imageObj, name) {
        if (error) {
            console.error(error);
        }

        if (imageObj) {
            that.GFX[name] = imageObj;
        }

        toLoad--;

        if (callback && toLoad === 0) {
            callback();
        }
    }

    for (imageName in imageDict) {
        var imageUrl = imageDict[imageName];
        toLoad++;
        loadImage.call(this, imageUrl, loadCb, imageName);
    }
}

/**
 * True if atom.init() been called.
 * @type {boolean}
 */
var isAtomReady = false;

exports = {
    init : init,
    Game : Game,

    loadImage     : loadImage,
    preloadImages : preloadImages,

    loadSound     : loadSound,
    preloadSounds : preloadSounds,
    playSound     : playSound,
    setVolume     : setVolume,

    GFX   : GFX,
    SFX   : SFX,
    input : input
};

if(typeof module !== 'undefined' && module.exports) {
    module.exports = exports;
} else {
    window.atom = exports;
}
