(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./input":2}],2:[function(require,module,exports){
/**
 * @constant
 * @enum {number}
 */
var KEY = {
    MOUSE_LEFT       : -1,
    MOUSE_MIDDLE     : -2,
    MOUSE_RIGHT      : -3,
    MOUSE_WHEEL_DOWN : -4,
    MOUSE_WHEEL_UP   : -5,

    TAB         : 9,
    ENTER       : 13,
    ESC         : 27,
    SPACE       : 32,
    LEFT_ARROW  : 37,
    UP_ARROW    : 38,
    RIGHT_ARROW : 39,
    DOWN_ARROW  : 40,

    "A" : 65,
    "B" : 66,
    "C" : 67,
    "D" : 68,
    "E" : 69,
    "F" : 70,
    "G" : 71,
    "H" : 72,
    "I" : 73,
    "J" : 74,
    "K" : 75,
    "L" : 76,
    "M" : 77,
    "N" : 78,
    "O" : 79,
    "P" : 80,
    "Q" : 81,
    "R" : 82,
    "S" : 83,
    "T" : 84,
    "U" : 85,
    "V" : 86,
    "W" : 87,
    "X" : 88,
    "Y" : 89,
    "Z" : 90,

    // Touch devices
    TOUCHING: 1000
};

/**
 * @param {Event} e
 * @returns {number}
 */
function getInputEventCode(e) {
    if (e instanceof KeyboardEvent) {
        if (e.type === 'keydown' || e.type === 'keyup') {
            return e.keyCode;
        }
    } else if (e instanceof MouseEvent) {
        if (e.type === 'mousedown' || e.type === 'mouseup') {
            if (e.button === 0) {
                return KEY.MOUSE_LEFT;
            } else if (e.button === 1) {
                return KEY.MOUSE_MIDDLE;
            } else if (e.button === 2) {
                return KEY.MOUSE_RIGHT;
            }
        }
    } else if (e instanceof WheelEvent) {
        if (e.type === 'mousewheel') {
            if (e.wheel > 0) {
                return KEY.MOUSE_WHEEL_UP;
            } else {
                return KEY.MOUSE_WHEEL_DOWN;
            }
        }
    } else if (e.type === 'touchstart' || e.type === 'touchend' || e.type === 'touchcancel' || e.type === 'touchleave') {
        return KEY.TOUCHING;
    }
}

/** Dictionary of input keys that will be handled */
var bindings = {};

/** Dictionary of input keys that are currently down (if true) */
var down = {};

/** Dictionary of input keys that have been pressed within the last game cycle */
var pressed = {};

/** Dictionary of input keys that have been released within the last game cycle */
var released = [];

var mouse = { x : 0, y : 0 };

function bindEvent(key, action) {
    bindings[key] = action;
}

function clearPressed() {
    released.forEach(function (action) {
        down[action] = false;
    });

    released = [];
    pressed  = {};
}

function onKeyDown(e) {
    var action = bindings[getInputEventCode(e)];
    if (action) {
        if (!down[action]) {
            pressed[action] = true;
        }

        down[action] = true;
    }

    e.stopPropagation();
    e.preventDefault();
}

function onKeyUp(e) {
    var action = bindings[getInputEventCode(e)];
    if (action) {
        released.push(action);
    }

    e.stopPropagation();
    e.preventDefault();
}

function onMouseMove(e) {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
}

function onMouseDown(e) { onKeyDown(e); }
function onMouseUp(e) { onKeyUp(e); }
function onMouseWheel(e) {
    onKeyDown(e);
    onKeyUp(e);
}

function onTouchMove(e) {
    mouse.x = e.changedTouches[0].pageX;
    mouse.y = e.changedTouches[0].pageY;
};

function onTouchStart(e) {
    mouse.x = e.changedTouches[0].pageX;
    mouse.y = e.changedTouches[0].pageY;
    onKeyDown(e);
};

function onTouchEnd(e) {
    mouse.x = e.changedTouches[0].pageX;
    mouse.y = e.changedTouches[0].pageY;
    onKeyUp(e);
}

function onContextMenu(e) {
    if (bindings[KEY.MOUSE_RIGHT]) {
        e.stopPropagation();
        e.preventDefault();
    }
}

function isPressed(action) {
    return pressed[action];
}

function isDown(action) {
    return down[action];
}

function isReleased(action) {
    return action in released;
}

function getMouse(){
    return {
        x : mouse.x,
        y : mouse.y
    };
}

module.exports = {
    getMouse : getMouse,

    KEY : KEY,

    isPressed  : isPressed,
    isDown     : isDown,
    isReleased : isReleased,

    bindEvent    : bindEvent,
    clearPressed : clearPressed,

    onKeyDown : onKeyDown,
    onKeyUp   : onKeyUp,

    onMouseDown   : onMouseDown,
    onMouseUp     : onMouseUp,
    onMouseMove   : onMouseMove,
    onMouseWheel  : onMouseWheel,
    onContextMenu : onContextMenu
};
},{}],3:[function(require,module,exports){
var $$ = require('./util');

function Bubble(params) {
    var k, v;
    for (k in params) {
        v = params[k];
        this[k] = v;
    }
    this.SPRITENAME = "bubble" + ($$.WR(this.SIZES));
    this.dy = -$$.r(1.9) - 3.25;
    this.lifetime = 0;
    this.amplitude = $$.r(3);
}

Bubble.prototype.x = 0;

Bubble.prototype.y = 0;

Bubble.prototype.hashable = false;

Bubble.prototype.SPRITENAME = null;

Bubble.prototype.GFX = {
    'bubble4': {
        W: 4,
        H: 4,
        W_2: 2,
        H_2: 2
    },
    'bubble6': {
        W: 6,
        H: 6,
        W_2: 3,
        H_2: 3
    },
    'bubble8': {
        W: 8,
        H: 8,
        W_2: 4,
        H_2: 4
    },
    'bubble12': {
        W: 12,
        H: 12,
        W_2: 6,
        H_2: 6
    },
    'bubble16': {
        W: 16,
        H: 16,
        W_2: 8,
        H_2: 8
    },
    'bubble24': {
        W: 24,
        H: 24,
        W_2: 12,
        H_2: 12
    },
    'bubble32': {
        W: 32,
        H: 32,
        W_2: 16,
        H_2: 16
    }
};

Bubble.prototype.dx = 0;

Bubble.prototype.lifetime = 0;

Bubble.prototype.draw = function() {
    var ac, sprite;
    ac = this.game.context;
    ac.globalAlpha = 0.3;
    sprite = atom.GFX[this.SPRITENAME];
    ac.drawImage(sprite, this.x - this.GFX[this.SPRITENAME].W_2 + this.amplitude * Math.sin(this.lifetime), this.y - this.GFX[this.SPRITENAME].H_2);
    this.lifetime++;
    return ac.globalAlpha = 1;
};

Bubble.prototype.remove = function() {
    this.move = null;
    return this.game = null;
};

Bubble.prototype.move = function() {
    if (this.y < -this.GFX[this.SPRITENAME].H_2 || this.x < -this.GFX[this.SPRITENAME].W_2) {
        this.move = null;
        return this.game = null;
    } else {
        this.y += this.dy;
        return this.x += 2 * this.game.current;
    }
};

Bubble.prototype.SIZES = {
    '4': 1,
    '6': 2,
    '8': 3,
    '12': 2,
    '16': 2,
    '24': 1,
    '32': 1
};


module.exports = Bubble;
},{"./util":15}],4:[function(require,module,exports){
var $$ = require('./util');

function Fish(params) {
    var k, v;
    for (k in params) {
        v = params[k];
        this[k] = v;
    }
    if (!(this.speed != null)) {
        this.speed = {
            x: 0,
            y: 0,
            normalizationFactor: $$.r(0.27) + 0.51
        };
    }
    if (this.player) {
        this.game.addFish();
    }
    if (this.dSpeed == null) {
        this.dSpeed = $$.r(0.12) + 0.13;
    }
    if (this.maxSpeed == null) {
        this.maxSpeed = $$.r(8) + 4;
    }
    this.frame = $$.R(0, this.LASTFRAME);
    this.SPRITENAME = $$.WR(this.FISHCHANCE);
    this.SPRITE = atom.GFX[this.SPRITENAME];
    this.updateHitRadius();
}

Fish.prototype.x = 0;

Fish.prototype.y = 0;

Fish.prototype.w = 8;

Fish.prototype.h = 6;

Fish.prototype.rotation = 0;

Fish.prototype.framedelay = 0;

Fish.prototype.FRAMEDELAYMOD = 2;

Fish.prototype.frame = 0;

Fish.prototype.LASTFRAME = 7;

Fish.prototype.SPRITE = null;

Fish.prototype.SPRITENAME = null;

Fish.prototype.GFX = {
    'fledgeling0': {
        W: 28,
        H: 17
    },
    'fledgeling1': {
        W: 54,
        H: 34
    },
    'fish00': {
        W: 46,
        H: 31
    },
    'fish01': {
        W: 116,
        H: 77
    },
    'fish10': {
        W: 46,
        H: 31
    },
    'fish11': {
        W: 116,
        H: 77
    },
    'fish20': {
        W: 50,
        H: 34
    },
    'fish21': {
        W: 125,
        H: 86
    }
};

Fish.prototype.FISHCHANCE = {
    'fledgeling0': 12,
    'fledgeling1': 12,
    'fish00': 7,
    'fish10': 4
};

Fish.prototype.speed = null;

Fish.prototype.dSpeed = $$.r(0.31) + 0.27;

Fish.prototype.maxSpeed = $$.r(10) + 2;

Fish.prototype.fatnessPenalty = 0.987;

Fish.prototype.energyBoost = 1.00073;

Fish.prototype.caught = false;

Fish.prototype.player = false;

Fish.prototype.recruitFailed = false;

Fish.prototype.hashable = true;

Fish.prototype.chase = {
    w_2: 32,
    h_2: 32
};

Fish.prototype.target = atom.input.getMouse;

Fish.prototype.normalizeSpeed = function() {
    if ((Math.abs(this.x - this.target.x) < this.chase.w_2) && (Math.abs(this.y - this.target.y) < this.chase.h_2)) {
        if (!(Math.abs(this.speed.x) < this.maxSpeed * 0.4)) {
            this.speed.x *= this.speed.normalizationFactor * 0.71;
        }
        if (!(Math.abs(this.speed.y) < this.maxSpeed * 0.4)) {
            return this.speed.y *= this.speed.normalizationFactor * 0.71;
        }
    } else {
        if (!(Math.abs(this.speed.x) < this.maxSpeed)) {
            this.speed.x *= this.speed.normalizationFactor;
        }
        if (!(Math.abs(this.speed.y) < this.maxSpeed)) {
            return this.speed.y *= this.speed.normalizationFactor;
        }
    }
};

Fish.prototype.setRotation = function() {
    return this.rotation = Math.atan2(this.speed.y, this.speed.x);
};

Fish.prototype.chaseTarget = function() {
    var target = this.target;

    if (target instanceof Function) {
        target = target();
    }

    if (this.x > target.x) {
        this.speed.x -= this.dSpeed;
    } else {
        this.speed.x += this.dSpeed;
    }
    if (this.y > target.y) {
        return this.speed.y -= this.dSpeed;
    } else {
        return this.speed.y += this.dSpeed;
    }
};

Fish.prototype.move = function() {
    if (this.caught) {
        if (this.x < 0 || this.y < 0) {
            return this.remove();
        } else {
            this.x = this.catcher.x;
            return this.y = this.catcher.y;
        }
    } else {
        if (this.player === false && this.recruitFailed === false) {
            this.checkHits();
        }
        this.x += this.speed.x;
        this.y += this.speed.y;
        this.x += this.game.current;
        this.chaseTarget();
        this.normalizeSpeed();
        return this.setRotation();
    }
};

Fish.prototype.recruit = function(recruiter) {
    var charisma;
    charisma = (this.r2 - recruiter.r2) / this.r2;
    if (($$.r() > charisma) || $$.r() < 0.0015) {
        if (this.target.constructor.name === 'Swarm') {
            this.target.children[this.target.children.indexOf(this)] = null;
        }
        atom.playSound('recruit');
        this.target = atom.input.getMouse;
        this.player = true;
        this.game.addFish();
    } else {
        atom.playSound('ahahah');
        this.recruitFailed = true;
    }
};

Fish.prototype.collectRoe = function(n) {
    atom.playSound('roe');
    return this.game.player.roe += n;
};

Fish.prototype.hooked = function(e) {
    this.catcher = e;
    return this.caught = true;
};

Fish.prototype.eat = function() {
    if (this.player) {
        this.game.player.fat++;
    }
    this.dSpeed *= this.fatnessPenalty;
    return this.maxSpeed *= this.energyBoost;
};

Fish.prototype.draw = function() {
    var ac, properties;
    ac = this.game.context;
    ac.save();
    ac.translate(this.x, this.y);
    if (this.rotation !== 0) {
        ac.rotate(this.rotation);
    }
    properties = this.GFX[this.SPRITENAME];
    ac.drawImage(this.SPRITE, 0, this.frame * properties.H, properties.W, properties.H, -properties.W + (properties.W >> 1), -properties.H >> 1, properties.W, properties.H);
    if (!this.caught) {
        if (this.framedelay % this.FRAMEDELAYMOD === 0) {
            this.framedelay = this.FRAMEDELAYMOD + 1;
            this.frame++;
            if (this.frame > this.LASTFRAME) {
                this.frame = 0;
            }
        } else {
            this.framedelay++;
        }
    }
    return ac.restore();
};

Fish.prototype.checkHits = function() {
    var bin, entity, _i, _len;
    bin = this.game.hash2d.get(this);
    for (_i = 0, _len = bin.length; _i < _len; _i++) {
        entity = bin[_i];
        if ((entity != null) && this.canHit(entity) && this.hit(entity) && entity.player) {
            this.recruit(entity);
            break;
        }
    }
};

Fish.prototype.canHit = function(e) {
    switch (e.constructor.name) {
        case 'Fish':
            if (this.player) {
                return false;
            } else {
                return true;
            }
            break;
        default:
            return false;
    }
};

Fish.prototype.hit = function(e) {
    var dx, dy;
    dx = e.x - this.x;
    dy = e.y - this.y;
    return dx * dx + dy * dy < this.r2 + e.r2;
};

Fish.prototype.updateHitRadius = function() {
    this.r2 = this.GFX[this.SPRITENAME].H;
    return this.r2 *= this.r2;
};

Fish.prototype.remove = function() {
    if (this.player) {
        this.game.loseFish();
    }
    this.move = null;
    this.catcher = null;
    return this.game = null;
};



module.exports = Fish;
},{"./util":15}],5:[function(require,module,exports){
var $$ = require('./util');
var AtomGame = require('atom').Game;

var Fish = require('./fish');
var Bubble = require('./bubble');
var Hook = require('./hook');
var Hash2D = require('./hash2d');
var Plankton = require('./plankton');
var Swarm = require('./swarm');
var Rock = require('./rock');
var StageTitle = require('./stageTitle');
var StatDisplay = require('./statDisplay');
var Roe = require('./roe');

function FishGame() {
    var i, makeFish, p3,
        _this = this;
    makeFish = function(p) {
        var fish;
        return fish = new Fish({
            game: _this,
            x: p.x + $$.R(-120, 120),
            y: p.y + $$.R(-120, 120),
            player: true
        });
    };
    p3 = {
        x: $$.R(200, 400),
        y: 200
    };
    this.entities = this.entities.concat((function() {
        var _i, _results;
        _results = [];
        for (i = _i = 0; _i < 1; i = ++_i) {
            _results.push(makeFish(p3));
        }
        return _results;
    })());
    this.hash2d_new = new Hash2D();
    this.hash2d = new Hash2D();
    this.FG.fatness = new StatDisplay({
        game: this
    });
    this.entities.push(new StageTitle({
        SPRITENAME: 'swimandeat',
        game: this
    }));
    this.registerInputs();

    // Inheritance from atom.Game (may change...)
    AtomGame.call(this, {
        draw: draw,
        update: update
    });
}

FishGame.prototype = Object.create(AtomGame.prototype);
FishGame.prototype.constructor = FishGame;

FishGame.prototype.gameover = false;

FishGame.prototype.cycles = 0;

FishGame.prototype.cyclesPeriod = 600;

FishGame.prototype.current = -1.9;

FishGame.prototype.entities = [];

FishGame.prototype.player = {
    roe: 0,
    schoolSize: 0,
    fat: 10,
    starvedTime: 0,
    starvedLimit: 40,
    metabolism: 0
};

FishGame.prototype.registerInputs = function() {
    atom.input.bindEvent(atom.input.KEY.MOUSE_LEFT, 'mouseleft');
    atom.input.bindEvent(atom.input.KEY.TOUCHING, 'touchfinger');
};

FishGame.prototype.addPlankton = function(p) {
    return this.entities.push(new Plankton({
        x: p.x + $$.R(-32, 32),
        y: p.y + $$.R(-32, 32),
        game: this
    }));
};

FishGame.prototype.addHook = function(p) {
    return this.entities.push(new Hook({
        x: p.x + $$.R(-32, 32),
        y: p.y + $$.R(-32, 32),
        game: this
    }));
};

FishGame.prototype.addBubble = function(p) {
    return this.entities.push(new Bubble({
        x: p.x + $$.R(-64, 64),
        y: p.y + $$.R(-32, 32),
        game: this
    }));
};

FishGame.prototype.addRoe = function(p) {
    return this.entities.push(new Roe({
        x: p.x + $$.R(-64, 64),
        y: p.y + $$.R(-64, 64),
        game: this
    }));
};

FishGame.prototype.addSwarm = function(p) {
    var i, swarm, swarmfish;
    swarm = new Swarm({
        x: p.x,
        y: p.y,
        game: this
    });
    swarmfish = (function() {
        var _i, _ref, _results;
        _results = [];
        for (i = _i = 0, _ref = $$.R(1, 3); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
            _results.push(new Fish({
                game: this,
                x: p.x + $$.R(-64, 64),
                y: p.y + $$.R(-64, 64),
                target: swarm
            }));
        }
        return _results;
    }).call(this);
    swarm.add(swarmfish);
    this.entities.push(swarm);
    return this.entities = this.entities.concat(swarmfish);
};

FishGame.prototype.addRock = function(p) {
    return this.FG.queue.push(new Rock({
        x: p.x + $$.R(-50, 50),
        game: this
    }));
};

FishGame.prototype.intervalAddSwarm = function() {
    if ((this.cycles + 13) % 270 === 0 && $$.r() < 0.3) {
        this.addSwarm({
            x: window.innerWidth + $$.R(100, 200),
            y: $$.R(20, window.innerHeight - 20)
        });
    }
};

FishGame.prototype.intervalAddRoe = function() {
    if (this.cycles % 579 === 0 && $$.r() < 0.12) {
        this.addRoe({
            x: window.innerWidth + $$.R(100, 200),
            y: $$.R(20, window.innerHeight - 20)
        });
    }
};

FishGame.prototype.intervalAddPlankton = function() {
    var i, point, _i, _ref;
    if ((this.cycles + 7) % 120 === 0) {
        point = {
            x: window.innerWidth + $$.R(100, 200),
            y: $$.R(20, window.innerHeight - 20)
        };
        for (i = _i = 0, _ref = $$.R(2, 8); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
            this.addPlankton(point);
        }
    }
};

FishGame.prototype.intervalAddHooks = function() {
    var i, point, _i, _ref;
    if ((this.cycles + 15) % 75 === 0) {
        point = {
            x: window.innerWidth + $$.R(100, 200),
            y: $$.R(20, window.innerHeight)
        };
        for (i = _i = 0, _ref = $$.R(2, 4); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
            this.addHook(point);
        }
    }
};

FishGame.prototype.intervalAddBubbles = function() {
    var i, point, _i, _ref;
    if (this.cycles % 210 === 0) {
        point = {
            x: window.innerWidth + $$.R(100, 200),
            y: $$.R(100, window.innerHeight)
        };
        for (i = _i = 0, _ref = $$.R(3, 6); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
            this.addBubble(point);
        }
    }
};

FishGame.prototype.intervalAddRocks = function() {
    var i, point, _i, _ref;
    if (this.cycles % 20 === 0) {
        point = {
            x: window.innerWidth + $$.R(100, 300)
        };
        for (i = _i = 0, _ref = $$.R(1, 3); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
            this.addRock(point);
        }
    }
};

FishGame.prototype.updateEntities = function() {
    var e, hash_old, newEntities, _i, _len, _ref;
    this.hash2d_new.reset();
    if (this.cycles > this.cyclesPeriod) {
        this.cycles = 0;
    } else {
        this.cycles++;
    }
    newEntities = [];
    _ref = this.entities;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        if (e.move != null) {
            e.move();
            newEntities.push(e);
            if (e.hashable) {
                this.hash2d_new.add(e);
            }
        } else {
            delete e.game;
        }
    }
    this.entities = newEntities;
    hash_old = this.hash2d;
    this.hash2d = this.hash2d_new;
    this.hash2d_new = hash_old;
};

function update(dt) {
    return this.mode[this.mode.current].apply(this, [dt]);
};

FishGame.prototype.starveSchool = function() {
    var e, _i, _len, _ref;
    _ref = this.entities;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        if ((e.player != null) && e.player === true && $$.r() < 0.4) {
            e.remove();
            atom.playSound('die');
            break;
        }
    }
    this.player.starveTime = 0;
};

function reloadPage() {
    location = location;
}

FishGame.prototype.metabolize = function() {
    if (this.cycles % 90 === 0) {
        if (this.player.schoolSize > 0) {
            this.player.fat -= this.player.metabolism;
            if (this.player.fat < 0) {
                this.player.fat = 0;
                this.player.starveTime++;
                if (this.player.starveTime > this.player.starveLimit) {
                    return this.starveSchool();
                }
            }
        } else if (this.gameover === false) {
            this.entities.push(new StageTitle({
                SPRITENAME: 'gameover',
                game: this
            }));

            setTimeout(reloadPage, 3000);
            return this.gameover = true;
        }
    }
};

FishGame.prototype.addFish = function() {
    this.player.metabolism++;
    return this.player.schoolSize++;
};

FishGame.prototype.loseFish = function() {
    this.player.fat -= $$.R(3, 6);
    if (this.player.fat < 0) {
        this.player.fat = 0;
    }
    this.player.metabolism--;
    return this.player.schoolSize--;
};

FishGame.prototype.mode = {
    current: 'move',
    move: function(dt) {
        this.updateEntities();
        this.intervalAddBubbles();
        this.intervalAddHooks();
        this.intervalAddPlankton();
        this.intervalAddSwarm();
        this.intervalAddRocks();
        this.intervalAddRoe();
        return this.metabolize();
    }
};

FishGame.prototype.BG = {
    SURFACE: {
        sprite: 'surface',
        x: 0,
        w: 500,
        h: -100,
        rate: 0.18
    },
    SEAFLOOR1: {
        sprite: 'seafloor1',
        x: 0,
        w: 500,
        h: 200,
        rate: 0.58
    },
    SEAFLOOR2: {
        sprite: 'seafloor2',
        x: 0,
        w: 500,
        h: 100,
        rate: 0.97
    }
};

FishGame.prototype.FG = {
    queue: [],
    fatness: null
};

FishGame.prototype.drawSeaFloor = function(sf) {
    var ac, i, _i, _ref;
    ac = this.context;
    for (i = _i = -1, _ref = (window.innerWidth * 0.002) >> 0; - 1 <= _ref ? _i <= _ref : _i >= _ref; i = -1 <= _ref ? ++_i : --_i) {
        ac.drawImage(atom.GFX[sf.sprite], sf.x + 500 * i, sf.h > 0 ? window.innerHeight - sf.h : 0);
    }
    sf.x += sf.rate * this.current;
    if (sf.x < 0) {
        sf.x = 500;
    }
};

FishGame.prototype.drawRocks = function() {
    var e, newQueue, _i, _j, _len, _len1, _ref, _ref1;
    if (this.cycles % (this.cyclesPeriod >> 2) === 0) {
        newQueue = [];
        _ref = this.FG.queue;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            e = _ref[_i];
            if ((e.move != null) && (e.draw != null)) {
                e.move();
                e.draw();
                newQueue.push(e);
            }
        }
        this.FG.queue = newQueue;
    } else {
        _ref1 = this.FG.queue;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            e = _ref1[_j];
            if ((e.move != null) && (e.draw != null)) {
                e.move();
                e.draw();
            }
        }
    }
};

function draw() {
    var e, _i, _len, _ref;
    this.context.clear();
    this.drawSeaFloor(this.BG.SURFACE);
    this.drawSeaFloor(this.BG.SEAFLOOR1);
    this.drawSeaFloor(this.BG.SEAFLOOR2);
    _ref = this.entities;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        if ((e.move != null) && (e.draw != null)) {
            e.draw();
        }
    }
    this.drawRocks();
    return this.FG.fatness.draw();
};


module.exports = FishGame;
},{"./bubble":3,"./fish":4,"./hash2d":6,"./hook":7,"./plankton":9,"./rock":10,"./roe":11,"./stageTitle":12,"./statDisplay":13,"./swarm":14,"./util":15,"atom":1}],6:[function(require,module,exports){
function Hash2D(params) {
    var k, v;
    for (k in params) {
        v = params[k];
        this[k] = v;
    }
    if (!(this.w != null) || !(this.h != null)) {
        this.w = (window.innerWidth >> this._size) + 1;
        this.h = (window.innerHeight >> this._size) + 1;
        this.wPixels = window.innerWidth;
        this.hPixels = window.innerHeight;
    } else {
        this.wPixels = this.w << this._size;
        this.hPixels = this.h << this._size;
    }
    this._objLength = this.w * this.h;
    this.reset();
}

Hash2D.prototype._size = 6;

Hash2D.prototype.reset = function() {
    var i;
    this._obj = (function() {
        var _i, _ref, _results;
        _results = [];
        for (i = _i = 0, _ref = this._objLength; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
            _results.push([]);
        }
        return _results;
    }).call(this);
    return this;
};

Hash2D.prototype.add = function(entity) {
    if (entity.x > this.wPixels || entity.x < 0 || entity.y > this.hPixels || entity.y < 0) {

    } else {
        try {
            this._obj[this.w * (entity.y >> this._size) + (entity.x >> this._size)].push(entity);
        } catch (e) {
            window.poo = entity;
            throw "" + (entity.y >> this._size) + " -- x " + (entity.x >> this._size);
        }
    }
    return this;
};

Hash2D.prototype.get = function(entity) {
    if (entity.x > this.wPixels || entity.x < 0 || entity.y > this.hPixels || entity.y < 0) {
        return [];
    } else {
        return this._obj[this.w * (entity.y >> this._size) + (entity.x >> this._size)];
    }
};

Hash2D.prototype.nullify = function() {
    var a, i, _i, _j, _len, _ref, _ref1;
    _ref = this._obj;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        a = _ref[_i];
        for (i = _j = 0, _ref1 = a.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
            a[i] = null;
        }
    }
    return this;
};



module.exports = Hash2D;
},{}],7:[function(require,module,exports){
var $$ = require('./util');

function Hook(params) {
    var k, v;
    for (k in params) {
        v = params[k];
        this[k] = v;
    }
    this.SPRITENAME = "hook" + ($$.WR(this.SIZES));
    this.r = $$.R(1, 8);
    this.r_2 = this.r >> 1;
    this.r2 = this.r * this.r;
}

Hook.prototype.x = 0;

Hook.prototype.y = 0;

Hook.prototype.hashable = true;

Hook.prototype.caught = false;

Hook.prototype.HOOKANGLE = 3.6185837;

Hook.prototype.draw = function() {
    var ac, sprite;
    ac = this.game.context;
    sprite = atom.GFX[this.SPRITENAME];
    ac.drawImage(sprite, this.x - this.GFX[this.SPRITENAME].W_2, this.y - this.GFX[this.SPRITENAME].H_2);
    ac.beginPath();
    ac.lineWidth = 0.5;
    ac.strokeStyle = this.caught ? '#a44' : '#444';
    ac.moveTo(this.x + this.GFX[this.SPRITENAME].W_2 - 3, this.y - this.GFX[this.SPRITENAME].H_2);
    ac.lineTo(this.x + this.GFX[this.SPRITENAME].W_2 - 3, 0);
    return ac.stroke();
};

Hook.prototype.move = function() {
    if (this.y < -this.r_2 || this.x < -this.r_2) {
        return this.move = null;
    } else {
        if (this.caught) {
            this.y -= 3;
        } else {
            this.checkHits();
        }
        return this.x += 2 * this.game.current;
    }
};

Hook.prototype.checkHits = function() {
    var bin, entity, _i, _len;
    bin = this.game.hash2d.get(this);
    for (_i = 0, _len = bin.length; _i < _len; _i++) {
        entity = bin[_i];
        if ((entity != null) && this.canHit(entity) && this.hit(entity)) {
            atom.playSound('tick');
            if (entity.hooked != null) {
                entity.hooked(this);
            }
            this.caught = true;
            break;
        }
    }
};

Hook.prototype.canHit = function(e) {
    switch (e.constructor.name) {
        case 'Fish':
            return true;
        default:
            return false;
    }
};

Hook.prototype.hit = function(e) {
    var dx, dy;
    dx = e.x - this.x;
    dy = e.y - this.y;
    return dx * dx + dy * dy < this.r2 + e.r2;
};

Hook.prototype.SPRITENAME = null;

Hook.prototype.GFX = {
    'hook160': {
        W: 16,
        H: 16,
        W_2: 8,
        H_2: 8
    },
    'hook161': {
        W: 16,
        H: 16,
        W_2: 8,
        H_2: 8
    },
    'hook160': {
        W: 16,
        H: 16,
        W_2: 8,
        H_2: 8
    },
    'hook24': {
        W: 24,
        H: 24,
        W_2: 12,
        H_2: 12
    },
    'hook32': {
        W: 32,
        H: 32,
        W_2: 16,
        H_2: 16
    }
};

Hook.prototype.SIZES = {
    '160': 3,
    '161': 3,
    '24': 2,
    '32': 1
};


module.exports = Hook;
},{"./util":15}],8:[function(require,module,exports){
var atom = require('atom');
window.atom = atom;

var util = require('./util');
var FishGame = require('./game');

function startGame() {
    atom.playSound('music', true);
    window.game = new FishGame();
    return window.game.run();
};

var loaded = {
    gfx: false,
    sfx: false
};

function isPreloadComplete() {
    if (loaded.gfx && loaded.sfx) {
        startGame();
        return true;
    } else {
        return false;
    }
};

function onDOMContentLoaded() {
    atom.preloadImages({
        gameover: 'gfx/gameover.png',
        swimandeat: 'gfx/swimandeat.png',
        spawninggrounds: 'gfx/spawninggrounds.png',
        bolt24: 'gfx/bolt24.png',
        dna: 'gfx/dna.png',
        roe1: 'gfx/roe/1.png',
        roe2: 'gfx/roe/2.png',
        roe3: 'gfx/roe/3.png',
        fatstart: 'gfx/fat/start.png',
        fatmiddle: 'gfx/fat/middle.png',
        fatend: 'gfx/fat/end.png',
        fledgeling0: 'gfx/fledgeling0.png',
        fledgeling1: 'gfx/fledgeling1.png',
        fish00: 'gfx/fish00.png',
        fish01: 'gfx/fish01.png',
        fish10: 'gfx/fish10.png',
        fish11: 'gfx/fish11.png',
        fish20: 'gfx/fish20.png',
        fish21: 'gfx/fish21.png',
        bubble4: 'gfx/bubble/4.png',
        bubble6: 'gfx/bubble/6.png',
        bubble8: 'gfx/bubble/8.png',
        bubble12: 'gfx/bubble/12.png',
        bubble16: 'gfx/bubble/16.png',
        bubble24: 'gfx/bubble/24.png',
        bubble32: 'gfx/bubble/32.png',
        hook160: 'gfx/hook/160.png',
        hook161: 'gfx/hook/161.png',
        hook24: 'gfx/hook/24.png',
        hook32: 'gfx/hook/32.png',
        rock1: 'gfx/rock/1.png',
        rock2: 'gfx/rock/2.png',
        rock3: 'gfx/rock/3.png',
        rock4: 'gfx/rock/4.png',
        rock5: 'gfx/rock/5.png',
        rock6: 'gfx/rock/6.png',
        rock7: 'gfx/rock/7.png',
        rock8: 'gfx/rock/8.png',
        plankton: 'gfx/plankton.png',
        surface: 'gfx/surface.png',
        seafloor1: 'gfx/seafloor1.png',
        seafloor2: 'gfx/seafloor2.png'
    }, function() {
        loaded.gfx = true;
        return isPreloadComplete();
    });

    atom.preloadSounds({
        tick: 'sfx/tick.mp3',
        die: 'sfx/die.mp3',
        music: 'sfx/music.mp3',
        ahahah: 'sfx/ahahah1.mp3',
        plankton1: 'sfx/plankton1.mp3',
        plankton2: 'sfx/plankton2.mp3',
        plankton3: 'sfx/plankton3.mp3',
        recruit: 'sfx/recruit.mp3',
        roe: 'sfx/roe.mp3'
    },
    function() {
        loaded.sfx = true;
        return isPreloadComplete();
    });
}

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);

},{"./game":5,"./util":15,"atom":1}],9:[function(require,module,exports){
var $$ = require('./util');

function Plankton(params) {
    var k, v;
    for (k in params) {
        v = params[k];
        this[k] = v;
    }
    this.spriteX = $$.R(0, 11);
    this.spriteY = $$.R(0, 2);
    this.r = 8;
    this.r_2 = this.r >> 1;
    this.r2 = this.r * this.r;
    this.rotation = $$.r(this.PI2);
}

Plankton.prototype.x = 0;

Plankton.prototype.y = 0;

Plankton.prototype.PI2 = Math.PI * 2;

Plankton.prototype.r = 4;

Plankton.prototype.eaten = false;

Plankton.prototype.hashable = true;

Plankton.prototype.frame = 0;

Plankton.prototype.SPRITE = null;

Plankton.prototype.SPRITENAME = null;

Plankton.prototype.spriteX = 0;

Plankton.prototype.spriteY = 0;

Plankton.prototype.GFX = {
    W: 16,
    H: 16,
    W_2: 8,
    H_2: 8
};

Plankton.prototype.NOISES = {
    'plankton1': 1,
    'plankton2': 1,
    'plankton3': 1
};

Plankton.prototype.draw = function() {
    var ac;
    ac = this.game.context;
    ac.save();
    ac.globalAlpha = 0.3;
    ac.translate(this.x - 8, this.y - 8);
    ac.drawImage(atom.GFX.plankton, this.spriteX << 4, this.spriteY << 4, 16, 16, 0, 0, 16, 16);
    return ac.restore();
};

Plankton.prototype.move = function() {
    if (this.y < 0 || this.x < 0 || this.eaten) {
        return this.move = null;
    } else {
        this.checkHits();
        return this.x += 2 * this.game.current;
    }
};

Plankton.prototype.checkHits = function() {
    var bin, entity, _i, _len;
    bin = this.game.hash2d.get(this);
    for (_i = 0, _len = bin.length; _i < _len; _i++) {
        entity = bin[_i];
        if ((entity != null) && this.canHit(entity) && this.hit(entity)) {
            atom.playSound($$.WR(this.NOISES));
            if (entity.eat != null) {
                entity.eat(this);
            }
            this.eaten = true;
            break;
        }
    }
};

Plankton.prototype.canHit = function(e) {
    switch (e.constructor.name) {
        case 'Fish':
            return true;
        default:
            return false;
    }
};

Plankton.prototype.hit = function(e) {
    var dx, dy;
    dx = e.x - this.x;
    dy = e.y - this.y;
    return dx * dx + dy * dy < this.r2 + e.r2;
};

module.exports = Plankton;
},{"./util":15}],10:[function(require,module,exports){
var $$ = require('./util');

function Rock(params) {
    var k, v;
    for (k in params) {
        v = params[k];
        this[k] = v;
    }
    this.SPRITENAME = "ROCK" + ($$.WR(this.SIZES));
}

Rock.prototype.GFX = {
    ROCK1: {
        sprite: 'rock1',
        w: 100,
        h: 200
    },
    ROCK2: {
        sprite: 'rock2',
        w: 100,
        h: 200
    },
    ROCK3: {
        sprite: 'rock3',
        w: 100,
        h: 200
    },
    ROCK4: {
        sprite: 'rock4',
        w: 100,
        h: 100
    },
    ROCK5: {
        sprite: 'rock5',
        w: 100,
        h: 100
    },
    ROCK6: {
        sprite: 'rock6',
        w: 100,
        h: 100
    },
    ROCK7: {
        sprite: 'rock7',
        w: 100,
        h: 100
    },
    ROCK8: {
        sprite: 'rock8',
        w: 100,
        h: 100
    }
};

Rock.prototype.SIZES = {
    '1': 1,
    '2': 1,
    '3': 1,
    '4': 3,
    '5': 3,
    '6': 5,
    '7': 2,
    '8': 4
};

Rock.prototype.x = 0;

Rock.prototype.y = 0;

Rock.prototype.draw = function() {
    var ac, r;
    if (this.game) {
        ac = this.game.context;
        r = this.GFX[this.SPRITENAME];
        ac.drawImage(atom.GFX[r.sprite], this.x - (r.w >> 1), window.innerHeight - r.h);
    }
};

Rock.prototype.remove = function() {
    this.move = null;
    this.game = null;
};

Rock.prototype.move = function() {
    if (this.x > -100) {
        this.x += 3.1 * this.game.current;
    } else {
        this.remove();
    }
};

module.exports = Rock;
},{"./util":15}],11:[function(require,module,exports){
var $$ = require('./util');

function Roe(params) {
    var k, v;
    for (k in params) {
        v = params[k];
        this[k] = v;
    }
    this.SPRITENAME = "roe" + ($$.WR(this.SIZES));
    this.r2 = this.GFX[this.SPRITENAME].W >> 1;
    this.r2 *= this.r2;
}

Roe.prototype.x = 0;

Roe.prototype.y = 0;

Roe.prototype.hashable = false;

Roe.prototype.SPRITENAME = null;

Roe.prototype.GFX = {
    'roe1': {
        W: 16,
        H: 16,
        W_2: 8,
        H_2: 8,
        N: 1
    },
    'roe2': {
        W: 24,
        H: 16,
        W_2: 12,
        H_2: 8,
        N: 2
    },
    'roe3': {
        W: 24,
        H: 24,
        W_2: 12,
        H_2: 12,
        N: 3
    }
};

Roe.prototype.draw = function() {
    var ac, sprite;
    ac = this.game.context;
    sprite = atom.GFX[this.SPRITENAME];
    return ac.drawImage(sprite, this.x - this.GFX[this.SPRITENAME].W_2, this.y - this.GFX[this.SPRITENAME].H_2);
};

Roe.prototype.remove = function() {
    this.move = null;
    return this.game = null;
};

Roe.prototype.move = function() {
    if (this.y < -this.GFX[this.SPRITENAME].H_2 || this.x < -this.GFX[this.SPRITENAME].W_2) {
        this.remove();
    } else {
        this.x += 2 * this.game.current;
        this.checkHits();
    }
};

Roe.prototype.checkHits = function() {
    var bin, entity, _i, _len;
    bin = this.game.hash2d.get(this);
    for (_i = 0, _len = bin.length; _i < _len; _i++) {
        entity = bin[_i];
        if ((entity != null) && this.canHit(entity) && this.hit(entity) && entity.player) {
            if (entity.collectRoe != null) {
                entity.collectRoe(this.GFX[this.SPRITENAME].N);
            }
            this.remove();
            break;
        }
    }
};

Roe.prototype.canHit = function(e) {
    switch (e.constructor.name) {
        case 'Fish':
            if (this.player) {
                return false;
            } else {
                return true;
            }
            break;
        default:
            return false;
    }
};

Roe.prototype.SIZES = {
    '1': 6,
    '2': 2,
    '3': 1
};

Roe.prototype.hit = function(e) {
    var dx, dy;
    dx = e.x - this.x;
    dy = e.y - this.y;
    return dx * dx + dy * dy < this.r2 + e.r2;
};

module.exports = Roe;
},{"./util":15}],12:[function(require,module,exports){
var $$ = require('./util');

function StageTitle(params) {
    var k, v;
    for (k in params) {
        v = params[k];
        this[k] = v;
    }
    this.lifetime = this.GFX[this.SPRITENAME].LIFETIME;
}

StageTitle.prototype.hashable = false;

StageTitle.prototype.SPRITENAME = null;

StageTitle.prototype.GFX = {
    'gameover': {
        W: 300,
        H: 100,
        W_2: 150,
        H_2: 50,
        LIFETIME: 300
    },
    'spawninggrounds': {
        W: 300,
        H: 100,
        W_2: 150,
        H_2: 50,
        LIFETIME: 100
    },
    'swimandeat': {
        W: 200,
        H: 100,
        W_2: 100,
        H_2: 50,
        LIFETIME: 100
    }
};

StageTitle.prototype.lifetime = 0;

StageTitle.prototype.draw = function() {
    var ac;
    ac = this.game.context;
    if (this.lifetime < 40) {
        ac.globalAlpha = this.lifetime * 0.025;
    }
    ac.drawImage(atom.GFX[this.SPRITENAME], (window.innerWidth >> 1) - this.GFX[this.SPRITENAME].W_2, (window.innerHeight >> 1) - this.GFX[this.SPRITENAME].H_2);
    if (this.lifetime < 40) {
        ac.globalAlpha = 1;
    }
};

StageTitle.prototype.remove = function() {
    this.move = null;
    return this.game = null;
};

StageTitle.prototype.move = function() {
    if (this.lifetime > 0) {
        this.lifetime--;
    } else {
        this.remove();
    }
};


module.exports = StageTitle;
},{"./util":15}],13:[function(require,module,exports){
function StatDisplay(params) {
    var k, v;
    for (k in params) {
        v = params[k];
        this[k] = v;
    }
}

StatDisplay.prototype.margin = 8;

StatDisplay.prototype.draw = function() {
    var ac, i, j, y, _i, _j, _ref, _ref1;
    ac = this.game.context;
    y = window.innerHeight - 32 - 8;
    ac.drawImage(atom.GFX.fatstart, this.margin, y);
    i = 1;
    if ((this.game.player.fat >> 0) > 0) {
        for (j = _i = 0, _ref = this.game.player.fat >> 2; 0 <= _ref ? _i < _ref : _i > _ref; j = 0 <= _ref ? ++_i : --_i) {
            ac.drawImage(atom.GFX.fatmiddle, this.margin + 24 * i, y);
            i++;
        }
    }
    ac.drawImage(atom.GFX.fatend, this.margin + 24 * i, y);
    y -= 36;
    if (!(this.game.player.metabolism < 5)) {
        ac.drawImage(atom.GFX.bolt24, this.margin, y);
    }
    y -= 36;
    for (j = _j = 0, _ref1 = this.game.player.roe; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
        ac.drawImage(atom.GFX.dna, this.margin + 28 * j, y);
    }
};

module.exports = StatDisplay;
},{}],14:[function(require,module,exports){
var $$ = require('./util');

function Swarm(params) {
    var k, v;
    for (k in params) {
        v = params[k];
        this[k] = v;
    }
    this.children = [];
    this.dx = -$$.R(2, 7) * $$.r();
}


Swarm.prototype.hashable = false;

Swarm.prototype.x = 0;

Swarm.prototype.y = 0;

Swarm.prototype.dx = 0;

Swarm.prototype.dy = 0;

Swarm.prototype.children = null;

Swarm.prototype.move = function() {
    var move;
    if (this.x < -window.innerWidth) {
        move = null;
        return this.removeChildren();
    } else {
        this.x += 2 * this.game.current + this.dx;
        return this.y += this.dy;
    }
};

Swarm.prototype.removeChildren = function() {
    var c, _i, _len, _ref, _results;
    _ref = this.children;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        _results.push((c != null) && !c.player && !c.caught ? c.remove() : void 0);
    }
    return _results;
};


Swarm.prototype.add = function(a) {
    if (!(a instanceof Array)) {
        a = [a];
    }
    return this.children = this.children.concat(a);
};

module.exports = Swarm;
},{"./util":15}],15:[function(require,module,exports){
module.exports = {
    r: function(n) {
        if (n == null) {
            n = 1;
        }
        return n * Math.random();
    },
    R: function(l, h) {
        return Math.floor(l + (Math.random() * (h - l + 1)));
    },
    AR: function(a) {
        return a[Math.floor(Math.random() * a.length)];
    },
    WR: function(o, sum) {
        var intervalEnd, k, lastK, r, sum_, v;
        if (sum == null) {
            sum = 0;
        }
        for (k in o) {
            v = o[k];
            sum += v;
        }
        sum_ = 1 / sum;
        r = Math.random();
        for (k in o) {
            v = o[k];
            if (!(typeof intervalEnd !== "undefined" && intervalEnd !== null)) {
                intervalEnd = v * sum_;
            }
            if (r < intervalEnd) {
                return k;
            } else {
                intervalEnd += v * sum_;
                lastK = k;
            }
        }
        return k;
    },
    sum: function(o, sum) {
        var k, v, _i, _len;
        if (sum == null) {
            sum = 0;
        }
        if (o instanceof Array) {
            for (_i = 0, _len = o.length; _i < _len; _i++) {
                v = o[_i];
                sum += v;
            }
        } else {
            for (k in o) {
                v = o[k];
                sum += v;
            }
        }
        return sum;
    },
    extend: function(target, extender) {
        var k, v;
        if (target == null) {
            target = {};
        }
        for (k in extender) {
            v = extender[k];
            target[k] = v;
        }
        return target;
    },
    addEvent: function(obj, type, fn) {
        if (obj.attachEvent) {
            obj["e" + type + fn] = fn;
            obj[type + fn] = function() {
                return obj["e" + type + fn](window.event);
            };
            return obj.attachEvent("on" + type, obj[type + fn]);
        } else {
            return obj.addEventListener(type, fn, false);
        }
    },
    removeEvent: function(obj, type, fn) {
        if (obj.detachEvent) {
            obj.detachEvent("on" + type, obj[type + fn]);
            return delete obj[type + fn];
        } else {
            return obj.removeEventListener(type, fn, false);
        }
    }
};
},{}]},{},[8]);
