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