export default class Util {
    static isType(target, type) {
        return Object.prototype.toString.call(target) === '[object ' + type + ']';
    }

    static each(arr, callback) {
        let _me = this;

        if (_me.isType(arr, 'Array') && Array.prototype.forEach) {
            Array.prototype.forEach.call(arr, callback);
        } else if (_me.isType(arr, 'Array')) {
            for (var i = 0, len = arr.length; i < len; i += 1) {
                callback(arr[i], i, arr);
            }
        } else if (_me.isType(arr, 'Object')) {
            for (var key in arr) {
                if (arr.hasOwnProperty(key)) {
                    callback(arr[key], key, arr);
                }
            }
        }
    }

    static filter(arr, callback) {
        let _me = this;

        if (_me.isType(arr, 'Array') && Array.prototype.filter) {
            return Array.prototype.filter.call(arr, callback);
        } else {
            let tmp = [];
            _me.each(arr, function (item, index, arr) {
                if (callback.call(arr, item, index, arr) === true) {
                    tmp.push(item);
                }
            });
            return tmp;
        }
    }

    static map(arr, callback) {
        let _me = this;

        if (_me.isType(arr, 'Array') && Array.prototype.map) {
            return Array.prototype.map.call(arr, callback);
        } else {
            let tmp = [];
            _me.each(arr, function (item, index, arr) {
                tmp.push(callback.call(arr, item, index, arr));
            });
            return tmp;
        }
    }

    static some(arr, callback) {
        let _me = this;

        if (_me.isType(arr, 'Array') && Array.prototype.some) {
            return Array.prototype.some.call(arr, callback);
        } else {
            let bol = false;
            _me.each(arr, function (item, index, arr) {
                if (callback.call(arr, item, index, arr) === true) {
                    bol = true;
                }
            });
            return bol;
        }
    }

    static every(arr, callback) {
        let _me = this;

        if (_me.isType(arr, 'Array') && Array.prototype.some) {
            return Array.prototype.some.call(arr, callback);
        } else {
            let bol = true;
            _me.each(arr, function (item, index, arr) {
                if (!callback.call(arr, item, index, arr)) {
                    bol = false;
                }
            });
            return bol;
        }
    }

    static deg2rad(deg) {
        return deg * Math.PI / 180;
    }

    static rad2deg(rad) {
        return rad / Math.PI * 180;
    }

    static keys(obj) {
        var keys = [];

        if (obj) {
            if (Object.keys) {
                return Object.keys(obj);
            } else {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        keys.push(key);
                    }
                }
            }
        }

        return keys;
    }

    static inArray(item, arr, fn) {
        for (let i = 0, len = arr.length; i < len; i += 1) {
            if (typeof fn === 'function') {
                if (fn.call(item, item, arr[i], i, arr)) {
                    return i;
                }
            } else if (arr[i] === item) {
                return i;
            }
        }

        return -1;
    }

    static extends(obj) {
        var _me = this;

        if (!_me.isType(obj, 'Object')) {
            return obj;
        }

        for (let i = 1, length = arguments.length; i < length; i += 1) {
            let source = arguments[i];
            for (let prop in source) {
                if (hasOwnProperty.call(source, prop)) {
                    obj[prop] = source[prop];
                }
            }
        }

        return obj;
    }

    static clone(obj) {
        let _me = this;

        if (typeof obj !== 'object') {
            return obj;
        }

        return _me.isType(obj, 'Array') ? Array.prototype.slice.call(obj) : _me.extends({}, obj);
    }

    // ray-casting algorithm
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    static pip(point, vs) {
        let isInside = false;
        let x = point[0],
            y = point[1];

        for (let i = 0, j = vs.length - 1; i < vs.length; j = i += 1) {
            let xi = vs[i][0],
                yi = vs[i][1];
            let xj = vs[j][0],
                yj = vs[j][1];

            let intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) {
                isInside = !isInside;
            }
        }

        return isInside;
    }
}