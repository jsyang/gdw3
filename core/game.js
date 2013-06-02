// Generated by CoffeeScript 1.4.0
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['core/fish', 'core/bubble', 'core/hook', 'core/hash2d', 'core/plankton', 'core/swarm'], function(Fish, Bubble, Hook, Hash2D, Plankton, Swarm) {
  var FishGame;
  return FishGame = (function(_super) {

    __extends(FishGame, _super);

    FishGame.prototype.cycles = 0;

    FishGame.prototype.cyclesPeriod = 600;

    FishGame.prototype.clearEntitiesInterval = 300;

    FishGame.prototype.current = -1.6;

    FishGame.prototype.player = null;

    FishGame.prototype.entities = [];

    function FishGame() {
      var i, makeFish, p3,
        _this = this;
      makeFish = function(p) {
        var fish;
        return fish = new Fish({
          game: _this,
          x: p.x + $$.R(-120, 120),
          y: p.y + $$.R(-120, 120),
          player: true
        });
      };
      p3 = {
        x: $$.R(200, 400),
        y: 200
      };
      this.entities = this.entities.concat((function() {
        var _i, _results;
        _results = [];
        for (i = _i = 0; _i < 3; i = ++_i) {
          _results.push(makeFish(p3));
        }
        return _results;
      })());
      this.hash2d_new = new Hash2D();
      this.hash2d = new Hash2D();
      this.registerInputs();
      this.registerFocus();
    }

    FishGame.prototype.registerInputs = function() {
      atom.input.bind(atom.button.LEFT, 'mouseleft');
      return atom.input.bind(atom.touch.TOUCHING, 'touchfinger');
    };

    FishGame.prototype.registerFocus = function() {
      var _this = this;
      window.onblur = function() {
        return _this.stop;
      };
      return window.onfocus = function() {
        return _this.run;
      };
    };

    FishGame.prototype.addPlankton = function(p) {
      return this.entities.push(new Plankton({
        x: p.x + $$.R(-32, 32),
        y: p.y + $$.R(-32, 32),
        game: this
      }));
    };

    FishGame.prototype.addHook = function(p) {
      return this.entities.push(new Hook({
        x: p.x + $$.R(-32, 32),
        y: p.y + $$.R(-32, 32),
        game: this
      }));
    };

    FishGame.prototype.addBubble = function(p) {
      return this.entities.push(new Bubble({
        x: p.x + $$.R(-64, 64),
        y: p.y + $$.R(-32, 32),
        game: this
      }));
    };

    FishGame.prototype.addSwarm = function(p) {
      var i, swarm, swarmfish;
      swarm = new Swarm({
        x: p.x,
        y: p.y,
        game: this
      });
      swarmfish = (function() {
        var _i, _ref, _results;
        _results = [];
        for (i = _i = 0, _ref = $$.R(1, 3); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          _results.push(new Fish({
            game: this,
            x: p.x + $$.R(-64, 64),
            y: p.y + $$.R(-64, 64),
            target: swarm
          }));
        }
        return _results;
      }).call(this);
      swarm.add(swarmfish);
      this.entities.push(swarm);
      return this.entities = this.entities.concat(swarmfish);
    };

    FishGame.prototype.intervalAddSwarm = function() {
      if ((this.cycles + 13) % 270 === 0 && $$.r() < 0.3) {
        this.addSwarm({
          x: atom.width + $$.R(100, 200),
          y: $$.R(20, atom.height - 20)
        });
      }
    };

    FishGame.prototype.intervalAddPlankton = function() {
      var i, point, _i, _ref;
      if ((this.cycles + 7) % 120 === 0) {
        point = {
          x: atom.width + $$.R(100, 200),
          y: $$.R(20, atom.height - 20)
        };
        for (i = _i = 0, _ref = $$.R(2, 8); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          this.addPlankton(point);
        }
      }
    };

    FishGame.prototype.intervalAddHooks = function() {
      var i, point, _i, _ref;
      if ((this.cycles + 15) % 75 === 0) {
        point = {
          x: atom.width + $$.R(100, 200),
          y: $$.R(20, atom.height)
        };
        for (i = _i = 0, _ref = $$.R(2, 4); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          this.addHook(point);
        }
      }
    };

    FishGame.prototype.intervalAddBubbles = function() {
      var i, point, _i, _ref;
      if (this.cycles % 50 === 0) {
        point = {
          x: atom.width + $$.R(100, 200),
          y: $$.R(100, atom.height)
        };
        for (i = _i = 0, _ref = $$.R(3, 6); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          this.addBubble(point);
        }
      }
    };

    FishGame.prototype.updateEntities = function() {
      var e, hash_old, newEntities, _i, _len, _ref;
      this.hash2d_new.reset();
      if (this.cycles > this.clearEntitiesInterval) {
        this.cycles = 0;
      } else {
        this.cycles++;
      }
      newEntities = [];
      _ref = this.entities;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        if (e.move != null) {
          e.move();
          newEntities.push(e);
          if (e.hashable) {
            this.hash2d_new.add(e);
          }
        } else {
          delete e.game;
        }
      }
      this.entities = newEntities;
      hash_old = this.hash2d;
      this.hash2d = this.hash2d_new;
      this.hash2d_new = hash_old;
    };

    FishGame.prototype.update = function(dt) {
      return this.mode[this.mode.current].apply(this, [dt]);
    };

    FishGame.prototype.mode = {
      current: 'move',
      move: function(dt) {
        this.updateEntities();
        this.intervalAddBubbles();
        this.intervalAddHooks();
        this.intervalAddPlankton();
        return this.intervalAddSwarm();
      }
    };

    FishGame.prototype.draw = function() {
      var e, _i, _len, _ref, _results;
      atom.context.clear();
      _ref = this.entities;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        _results.push((e.move != null) && (e.draw != null) ? e.draw() : void 0);
      }
      return _results;
    };

    return FishGame;

  })(atom.Game);
});
