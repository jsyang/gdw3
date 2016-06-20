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