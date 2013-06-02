// Generated by CoffeeScript 1.4.0

define(function() {
  var Bubble;
  return Bubble = (function() {

    Bubble.prototype.x = 0;

    Bubble.prototype.y = 0;

    Bubble.prototype.hashable = false;

    Bubble.prototype.SPRITENAME = null;

    Bubble.prototype.SPRITE = null;

    Bubble.prototype.GFX = {
      'bubble0': {
        W: 31,
        H: 27,
        W_2: 15,
        H_2: 13
      },
      'bubble1': {
        W: 19,
        H: 16,
        W_2: 9,
        H_2: 8
      }
    };

    Bubble.prototype.dx = 0;

    Bubble.prototype.lifetime = 0;

    Bubble.prototype.draw = function() {
      var ac;
      ac = atom.context;
      return ac.drawImage(this.SPRITE, this.x - this.GFX[this.SPRITENAME].W_2, this.y - this.GFX[this.SPRITENAME].W_2);
    };

    Bubble.prototype.move = function() {
      if (this.y < -this.GFX[this.SPRITENAME].H_2 || this.x < -this.GFX[this.SPRITENAME].W_2) {
        return this.move = null;
      } else {
        this.y += this.dy;
        return this.x += 4 * this.game.current;
      }
    };

    function Bubble(params) {
      var k, n, s, v;
      for (k in params) {
        v = params[k];
        this[k] = v;
      }
      s = $$.R(0, 1);
      n = $$.R(1, 6);
      this.SPRITE = atom.gfx["bubble" + s + "n" + n];
      this.SPRITENAME = "bubble" + s;
      this.dy = -$$.r(2.9) - 0.85;
    }

    return Bubble;

  })();
});
