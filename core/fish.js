// Generated by CoffeeScript 1.4.0

define(function() {
  var Fish;
  return Fish = (function() {

    Fish.prototype.x = 0;

    Fish.prototype.y = 0;

    Fish.prototype.w = 8;

    Fish.prototype.h = 6;

    Fish.prototype.rotation = 0;

    Fish.prototype.frame = 0;

    Fish.prototype.LASTFRAME = 7;

    Fish.prototype.GFX = {
      SPRITE: 'fledgeling',
      W: 107,
      H: 68,
      W_2: 53,
      H_2: 34,
      W_4: 28,
      H_4: 17
    };

    Fish.prototype.speed = null;

    Fish.prototype.dSpeed = $$.r(0.31) + 0.27;

    Fish.prototype.maxSpeed = $$.r(10) + 2;

    Fish.prototype.fatnessPenalty = 0.987;

    Fish.prototype.caught = false;

    Fish.prototype.player = false;

    Fish.prototype.hashable = true;

    Fish.prototype.chase = {
      w_2: 32,
      h_2: 32
    };

    Fish.prototype.target = atom.input.mouse;

    Fish.prototype.normalizeSpeed = function() {
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

    Fish.prototype.setRotation = function() {
      return this.rotation = Math.atan2(this.speed.y, this.speed.x);
    };

    Fish.prototype.chaseTarget = function() {
      if (this.x > this.target.x) {
        this.speed.x -= this.dSpeed;
      } else {
        this.speed.x += this.dSpeed;
      }
      if (this.y > this.target.y) {
        return this.speed.y -= this.dSpeed;
      } else {
        return this.speed.y += this.dSpeed;
      }
    };

    Fish.prototype.move = function() {
      if (this.caught) {
        if (this.x < 0 || this.y < 0) {
          return this.remove();
        } else {
          this.x = this.catcher.x;
          return this.y = this.catcher.y;
        }
      } else {
        if (this.player === false) {
          this.checkHits();
        }
        this.x += this.speed.x;
        this.y += this.speed.y;
        this.x += this.game.current;
        this.chaseTarget();
        this.normalizeSpeed();
        return this.setRotation();
      }
    };

    Fish.prototype.recruit = function() {
      if (this.target.constructor.name === 'Swarm') {
        this.target.children[this.target.children.indexOf(this)] = null;
      }
      atom.playSound('recruit');
      this.target = atom.input.mouse;
      return this.player = true;
    };

    Fish.prototype.hooked = function(e) {
      this.catcher = e;
      return this.caught = true;
    };

    Fish.prototype.eat = function(e) {
      return this.dSpeed *= this.fatnessPenalty;
    };

    Fish.prototype.draw = function() {
      var ac;
      ac = atom.context;
      ac.save();
      ac.translate(this.x, this.y);
      if (this.rotation !== 0) {
        ac.rotate(this.rotation);
      }
      ac.drawImage(atom.gfx[this.GFX.SPRITE], 0, this.frame * this.GFX.H, this.GFX.W, this.GFX.H, -this.GFX.W_4 + 8, -this.GFX.H_4 >> 1, this.GFX.W_4, this.GFX.H_4);
      if (!this.caught) {
        this.frame++;
        if (this.frame > this.LASTFRAME) {
          this.frame = 0;
        }
      }
      return ac.restore();
    };

    Fish.prototype.checkHits = function() {
      var bin, entity, _i, _len;
      bin = this.game.hash2d.get(this);
      for (_i = 0, _len = bin.length; _i < _len; _i++) {
        entity = bin[_i];
        if ((entity != null) && this.canHit(entity) && this.hit(entity) && entity.player) {
          this.recruit();
          break;
        }
      }
    };

    Fish.prototype.canHit = function(e) {
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

    Fish.prototype.hit = function(e) {
      var dx, dy;
      dx = e.x - this.x;
      dy = e.y - this.y;
      return dx * dx + dy * dy < this.r2 + e.r2;
    };

    Fish.prototype.updateHitRadius = function() {
      this.r2 = Math.min(this.w, this.h);
      return this.r2 *= this.r2;
    };

    Fish.prototype.remove = function() {
      this.move = null;
      return this.catcher = null;
    };

    function Fish(params) {
      var k, v;
      for (k in params) {
        v = params[k];
        this[k] = v;
      }
      if (!(this.speed != null)) {
        this.speed = {
          x: 0,
          y: 0,
          normalizationFactor: $$.r(0.27) + 0.51
        };
      }
      if (this.dSpeed == null) {
        this.dSpeed = $$.r(0.12) + 0.13;
      }
      if (this.maxSpeed == null) {
        this.maxSpeed = $$.r(8) + 4;
      }
      this.frame = $$.R(0, this.LASTFRAME);
      this.updateHitRadius();
    }

    return Fish;

  })();
});