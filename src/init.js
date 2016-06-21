var atom = require('./atom/atom');
window.atom = atom;

var util = require('./util');
var FishGame = require('./game');

function startGame() {
    atom.playSound('music', true);
    window.game = new FishGame();
    return window.game.run();
};

var loaded = {
    gfx: false,
    sfx: false
};

function isPreloadComplete() {
    if (loaded.gfx && loaded.sfx) {
        startGame();
        return true;
    } else {
        return false;
    }
};

function onDOMContentLoaded() {
    atom.preloadImages({
        gameover: 'gfx/gameover.png',
        swimandeat: 'gfx/swimandeat.png',
        spawninggrounds: 'gfx/spawninggrounds.png',
        bolt24: 'gfx/bolt24.png',
        dna: 'gfx/dna.png',
        roe1: 'gfx/roe/1.png',
        roe2: 'gfx/roe/2.png',
        roe3: 'gfx/roe/3.png',
        fatstart: 'gfx/fat/start.png',
        fatmiddle: 'gfx/fat/middle.png',
        fatend: 'gfx/fat/end.png',
        fledgeling0: 'gfx/fledgeling0.png',
        fledgeling1: 'gfx/fledgeling1.png',
        fish00: 'gfx/fish00.png',
        fish01: 'gfx/fish01.png',
        fish10: 'gfx/fish10.png',
        fish11: 'gfx/fish11.png',
        fish20: 'gfx/fish20.png',
        fish21: 'gfx/fish21.png',
        bubble4: 'gfx/bubble/4.png',
        bubble6: 'gfx/bubble/6.png',
        bubble8: 'gfx/bubble/8.png',
        bubble12: 'gfx/bubble/12.png',
        bubble16: 'gfx/bubble/16.png',
        bubble24: 'gfx/bubble/24.png',
        bubble32: 'gfx/bubble/32.png',
        hook160: 'gfx/hook/160.png',
        hook161: 'gfx/hook/161.png',
        hook24: 'gfx/hook/24.png',
        hook32: 'gfx/hook/32.png',
        rock1: 'gfx/rock/1.png',
        rock2: 'gfx/rock/2.png',
        rock3: 'gfx/rock/3.png',
        rock4: 'gfx/rock/4.png',
        rock5: 'gfx/rock/5.png',
        rock6: 'gfx/rock/6.png',
        rock7: 'gfx/rock/7.png',
        rock8: 'gfx/rock/8.png',
        plankton: 'gfx/plankton.png',
        surface: 'gfx/surface.png',
        seafloor1: 'gfx/seafloor1.png',
        seafloor2: 'gfx/seafloor2.png'
    }, function() {
        loaded.gfx = true;
        return isPreloadComplete();
    });

    atom.preloadSounds({
        tick: 'sfx/tick.mp3',
        die: 'sfx/die.mp3',
        music: 'sfx/music.mp3',
        ahahah: 'sfx/ahahah1.mp3',
        plankton1: 'sfx/plankton1.mp3',
        plankton2: 'sfx/plankton2.mp3',
        plankton3: 'sfx/plankton3.mp3',
        recruit: 'sfx/recruit.mp3',
        roe: 'sfx/roe.mp3'
    },
    function() {
        loaded.sfx = true;
        return isPreloadComplete();
    });
}

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
