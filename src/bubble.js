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