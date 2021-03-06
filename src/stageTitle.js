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