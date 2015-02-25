/**
 * 工具类
 * @type {Object|Function|Array}
 */

var arrProto = Array.prototype,
    objProto = Object.prototype;

var Util = {
    isType: function (target, type) {
        return objProto.toString.call(target) == "[object " + type + "]";
    },
    each: function (arr, callback) {
        var self = this;

        if (arr && arrProto.forEach) {
            arrProto.forEach.call(arr, callback);
        } else if (self.isType("Array", arr)) {
            for (var i = 0, len = arr.length; i < len; i++) {
                callback(arr[i], i, arr);
            }
        }
    },
    filter: function (arr, callback) {
        var self = this,
            tmp = [];

        if (arr && arrProto.filter) {
            return arrProto.filter.call(arr, callback);
        } else {
            self.each(arr, function (item, index, arr) {
                if (callback.call(arr, item, index, arr) == true) {
                    tmp.push(item);
                }
            });
        }

        return tmp;
    },
    reverse: function (arr) {
        var self = this,
            tmp = [];

        if (arrProto.reverse) {
            return arrProto.reverse.call(arr);
        } else {
            for (var i = arr.length - 1; i >= 0; i--) {
                tmp.push(arr[i]);
            }
        }

        return tmp;
    },
    inArray: function (item, arr, fn) {
        var self = this;

        if (arrProto.inArray) {
            return arrProto.inArray.call(arr, item);
        } else {
            for (var i = 0, len = arr.length; i < len; i++) {
                if (typeof fn == "function") {
                    if (fn.call(item, item, arr[i], i, arr)) {
                        return i;
                    }
                } else if (arr[i] == item) {
                    return i;
                }
            }

            return -1;
        }
    },
    extends: function (obj) {
        var self = this,
            source, prop;

        if (!self.isType(obj, "Object")) {
            return obj;
        }

        for (var i = 1, length = arguments.length; i < length; i++) {
            source = arguments[i];
            for (prop in source) {
                if (hasOwnProperty.call(source, prop)) {
                    obj[prop] = source[prop];
                }
            }
        }

        return obj;
    },
    keys: function (obj) {
        var self = this,
            tmp = [];

        if (Object.keys) {
            return Object.keys(obj);
        } else {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    tmp.push(key);
                }
            }
        }

        return tmp;
    }
};