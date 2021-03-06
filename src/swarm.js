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