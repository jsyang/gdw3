function StatDisplay(params) {
    var k, v;
    for (k in params) {
        v = params[k];
        this[k] = v;
    }
}

StatDisplay.prototype.margin = 8;

StatDisplay.prototype.draw = function() {
    var ac, i, j, y, _i, _j, _ref, _ref1;
    ac = this.game.context;
    y = window.innerHeight - 32 - 8;
    ac.drawImage(atom.GFX.fatstart, this.margin, y);
    i = 1;
    if ((this.game.player.fat >> 0) > 0) {
        for (j = _i = 0, _ref = this.game.player.fat >> 2; 0 <= _ref ? _i < _ref : _i > _ref; j = 0 <= _ref ? ++_i : --_i) {
            ac.drawImage(atom.GFX.fatmiddle, this.margin + 24 * i, y);
            i++;
        }
    }
    ac.drawImage(atom.GFX.fatend, this.margin + 24 * i, y);
    y -= 36;
    if (!(this.game.player.metabolism < 5)) {
        ac.drawImage(atom.GFX.bolt24, this.margin, y);
    }
    y -= 36;
    for (j = _j = 0, _ref1 = this.game.player.roe; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
        ac.drawImage(atom.GFX.dna, this.margin + 28 * j, y);
    }
};

module.exports = StatDisplay;