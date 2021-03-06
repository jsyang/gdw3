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