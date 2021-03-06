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