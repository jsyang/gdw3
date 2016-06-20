module.exports = {
    r: function(n) {
        if (n == null) {
            n = 1;
        }
        return n * Math.random();
    },
    R: function(l, h) {
        return Math.floor(l + (Math.random() * (h - l + 1)));
    },
    AR: function(a) {
        return a[Math.floor(Math.random() * a.length)];
    },
    WR: function(o, sum) {
        var intervalEnd, k, lastK, r, sum_, v;
        if (sum == null) {
            sum = 0;
        }
        for (k in o) {
            v = o[k];
            sum += v;
        }
        sum_ = 1 / sum;
        r = Math.random();
        for (k in o) {
            v = o[k];
            if (!(typeof intervalEnd !== "undefined" && intervalEnd !== null)) {
                intervalEnd = v * sum_;
            }
            if (r < intervalEnd) {
                return k;
            } else {
                intervalEnd += v * sum_;
                lastK = k;
            }
        }
        return k;
    },
    sum: function(o, sum) {
        var k, v, _i, _len;
        if (sum == null) {
            sum = 0;
        }
        if (o instanceof Array) {
            for (_i = 0, _len = o.length; _i < _len; _i++) {
                v = o[_i];
                sum += v;
            }
        } else {
            for (k in o) {
                v = o[k];
                sum += v;
            }
        }
        return sum;
    },
    extend: function(target, extender) {
        var k, v;
        if (target == null) {
            target = {};
        }
        for (k in extender) {
            v = extender[k];
            target[k] = v;
        }
        return target;
    },
    addEvent: function(obj, type, fn) {
        if (obj.attachEvent) {
            obj["e" + type + fn] = fn;
            obj[type + fn] = function() {
                return obj["e" + type + fn](window.event);
            };
            return obj.attachEvent("on" + type, obj[type + fn]);
        } else {
            return obj.addEventListener(type, fn, false);
        }
    },
    removeEvent: function(obj, type, fn) {
        if (obj.detachEvent) {
            obj.detachEvent("on" + type, obj[type + fn]);
            return delete obj[type + fn];
        } else {
            return obj.removeEventListener(type, fn, false);
        }
    }
};