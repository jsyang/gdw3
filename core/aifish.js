
define(function() {
  var AIFish;
  return AIFish = (function() {

    AIFish.prototype.x = 0;

    AIFish.prototype.y = 0;

    AIFish.prototype.w = 8;

    AIFish.prototype.h = 6;

    AIFish.prototype.rotation = 0;

    AIFish.prototype.lastPosition = null;

    AIFish.prototype.speed = null;

    AIFish.prototype.dSpeed = $$.r(0.21) + 0.13;

    AIFish.prototype.maxSpeed = $$.r(10) + 2;

    AIFish.prototype.fatnessPenalty = 0.91;

    AIFish.prototype.caught = false;

    AIFish.prototype.COLOR = {
      HEX: {
        pink: '#ED3776',
        purple: '#B349AB',
        blue: '#4527F2',
        cyan: '#27C6F2',
        teal: '#27F2B5',
        green: '#27F24C',
        leaf: '#97F227',
        grass: '#D7F227',
        orange: '#F2A427'
      },
      DISTRIB: {
        pink: 1,
        purple: 2,
        blue: 4,
        cyan: 6,
        teal: 5,
        green: 3,
        leaf: 2,
        grass: 2,
        orange: 1
      }
    };

    AIFish.prototype.color = null;

    AIFish.prototype.gradient = [[0.2, '#6D59B3'], [0.8, '#484063']];

    AIFish.prototype.chase = {
      w_2: 64,
      h_2: 64
    };

    AIFish.prototype.target = atom.input.mouse;

    AIFish.prototype.normalizeSpeed = function() {
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

    AIFish.prototype.setRotation = function() {
      var newRotation;
      newRotation = Math.atan(this.speed.y / this.speed.x);
      if (this.speed.x < 0) {
        newRotation += Math.PI;
      }
      return this.rotation = newRotation;
    };

    AIFish.prototype.move = function() {
      if (this.caught) {
        if (this.x < 0 || this.y < 0) {
          this.move = null;
          return this.catcher = null;
        } else {
          this.x = this.catcher.x;
          return this.y = this.catcher.y;
        }
      } else {
        if (this.maxSpeed < Math.abs(this.game.current)) {
          this.move = null;
          this.catcher = null;
        }
        this.x += this.speed.x;
        this.y += this.speed.y;
        this.x += this.game.current;
        if (this.x > this.target.x) {
          this.speed.x -= this.dSpeed;
        } else {
          this.speed.x += this.dSpeed;
        }
        if (this.y > this.target.y) {
          this.speed.y -= this.dSpeed;
        } else {
          this.speed.y += this.dSpeed;
        }
        this.normalizeSpeed();
        return this.setRotation();
      }
    };

    AIFish.prototype.hooked = function(e) {
      this.catcher = e;
      return this.caught = true;
    };

    AIFish.prototype.eat = function(e) {
      this.w += e.r >> 2;
      this.h += e.r >> 2;
      this.updateHitRadius();
      return this.maxSpeed *= this.fatnessPenalty;
    };

    AIFish.prototype.draw = function() {
      var ac, g, i, _i, _len, _ref;
      ac = atom.context;
      ac.save();
      ac.translate(this.x, this.y);
      if (this.rotation !== 0) {
        ac.rotate(this.rotation);
      }
      if (false) {
        g = ac.createLinearGradient(-this.w * 0.2, 0, this.w * 0.8, 0);
        _ref = this.gradient;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          g.addColorStop(i[0], i[1]);
          i[0] -= 0.0313;
          if (i[0] < 0) {
            i[0] = 1;
          }
        }
      } else {
        g = this.color;
      }
      ac.fillStyle = g;
      ac.beginPath();
      ac.moveTo(-(this.w * 0.2), -(this.h >> 1));
      ac.lineTo(-(this.w * 0.2), this.h >> 1);
      ac.lineTo(this.w * 0.8, 0);
      ac.moveTo(-(this.w * 0.2), this.h >> 1);
      ac.lineTo(this.w * 0.8, 0);
      ac.closePath();
      ac.stroke();
      ac.fill();
      return ac.restore();
    };

    AIFish.prototype.updateHitRadius = function() {
      this.r2 = Math.min(this.w, this.h);
      return this.r2 *= this.r2;
    };

    function AIFish(params) {
      var k, v;
      for (k in params) {
        v = params[k];
        this[k] = v;
      }
      if (params.speed == null) {
        this.speed = {
          x: 0,
          y: 0,
          normalizationFactor: $$.r(0.27) + 0.51
        };
      }
      if (params.dSpeed == null) {
        this.dSpeed = $$.r(0.12) + 0.13;
      }
      if (params.maxSpeed == null) {
        this.maxSpeed = $$.r(8) + 4;
      }
      this.lastPosition = {
        x: this.x,
        y: this.y
      };
      if (params.color == null) {
        this.color = this.COLOR.HEX[$$.WR(this.COLOR.DISTRIB)];
      }
      this.updateHitRadius();
    }

    return AIFish;

  })();
});

// Generated by CoffeeScript 1.5.0-pre
