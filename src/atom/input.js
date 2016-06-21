/**
 * @constant
 * @enum {number}
 */
var KEY = {
    MOUSE_LEFT       : -1,
    MOUSE_MIDDLE     : -2,
    MOUSE_RIGHT      : -3,
    MOUSE_WHEEL_DOWN : -4,
    MOUSE_WHEEL_UP   : -5,

    TAB         : 9,
    ENTER       : 13,
    ESC         : 27,
    SPACE       : 32,
    LEFT_ARROW  : 37,
    UP_ARROW    : 38,
    RIGHT_ARROW : 39,
    DOWN_ARROW  : 40,

    "A" : 65,
    "B" : 66,
    "C" : 67,
    "D" : 68,
    "E" : 69,
    "F" : 70,
    "G" : 71,
    "H" : 72,
    "I" : 73,
    "J" : 74,
    "K" : 75,
    "L" : 76,
    "M" : 77,
    "N" : 78,
    "O" : 79,
    "P" : 80,
    "Q" : 81,
    "R" : 82,
    "S" : 83,
    "T" : 84,
    "U" : 85,
    "V" : 86,
    "W" : 87,
    "X" : 88,
    "Y" : 89,
    "Z" : 90,

    // Touch devices
    TOUCHING: 1000
};

/**
 * @param {Event} e
 * @returns {number}
 */
function getInputEventCode(e) {
    if (e instanceof KeyboardEvent) {
        if (e.type === 'keydown' || e.type === 'keyup') {
            return e.keyCode;
        }
    } else if (e instanceof MouseEvent) {
        if (e.type === 'mousedown' || e.type === 'mouseup') {
            if (e.button === 0) {
                return KEY.MOUSE_LEFT;
            } else if (e.button === 1) {
                return KEY.MOUSE_MIDDLE;
            } else if (e.button === 2) {
                return KEY.MOUSE_RIGHT;
            }
        }
    } else if (e instanceof WheelEvent) {
        if (e.type === 'mousewheel') {
            if (e.wheel > 0) {
                return KEY.MOUSE_WHEEL_UP;
            } else {
                return KEY.MOUSE_WHEEL_DOWN;
            }
        }
    } else if (e.type === 'touchstart' || e.type === 'touchend' || e.type === 'touchcancel' || e.type === 'touchleave') {
        return KEY.TOUCHING;
    }
}

/** Dictionary of input keys that will be handled */
var bindings = {};

/** Dictionary of input keys that are currently down (if true) */
var down = {};

/** Dictionary of input keys that have been pressed within the last game cycle */
var pressed = {};

/** Dictionary of input keys that have been released within the last game cycle */
var released = [];

var mouse = { x : 0, y : 0 };

function bindEvent(key, action) {
    bindings[key] = action;
}

function clearPressed() {
    released.forEach(function (action) {
        down[action] = false;
    });

    released = [];
    pressed  = {};
}

function onKeyDown(e) {
    var action = bindings[getInputEventCode(e)];
    if (action) {
        if (!down[action]) {
            pressed[action] = true;
        }

        down[action] = true;
    }

    e.stopPropagation();
    e.preventDefault();
}

function onKeyUp(e) {
    var action = bindings[getInputEventCode(e)];
    if (action) {
        released.push(action);
    }

    e.stopPropagation();
    e.preventDefault();
}

function onMouseMove(e) {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
}

function onMouseDown(e) { onKeyDown(e); }
function onMouseUp(e) { onKeyUp(e); }
function onMouseWheel(e) {
    onKeyDown(e);
    onKeyUp(e);
}

function onTouchMove(e) {
    mouse.x = e.changedTouches[0].pageX;
    mouse.y = e.changedTouches[0].pageY;
};

function onTouchStart(e) {
    mouse.x = e.changedTouches[0].pageX;
    mouse.y = e.changedTouches[0].pageY;
    onKeyDown(e);
};

function onTouchEnd(e) {
    mouse.x = e.changedTouches[0].pageX;
    mouse.y = e.changedTouches[0].pageY;
    onKeyUp(e);
}

function onContextMenu(e) {
    if (bindings[KEY.MOUSE_RIGHT]) {
        e.stopPropagation();
        e.preventDefault();
    }
}

function isPressed(action) {
    return pressed[action];
}

function isDown(action) {
    return down[action];
}

function isReleased(action) {
    return action in released;
}

function getMouse(){
    return {
        x : mouse.x,
        y : mouse.y
    };
}

module.exports = {
    getMouse : getMouse,

    KEY : KEY,

    isPressed  : isPressed,
    isDown     : isDown,
    isReleased : isReleased,

    bindEvent    : bindEvent,
    clearPressed : clearPressed,

    onKeyDown : onKeyDown,
    onKeyUp   : onKeyUp,

    onMouseDown   : onMouseDown,
    onMouseUp     : onMouseUp,
    onMouseMove   : onMouseMove,
    onMouseWheel  : onMouseWheel,
    onContextMenu : onContextMenu
};