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