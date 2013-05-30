
define(function() {
  var Plankton;
  return Plankton = (function() {

    Plankton.prototype.x = 0;

    Plankton.prototype.y = 0;

    Plankton.prototype.PI2 = Math.PI * 2;

    Plankton.prototype.r = 4;

    Plankton.prototype.eaten = false;

    Plankton.prototype.NOISES = {
      'plankton1': 1,
      'plankton2': 1,
      'plankton3': 1
    };

    Plankton.prototype.draw = function() {
      var ac;
      ac = atom.context;
      ac.strokeStyle = '#666';
      ac.fillStyle = '#F5F36C';
      ac.beginPath();
      ac.arc(this.x, this.y, this.r, 0, this.PI2);
      ac.stroke();
      ac.fill();
      return ac.closePath();
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
        case 'AIFish':
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

    function Plankton(params) {
      var k, v;
      for (k in params) {
        v = params[k];
        this[k] = v;
      }
      this.r = $$.R(2, 12);
      this.r_2 = this.r >> 1;
      this.r2 = this.r * this.r;
    }

    return Plankton;

  })();
});

// Generated by CoffeeScript 1.5.0-pre
