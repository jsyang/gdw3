var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['core/aifish', 'core/bubble', 'core/hook', 'core/hash2d', 'core/plankton'], function(AIFish, Bubble, Hook, Hash2D, Plankton) {
  var FishGame;
  return FishGame = (function(_super) {

    __extends(FishGame, _super);

    FishGame.prototype.cycles = 0;

    FishGame.prototype.clearEntitiesInterval = 300;

    FishGame.prototype.current = -3;

    FishGame.prototype.player = null;

    FishGame.prototype.entities = [];

    function FishGame() {
      var chaseMouse, chasePoint1, chasePoint2, i, makeFish, p1, p2, p3,
        _this = this;
      makeFish = function(point, chasePoint) {
        var fish;
        if (chasePoint == null) {
          chasePoint = false;
        }
        fish = new AIFish({
          game: _this,
          x: point.x + $$.R(-120, 120),
          y: point.y + $$.R(-120, 120)
        });
        if (chasePoint === true) {
          fish.target = point;
        }
        return fish;
      };
      p1 = {
        x: $$.R(100, 300),
        y: 50
      };
      p2 = {
        x: $$.R(100, 300),
        y: 450
      };
      p3 = {
        x: $$.R(200, 400),
        y: 200
      };
      chaseMouse = (function() {
        var _i, _results;
        _results = [];
        for (i = _i = 0; _i < 3; i = ++_i) {
          _results.push(makeFish(p3));
        }
        return _results;
      })();
      chasePoint1 = (function() {
        var _i, _results;
        _results = [];
        for (i = _i = 0; _i < 3; i = ++_i) {
          _results.push(makeFish(p1, true));
        }
        return _results;
      })();
      chasePoint2 = (function() {
        var _i, _results;
        _results = [];
        for (i = _i = 0; _i < 3; i = ++_i) {
          _results.push(makeFish(p2, true));
        }
        return _results;
      })();
      this.entities = this.entities.concat(chaseMouse, chasePoint1, chasePoint2);
      this.player = new AIFish({
        game: this,
        x: $$.R(-120, 120),
        y: $$.R(-120, 120),
        w: 24,
        h: 20,
        maxSpeed: 9
      });
      this.entities.push(this.player);
      this.hash2d = new Hash2D();
      this.registerInputs();
    }

    FishGame.prototype.registerInputs = function() {
      atom.input.bind(atom.button.LEFT, 'mouseleft');
      return atom.input.bind(atom.touch.TOUCHING, 'touchfinger');
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

    FishGame.prototype.update = function(dt) {
      return this.mode[this.mode.current].apply(this, [dt]);
    };

    FishGame.prototype.mode = {
      current: 'move',
      move: function(dt) {
        this.updateEntities();
        this.intervalAddBubbles();
        this.intervalAddHooks();
        return this.intervalAddPlankton();
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
      var e, newEntities, _i, _j, _len, _len1, _ref, _ref1;
      if (this.cycles > this.clearEntitiesInterval) {
        this.hash2d.reset();
        newEntities = [];
        _ref = this.entities;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          e = _ref[_i];
          if (e.move != null) {
            e.move();
            newEntities.push(e);
          } else {
            delete e.game;
          }
        }
        this.entities = newEntities;
        this.cycles = 0;
      } else {
        this.hash2d.nullify();
        _ref1 = this.entities;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          e = _ref1[_j];
          if (e.move != null) {
            e.move();
            this.hash2d.add(e);
          }
        }
        this.cycles++;
      }
    };

    FishGame.prototype.draw = function() {
      var e, _i, _len, _ref, _results;
      atom.context.clear();
      _ref = this.entities;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        _results.push(e.move != null ? e.draw() : void 0);
      }
      return _results;
    };

    return FishGame;

  })(atom.Game);
});

// Generated by CoffeeScript 1.5.0-pre
