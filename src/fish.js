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