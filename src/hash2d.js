function Hash2D(params) {
    var k, v;
    for (k in params) {
        v = params[k];
        this[k] = v;
    }
    if (!(this.w != null) || !(this.h != null)) {
        this.w = (window.innerWidth >> this._size) + 1;
        this.h = (window.innerHeight >> this._size) + 1;
        this.wPixels = window.innerWidth;
        this.hPixels = window.innerHeight;
    } else {
        this.wPixels = this.w << this._size;
        this.hPixels = this.h << this._size;
    }
    this._objLength = this.w * this.h;
    this.reset();
}

Hash2D.prototype._size = 6;

Hash2D.prototype.reset = function() {
    var i;
    this._obj = (function() {
        var _i, _ref, _results;
        _results = [];
        for (i = _i = 0, _ref = this._objLength; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
            _results.push([]);
        }
        return _results;
    }).call(this);
    return this;
};

Hash2D.prototype.add = function(entity) {
    if (entity.x > this.wPixels || entity.x < 0 || entity.y > this.hPixels || entity.y < 0) {

    } else {
        try {
            this._obj[this.w * (entity.y >> this._size) + (entity.x >> this._size)].push(entity);
        } catch (e) {
            window.poo = entity;
            throw "" + (entity.y >> this._size) + " -- x " + (entity.x >> this._size);
        }
    }
    return this;
};

Hash2D.prototype.get = function(entity) {
    if (entity.x > this.wPixels || entity.x < 0 || entity.y > this.hPixels || entity.y < 0) {
        return [];
    } else {
        return this._obj[this.w * (entity.y >> this._size) + (entity.x >> this._size)];
    }
};

Hash2D.prototype.nullify = function() {
    var a, i, _i, _j, _len, _ref, _ref1;
    _ref = this._obj;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        a = _ref[_i];
        for (i = _j = 0, _ref1 = a.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
            a[i] = null;
        }
    }
    return this;
};



module.exports = Hash2D;