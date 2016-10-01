require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
Object.defineProperty(exports, '__esModule', {
    value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _slice = Array.prototype.slice;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Util = require('./Util');

var _Util2 = _interopRequireDefault(_Util);

var _Easing = require('./Easing');

var _Easing2 = _interopRequireDefault(_Easing);

var _Timer = require('./Timer');

var _Timer2 = _interopRequireDefault(_Timer);

var Animate = (function () {
    function Animate() {
        _classCallCheck(this, Animate);
    }

    _createClass(Animate, null, [{
        key: 'to',
        value: function to(target, params) {
            var _me$_init;

            var _me = this;

            if (!_Util2['default'].isType(params, 'Object')) {
                return;
            }

            _me._addQueue({
                target: target,
                args: (_me$_init = _me._init).call.apply(_me$_init, [_me].concat(_slice.call(arguments)))
            });
        }
    }, {
        key: 'from',
        value: function from(target, params) {
            var _me$_init2;

            var _me = this;

            if (!_Util2['default'].isType(params, 'Object')) {
                return;
            }

            for (var key in params) {
                if (params.hasOwnProperty(key) && key !== 'onComplete' && key !== 'onCompleteParam') {
                    var tmp = parseFloat(target[key]);
                    target[key] = params[key];
                    params[key] = tmp;
                }
            }

            arguments[1] = params;

            _me._addQueue({
                target: target,
                args: (_me$_init2 = _me._init).call.apply(_me$_init2, [_me].concat(_slice.call(arguments)))
            });
        }
    }, {
        key: 'fromTo',
        value: function fromTo(target, fParams, tParams) {
            var _me$_init3;

            var _me = this;

            if (!_Util2['default'].isType(tParams, 'Object') || !_Util2['default'].isType(fParams, 'Object')) {
                return;
            }

            for (var key in fParams) {
                if (fParams.hasOwnProperty(key) && key !== 'onComplete' && key !== 'onCompleteParam') {
                    target[key] = fParams[key];
                }
            }

            Array.prototype.splice.call(arguments, 1, 1);

            _me._addQueue({
                target: target,
                args: (_me$_init3 = _me._init).call.apply(_me$_init3, [_me].concat(_slice.call(arguments)))
            });
        }
    }, {
        key: 'remove',
        value: function remove(animator) {
            var index = _Util2['default'].inArray(animator, this._animators, function (animator, item) {
                return animator === item.target;
            });

            if (index !== -1) {
                this._animators.splice(index, 1);
            }
        }
    }, {
        key: 'resume',
        value: function resume(target) {
            var _me = this;
            var index = _Util2['default'].inArray(target, _me._pausedAnimators, function (target, item) {
                return target === item.target;
            });

            if (index > -1) {
                var item = _me._pausedAnimators.splice(index, 1);
                item[0].timestamp = +new Date();
                _me._animators.push(item[0]);
                _me._animate();
            }
        }
    }, {
        key: 'pause',
        value: function pause(target) {
            var _me = this;
            var index = _Util2['default'].inArray(target, _me._animators, function (target, item) {
                return target === item.target;
            });

            if (index > -1) {
                var item = _me._animators.splice(index, 1);
                _me._pausedAnimators.push(item[0]);
            }
        }
    }, {
        key: 'start',
        value: function start() {
            _Util2['default'].each(this._animators, function (animators) {
                animators.timestamp = +new Date();
            });
            this._animate();
        }
    }, {
        key: 'stop',
        value: function stop() {
            this._isAnimated = false;
            _Timer2['default'].remove(this);
        }
    }, {
        key: '_init',
        value: function _init(target, params) {
            var attr = {};
            var fn = null;
            var fnParams = [];
            var type = {};
            var speed = 0;
            var val = [];

            for (var item in params) {
                if (params.hasOwnProperty(item)) {
                    if (item === 'onComplete') {
                        fn = params[item];
                    } else if (item === 'onCompleteParam') {
                        fnParams = params[item];
                    } else {
                        attr[item] = params[item];
                    }
                }
            }

            type = arguments[2];
            if (typeof type === 'object' && type.a && type.b) {
                type = arguments[2] || _Easing2['default'].easeInSine;
                speed = arguments[3] || 1000;
                fn = fn || arguments[4];
                fnParams = fnParams || arguments[5];
            } else {
                type = _Easing2['default'].easeInSine;
                speed = arguments[2] || 1000;
                fn = fn || arguments[3];
                fnParams = fnParams || arguments[4];
            }

            val.push(target, attr, type, speed, fn, fnParams);

            return val;
        }
    }, {
        key: '_addQueue',
        value: function _addQueue(animator) {
            var target = animator.target;
            var params = animator.args[1];

            animator.shouldStop = false;
            animator.timeCount = 0;
            animator.origin = {};

            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    animator.origin[key] = target[key];
                }
            }

            animator.timestamp = +new Date();
            this._animators.push(animator);
            this._animate();
        }
    }, {
        key: '_cubicBezier',
        value: function _cubicBezier(type, t) {
            var pa = { x: 0, y: 0 };
            var pb = type.a;
            var pc = type.b;
            var pd = { x: 1, y: 1 };

            return {
                x: pa.x * Math.pow(1 - t, 3) + 3 * pb.x * t * Math.pow(1 - t, 2) + 3 * pc.x * Math.pow(t, 2) * (1 - t) + pd.x * Math.pow(t, 3),
                y: pa.y * Math.pow(1 - t, 3) + 3 * pb.y * t * Math.pow(1 - t, 2) + 3 * pc.y * Math.pow(t, 2) * (1 - t) + pd.y * Math.pow(t, 3)
            };
        }
    }, {
        key: '_animate',
        value: function _animate() {
            var _me = this;
            if (!_me._isAnimated) {
                _me._isAnimated = true;
                _Timer2['default'].add(_me);
            }
        }
    }, {
        key: 'tick',
        value: function tick() {
            var _me = this;
            var renderTime = 1000 / 60;
            if (!_me._animators.length || !_me._isAnimated) {
                _me.stop();
                return;
            }

            _Util2['default'].each(_me._animators, function (animator) {
                var _animator$args = _slicedToArray(animator.args, 6);

                var target = _animator$args[0];
                var attrs = _animator$args[1];
                var type = _animator$args[2];
                var speed = _animator$args[3];
                var fn = _animator$args[4];
                var fnParams = _animator$args[5];

                var timestamp = +new Date();
                var timeCount = animator.timeCount += timestamp - animator.timestamp;
                var shouldStop = animator.shouldStop = speed - timeCount <= renderTime || timeCount > speed;
                var origin = animator.origin;
                var scale = _me._cubicBezier(type, shouldStop ? 1 : timeCount / speed);
                for (var key in attrs) {
                    if (attrs.hasOwnProperty(key)) {
                        target[key] = origin[key] + (attrs[key] - origin[key]) * scale.y;
                    }
                }

                if (shouldStop) {
                    if (typeof fn === 'function') {
                        fn.call(target, fnParams);
                    }
                }

                animator.timestamp = +new Date();
            });

            for (var i = _me._animators.length - 1; i >= 0; i -= 1) {
                if (_me._animators[i].shouldStop) {
                    _me._animators.splice(i, 1);
                }
            }
        }
    }, {
        key: '_animators',
        get: function get() {
            this._animators_ = this._animators_ || [];
            return this._animators_;
        }
    }, {
        key: '_pausedAnimators',
        get: function get() {
            this._pausedAnimators_ = this._pausedAnimators_ || [];
            return this._pausedAnimators_;
        }
    }, {
        key: '_isAnimated',
        get: function get() {
            this._isAnimated_ = this._isAnimated_ || false;
            return this._isAnimated_;
        },
        set: function set(isAnimated) {
            this._isAnimated_ = isAnimated;
        }
    }]);

    return Animate;
})();

exports['default'] = Animate;
module.exports = exports['default'];

},{"./Easing":6,"./Timer":23,"./Util":27}],2:[function(require,module,exports){
Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _DisplayObject2 = require('./DisplayObject');

var _DisplayObject3 = _interopRequireDefault(_DisplayObject2);

var _Global = require('./Global');

var _Global2 = _interopRequireDefault(_Global);

var _Util = require('./Util');

var _Util2 = _interopRequireDefault(_Util);

var _Vec3 = require('./Vec3');

var _Vec32 = _interopRequireDefault(_Vec3);

var _Matrix3 = require('./Matrix3');

var _Matrix32 = _interopRequireDefault(_Matrix3);

var Bitmap = (function (_DisplayObject) {
    _inherits(Bitmap, _DisplayObject);

    function Bitmap(bitmapData) {
        _classCallCheck(this, Bitmap);

        if (!bitmapData) {
            console.error('bitmapData must not be empty'); // jshint ignore:line
            return;
        }

        _get(Object.getPrototypeOf(Bitmap.prototype), 'constructor', this).call(this);
        this.name = 'Bitmap';
        this._bitmapData = bitmapData;
    }

    _createClass(Bitmap, [{
        key: 'show',
        value: function show(matrix) {
            var isDrew = _get(Object.getPrototypeOf(Bitmap.prototype), 'show', this).call(this, matrix);
            if (!isDrew) {
                return isDrew;
            }

            var _me = this;
            var ctx = _me.ctx || _me.stage.ctx;
            var bitmapData = _me._bitmapData;
            var source = bitmapData._source;

            if (source) {
                matrix = bitmapData._matrix.getMatrix();
                ctx.transform(matrix[0], matrix[1], matrix[3], matrix[4], matrix[6], matrix[7]);
                ctx.drawImage(source, 0, 0);
            }

            ctx.restore();

            return isDrew;
        }
    }, {
        key: 'isMouseOn',
        value: function isMouseOn(cord) {
            var _me = this;
            var vec = new _Vec32['default'](cord.x, cord.y, 1);
            var matrix = _me._matrix.multi(_me._bitmapData._matrix);
            var inverse = _Matrix32['default'].inverse(matrix);
            var area = [[0, 0], [_me.width, 0], [_me.width, _me.height], [0, _me.height]];

            vec.multiMatrix3(inverse);
            return _Util2['default'].pip([vec.x, vec.y], area);
        }
    }, {
        key: 'getBounds',
        value: function getBounds() {
            var _me = this;
            var sx = _Global2['default'].maxNumber;
            var ex = _Global2['default'].minNumber;
            var sy = _Global2['default'].maxNumber;
            var ey = _Global2['default'].minNumber;
            var area = [[0, 0], [_me.width, 0], [_me.width, _me.height], [0, _me.height]];

            var matrix = _me._matrix.multi(_me._bitmapData._matrix);
            var vec3s = _Util2['default'].map(area, function (item) {
                var vec = new _Vec32['default'](item[0], item[1], 1);
                return vec.multiMatrix3(matrix);
            });

            _Util2['default'].each(vec3s, function (item) {
                sx = item.x < sx ? item.x : sx;
                ex = item.x > ex ? item.x : ex;
                sy = item.y < sy ? item.y : sy;
                ey = item.y > ey ? item.y : ey;
            });

            if (sx === _Global2['default'].maxNumber || ex === _Global2['default'].minNumber || sy === _Global2['default'].maxNumber || ey === _Global2['default'].minNumber) {
                sx = sy = ex = ey = 0;
            }

            return {
                sv: new _Vec32['default'](sx, sy, 1),
                ev: new _Vec32['default'](ex, ey, 1)
            };
        }
    }, {
        key: 'width',
        get: function get() {
            return this._bitmapData.width;
        }
    }, {
        key: 'height',
        get: function get() {
            return this._bitmapData.height;
        }
    }]);

    return Bitmap;
})(_DisplayObject3['default']);

exports['default'] = Bitmap;
module.exports = exports['default'];

},{"./DisplayObject":4,"./Global":9,"./Matrix3":16,"./Util":27,"./Vec3":28}],3:[function(require,module,exports){
Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Matrix3 = require('./Matrix3');

var _Matrix32 = _interopRequireDefault(_Matrix3);

var BitmapData = (function () {
    function BitmapData(width, height) {
        _classCallCheck(this, BitmapData);

        var canvas = document.createElement('CANVAS');
        canvas.width = width;
        canvas.height = height;

        this._source = canvas;
        this._ctx = canvas.getContext('2d');
        this._matrix = _Matrix32['default'].identity();
        this._locked = false;
        this._imageData = null;
        this.width = width || 0;
        this.height = height || 0;
    }

    _createClass(BitmapData, [{
        key: 'clone',
        value: function clone() {
            var bmd = new BitmapData(this.width, this.height);
            bmd.draw(this._source, this._matrix);
            return bmd;
        }
    }, {
        key: 'dispose',
        value: function dispose() {
            this._source = null;
            this._matrix = _Matrix32['default'].identity();
            this._locked = false;
            this.width = 0;
            this.height = 0;
        }
    }, {
        key: 'draw',
        value: function draw(source, matrix) {
            var _me = this;
            if (_me._locked) {
                return;
            }

            if (!(source instanceof Image || source instanceof Node && source.nodeName.toUpperCase() === 'CANVAS')) {
                return;
            }

            _me.width = source.width;
            _me.height = source.height;
            _me._ctx.drawImage(source, 0, 0);
            _me._imageData = null;
            _me._locked = false;

            if (matrix instanceof _Matrix32['default']) {
                this._matrix.multi(matrix);
            }
        }
    }, {
        key: 'getPixel',
        value: function getPixel(x, y) {
            var _me = this;
            if (!_me._ctx || x > _me.width || y > _me.height) {
                return new ImageData(new Uint8ClampedArray(new Array(4), 0, 4), 1, 1); // jshint ignore:line
            }

            var imageData = null;
            var data = null;
            if (_me._locked) {
                var index = (x * _me.width + _me.height) * 4;
                imageData = _me._imageData;
                data = imageData.data;
                return new ImageData(new Uint8ClampedArray([data[index], data[index + 1], data[index + 2], data[index + 3]], 0, 4), 1, 1); // jshint ignore:line
            } else {
                    imageData = _me._ctx.getImageData(x, y, 1, 1);
                    data = imageData.data;
                    return new ImageData(new Uint8ClampedArray([data[0], data[1], data[2], 0], 0, 4), 1, 1); // jshint ignore:line
                }
        }
    }, {
        key: 'getPixel32',
        value: function getPixel32(x, y) {
            var _me = this;

            if (!_me._ctx || x > _me.width || y > _me.height) {
                return new ImageData(new Uint8ClampedArray([0, 0, 0, 0], 0, 4), 1, 1); // jshint ignore:line
            }

            if (_me._locked) {
                var imageData = _me._imageData;
                var data = imageData.data;
                var index = (x * _me.width + _me.height) * 4;
                return new ImageData(new Uint8ClampedArray([data[index], data[index + 1], data[index + 2], data[index + 3]], 0, 4), 1, 1); // jshint ignore:line
            } else {
                    return _me._ctx.getImageData(x, y, 1, 1);
                }
        }
    }, {
        key: 'getPixels',
        value: function getPixels(x, y, width, height) {
            var _me = this;

            if (!_me._ctx || x > _me.width || y > _me.height) {
                return new ImageData(new Uint8ClampedArray([0, 0, 0, 0], 0, 4), 1, 1); // jshint ignore:line
            }

            width = x + width > _me.width ? _me.width - x : width;
            height = y + height > _me.height ? _me.height - y : height;

            if (_me._locked) {
                var imageData = _me._imageData;
                var data = imageData.data;
                var tmp = [];
                for (var i = 0; i < height; i += 1) {
                    var startIndex = (y + i) * _me.height + x;
                    for (var j = 0; j < width; j += 1) {
                        var index = (startIndex + j) * 4;
                        tmp.push(data[index], data[index + 1], data[index + 2], data[index + 3]);
                    }
                }
                return new ImageData(new Uint8ClampedArray(tmp, 0, tmp.length), width, height); // jshint ignore:line
            } else {
                    return _me._ctx.getImageData(x, y, width, height);
                }
        }
    }, {
        key: 'setPixel',
        value: function setPixel(x, y, imageData) {
            var _me = this;
            var _ctx = _me._ctx;

            if (!_ctx || !imageData) {
                return;
            }

            if (_me._locked) {
                var index = (x * _me.width + y) * 4;
                var data = _me._imageData.data;
                data[index] = imageData.data[0];
                data[index + 1] = imageData.data[1];
                data[index + 2] = imageData.data[2];
            } else {
                var tmp = _me.getPixels(x, y, 1, 1);
                tmp.data[0] = imageData.data[0];
                tmp.data[1] = imageData.data[1];
                tmp.data[2] = imageData.data[2];
                _ctx.putImageData(tmp, x, y, 0, 0, 1, 1);
            }
        }
    }, {
        key: 'setPixel32',
        value: function setPixel32(x, y, imageData) {
            var _me = this;
            var _ctx = _me._ctx;

            if (!_ctx || !imageData) {
                return;
            }

            if (_me._locked) {
                var index = (x * _me.width + y) * 4;
                var data = _me._imageData.data;
                data[index] = imageData.data[0];
                data[index + 1] = imageData.data[1];
                data[index + 2] = imageData.data[2];
                data[index + 3] = imageData.data[3];
            } else {
                var tmp = _me.getPixels(x, y, 1, 1);
                tmp.data[0] = imageData.data[0];
                tmp.data[1] = imageData.data[1];
                tmp.data[2] = imageData.data[2];
                tmp.data[3] = imageData.data[3];
                _ctx.putImageData(tmp, x, y, 0, 0, 1, 1);
            }
        }
    }, {
        key: 'setPixels',
        value: function setPixels(x, y, width, height, imageData) {
            var _me = this;
            var _ctx = _me._ctx;

            if (!_ctx || x > _me.width || y > _me.height || !imageData) {
                return;
            }

            width = x + width > _me.width ? _me.width - x : width;
            height = y + height > _me.height ? _me.height - y : height;

            if (_me._locked) {
                var data = _me._imageData.data;
                for (var i = 0; i < height; i += 1) {
                    var startIndex = (y + i) * _me.height + x;
                    for (var j = 0; j < width; j += 1) {
                        var index = (i * height + j) * 4;
                        for (var m = 0; m < 4; m += 1) {
                            data[(startIndex + j) * 4 + m] = imageData.data[index + m];
                        }
                    }
                }
            } else {
                var tmp = _me.getPixels(x, y, width, height);
                for (var i = 0; i < height; i += 1) {
                    for (var j = 0; j < width; j += 1) {
                        var index = (i * height + j) * 4;
                        for (var m = 0; m < 4; m += 1) {
                            tmp.data[index + m] = imageData.data[index + m];
                        }
                    }
                }

                _ctx.putImageData(tmp, x, y, 0, 0, width, height);
            }
        }
    }, {
        key: 'lock',
        value: function lock() {
            var _me = this;
            _me._locked = true;
            _me._imageData = _me._ctx.getImageData(0, 0, _me.width, _me.height);
        }
    }, {
        key: 'unlock',
        value: function unlock() {
            var _me = this;
            _me._locked = false;
            if (_me._imageData) {
                _me._ctx.putImageData(_me._imageData, 0, 0);
            }
            _me._imageData = null;
        }
    }]);

    return BitmapData;
})();

exports['default'] = BitmapData;
module.exports = exports['default'];

},{"./Matrix3":16}],4:[function(require,module,exports){
Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Global = require('./Global');

var _Global2 = _interopRequireDefault(_Global);

var _Matrix3 = require('./Matrix3');

var _Matrix32 = _interopRequireDefault(_Matrix3);

var _Util = require('./Util');

var _Util2 = _interopRequireDefault(_Util);

var _EventDispatcher2 = require('./EventDispatcher');

var _EventDispatcher3 = _interopRequireDefault(_EventDispatcher2);

var _Event = require('./Event');

var _Event2 = _interopRequireDefault(_Event);

var DisplayObject = (function (_EventDispatcher) {
    _inherits(DisplayObject, _EventDispatcher);

    function DisplayObject() {
        _classCallCheck(this, DisplayObject);

        _get(Object.getPrototypeOf(DisplayObject.prototype), 'constructor', this).call(this);
        this.name = 'DisplayObject';
        this.parent = null;
        this.globalCompositeOperation = '';
        this._mask = null;
        this._x = 0;
        this._y = 0;
        this._rotate = 0;
        this._scaleX = 1;
        this._scaleY = 1;
        this._height = 0;
        this._width = 0;
        this._alpha = 1;
        this.visible = true;
        this._isSaved = false;
        this._addedToStage = false;
        this._matrix = _Matrix32['default'].identity();
        this.aIndex = this.objectIndex = '' + _Global2['default'].guid;
        _Global2['default'].guid += 1;
    }

    _createClass(DisplayObject, [{
        key: 'on',
        value: function on() {
            _get(Object.getPrototypeOf(DisplayObject.prototype), 'on', this).apply(this, arguments);
        }
    }, {
        key: 'off',
        value: function off() {
            _get(Object.getPrototypeOf(DisplayObject.prototype), 'off', this).apply(this, arguments);
        }
    }, {
        key: 'show',
        value: function show(matrix) {
            var _me = this;
            var ctx = _me.ctx || _me.stage.ctx;
            var x = _me.x;
            var y = _me.y;
            var scaleX = _me.scaleX;
            var scaleY = _me.scaleY;
            var alpha = _me.alpha;
            var rotate = _me.rotate;
            var visible = _me.visible;
            var mask = _me.mask;

            _me._matrix = _Matrix32['default'].identity();

            if (!visible || !alpha) {
                _me._triggerAddToStageEvent();
                return false;
            }

            if (_me.mask !== null && _me.mask.show || _me.globalCompositeOperation !== '' || rotate !== 0 || scaleX !== 1 || scaleY !== 1 || x !== 0 || y !== 0) {
                _me._isSaved = true;
                ctx.save();
            }

            if (mask !== null && mask.show) {
                mask.show(matrix);
                ctx.clip();
            }

            if (_me.globalCompositeOperation !== '') {
                ctx.globalCompositeOperation = _me.globalCompositeOperation;
            }

            if (alpha < 1) {
                ctx.globalAlpha = alpha;
            }

            _me._matrix.multi(matrix);

            if (x !== 0 || y !== 0) {
                _me._matrix.multi(_Matrix32['default'].translation(x, y));
                ctx.translate(x, y);
            }

            if (rotate !== 0) {
                _me._matrix.multi(_Matrix32['default'].rotation(rotate));
                ctx.rotate(_Util2['default'].deg2rad(rotate));
            }

            if (scaleX !== 1 || scaleY !== 1) {
                _me._matrix.multi(_Matrix32['default'].scaling(scaleX, scaleY));
                ctx.scale(scaleX, scaleY);
            }

            _me._triggerAddToStageEvent();

            return true;
        }

        // jshint ignore:start

    }, {
        key: 'isMouseOn',
        value: function isMouseOn(cord) {
            // abstrct method, child class need to realize
        }
    }, {
        key: 'getBounds',
        value: function getBounds() {}
        // abstrct method, child class need to realize

        // jshint ignore:end

    }, {
        key: 'dispose',
        value: function dispose() {
            var _me = this;
            var eventNames = _Util2['default'].keys(_me._handlers);
            if (eventNames.length) {
                _me.off(eventNames);
            }
            _me._mask = null;
        }
    }, {
        key: '_triggerAddToStageEvent',
        value: function _triggerAddToStageEvent() {
            if (!this._addedToStage) {
                this._addedToStage = true;
                this.trigger(_Event2['default'].ADD_TO_STAGE);
            }
        }
    }, {
        key: 'width',
        get: function get() {
            return this._width;
        }
    }, {
        key: 'height',
        get: function get() {
            return this._height;
        }
    }, {
        key: 'x',
        get: function get() {
            return this._x;
        },
        set: function set(x) {
            this._x = x;
        }
    }, {
        key: 'y',
        get: function get() {
            return this._y;
        },
        set: function set(y) {
            this._y = y;
        }
    }, {
        key: 'rotate',
        get: function get() {
            return this._rotate;
        },
        set: function set(rotate) {
            this._rotate = rotate;
        }
    }, {
        key: 'scaleX',
        get: function get() {
            return this._scaleX;
        },
        set: function set(scaleX) {
            this._scaleX = scaleX;
        }
    }, {
        key: 'scaleY',
        get: function get() {
            return this._scaleY;
        },
        set: function set(scaleY) {
            this._scaleY = scaleY;
        }
    }, {
        key: 'alpha',
        get: function get() {
            return this._alpha;
        },
        set: function set(alpha) {
            if (alpha > 1) {
                alpha = 1;
            } else if (alpha < 0.001) {
                alpha = 0;
            }
            this._alpha = alpha;
        }
    }, {
        key: 'mask',
        get: function get() {
            return this._mask;
        },
        set: function set(mask) {
            this._mask = mask;
        }
    }]);

    return DisplayObject;
})(_EventDispatcher3['default']);

exports['default'] = DisplayObject;
module.exports = exports['default'];

},{"./Event":7,"./EventDispatcher":8,"./Global":9,"./Matrix3":16,"./Util":27}],5:[function(require,module,exports){
Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _InteractiveObject2 = require('./InteractiveObject');

var _InteractiveObject3 = _interopRequireDefault(_InteractiveObject2);

var _DisplayObject = require('./DisplayObject');

var _DisplayObject2 = _interopRequireDefault(_DisplayObject);

var _Util = require('./Util');

var _Util2 = _interopRequireDefault(_Util);

var _Matrix3 = require('./Matrix3');

var _Matrix32 = _interopRequireDefault(_Matrix3);

var _Vec3 = require('./Vec3');

var _Vec32 = _interopRequireDefault(_Vec3);

var _Global = require('./Global');

var _Global2 = _interopRequireDefault(_Global);

var _Event = require('./Event');

var _Event2 = _interopRequireDefault(_Event);

var DisplayObjectContainer = (function (_InteractiveObject) {
    _inherits(DisplayObjectContainer, _InteractiveObject);

    function DisplayObjectContainer() {
        _classCallCheck(this, DisplayObjectContainer);

        _get(Object.getPrototypeOf(DisplayObjectContainer.prototype), 'constructor', this).call(this);
        this.name = 'DisplayObjectContainer';
        this._childList = [];
    }

    _createClass(DisplayObjectContainer, [{
        key: 'addChild',
        value: function addChild(child) {
            var _me = this;
            if (child instanceof _DisplayObject2['default']) {
                var isNotExists = _Util2['default'].inArray(child, _me._childList, function (child, item) {
                    return child.aIndex === item.aIndex;
                }) === -1;

                if (isNotExists) {
                    child.parent = _me;
                    child.stage = child.stage ? child.stage : _me.stage;
                    child.objectIndex = _me.objectIndex + '.' + (_me._childList.length + 1);
                    _me._childList.push(child);
                }
            }
        }
    }, {
        key: 'removeChild',
        value: function removeChild(child) {
            var _me = this;
            if (child instanceof _DisplayObject2['default']) {
                for (var i = _me._childList.length - 1; i >= 0; i -= 1) {
                    var item = _me._childList[i];
                    if (item.aIndex === child.aIndex) {
                        item.parent = null;
                        item.stage = null;
                        Array.prototype.splice.call(_me._childList, i, 1);
                        break;
                    }
                }
            }
        }
    }, {
        key: 'getAllChild',
        value: function getAllChild() {
            var _me = this;
            return _Util2['default'].clone(_me._childList);
        }
    }, {
        key: 'getChildAt',
        value: function getChildAt(index) {
            var _me = this;
            var len = _me._childList.length;

            if (Math.abs(index) > len) {
                return;
            } else if (index < 0) {
                index = len + index;
            }

            return _me._childList[index];
        }
    }, {
        key: 'contains',
        value: function contains(child) {
            var _me = this;
            if (child instanceof _DisplayObject2['default']) {
                return _Util2['default'].inArray(child, _me._childList, function (child, item) {
                    return child.aIndex === item.aIndex;
                }) !== -1;
            }
        }
    }, {
        key: 'show',
        value: function show(matrix) {
            var _me = this;

            if (matrix === null) {
                matrix = _Matrix32['default'].clone(_me._matrix);
            }

            var isDrew = _get(Object.getPrototypeOf(DisplayObjectContainer.prototype), 'show', this).call(this, matrix);

            if (isDrew) {
                var ctx = _me.ctx || _me.stage.ctx;
                for (var i = 0, len = _me._childList.length; i < len; i += 1) {
                    var item = _me._childList[i];
                    if (item.show) {
                        item.show(_me._matrix);
                        if (item._isSaved) {
                            item._isSaved = false;
                            ctx.restore();
                        }
                    }
                    item.trigger(_Event2['default'].ENTER_FRAME);
                }

                if (_me._isSaved) {
                    _me._isSaved = false;
                    ctx.restore();
                }
            }

            _me.trigger(_Event2['default'].ENTER_FRAME);

            return isDrew;
        }
    }, {
        key: 'dispose',
        value: function dispose() {
            var _me = this;
            _Util2['default'].each(_me._childList, function (child) {
                _me.removeChild(child);
                if (child.dispose) {
                    child.dispose();
                }
            });
            _get(Object.getPrototypeOf(DisplayObjectContainer.prototype), 'dispose', this).call(this);
        }
    }, {
        key: 'isMouseOn',
        value: function isMouseOn(cord) {
            var _me = this;

            for (var i = 0, len = _me._childList.length; i < len; i += 1) {
                var item = _me._childList[i];
                if (item.isMouseOn && item.isMouseOn(cord)) {
                    return true;
                }
            }

            return false;
        }
    }, {
        key: 'getBounds',
        value: function getBounds() {
            var _me = this;
            var childList = _me._childList;
            var sv = _Vec32['default'].clone(_Global2['default'].maxNumberVec3);
            var ev = _Vec32['default'].clone(_Global2['default'].minNumberVec3);

            _Util2['default'].each(childList, function (child) {
                if (typeof child.getBounds === 'function') {
                    var bounds = child.getBounds();
                    sv.x = bounds.sv.x < sv.x ? bounds.sv.x : sv.x;
                    sv.y = bounds.sv.y < sv.y ? bounds.sv.y : sv.y;
                    ev.x = bounds.ev.x > ev.x ? bounds.ev.x : ev.x;
                    ev.y = bounds.ev.y > ev.y ? bounds.ev.y : ev.y;
                }
            });

            if (sv.x === _Global2['default'].maxNumber || ev.x === _Global2['default'].minNumber || sv.y === _Global2['default'].maxNumber || ev.y === _Global2['default'].minNumber) {
                sv = ev = _Vec32['default'].zero();
            }

            return {
                sv: sv,
                ev: ev
            };
        }
    }, {
        key: 'width',
        get: function get() {
            var _me = this;
            var bounds = _me.getBounds();
            return Math.abs(bounds.ev.x - bounds.sv.x);
        }
    }, {
        key: 'height',
        get: function get() {
            var _me = this;
            var bounds = _me.getBounds();
            return Math.abs(bounds.ev.y - bounds.sv.y);
        }
    }]);

    return DisplayObjectContainer;
})(_InteractiveObject3['default']);

exports['default'] = DisplayObjectContainer;
module.exports = exports['default'];

},{"./DisplayObject":4,"./Event":7,"./Global":9,"./InteractiveObject":11,"./Matrix3":16,"./Util":27,"./Vec3":28}],6:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = {
    easeInSine: { a: { x: 0.47, y: 0 }, b: { x: 0.745, y: 0.715 } },
    easeOutSine: { a: { x: 0.39, y: 0.575 }, b: { x: 0.565, y: 1 } },
    easeInOutSine: { a: { x: 0.445, y: 0.05 }, b: { x: 0.55, y: 0.95 } },
    easeInQuad: { a: { x: 0.55, y: 0.085 }, b: { x: 0.68, y: 0.53 } },
    easeOutQuad: { a: { x: 0.25, y: 0.46 }, b: { x: 0.45, y: 0.94 } },
    easeInOutQuad: { a: { x: 0.455, y: 0.03 }, b: { x: 0.515, y: 0.955 } },
    easeInCubic: { a: { x: 0.55, y: 0.055 }, b: { x: 0.675, y: 0.19 } },
    easeOutCubic: { a: { x: 0.215, y: 0.61 }, b: { x: 0.355, y: 1 } },
    easeInOutCubic: { a: { x: 0.645, y: 0.045 }, b: { x: 0.355, y: 1 } },
    easeInQuart: { a: { x: 0.895, y: 0.03 }, b: { x: 0.685, y: 0.22 } },
    easeOutQuart: { a: { x: 0.165, y: 0.84 }, b: { x: 0.44, y: 1 } },
    easeInOutQuart: { a: { x: 0.77, y: 0 }, b: { x: 0.0175, y: 1 } },
    easeInQuint: { a: { x: 0.755, y: 0.05 }, b: { x: 0.855, y: 0.06 } },
    easeOutQuint: { a: { x: 0.23, y: 1 }, b: { x: 0.32, y: 1 } },
    easeInOutQuint: { a: { x: 0.86, y: 0 }, b: { x: 0.07, y: 1 } },
    easeInExpo: { a: { x: 0.95, y: 0.05 }, b: { x: 0.795, y: 0.035 } },
    easeOutExpo: { a: { x: 0.19, y: 1 }, b: { x: 0.22, y: 1 } },
    easeInOutExpo: { a: { x: 1, y: 0 }, b: { x: 0, y: 1 } },
    easeInCirc: { a: { x: 0.6, y: 0.04 }, b: { x: 0.98, y: 0.335 } },
    easeOutCirc: { a: { x: 0.075, y: 0.82 }, b: { x: 0.165, y: 1 } },
    easeInOutCirc: { a: { x: 0.785, y: 0.135 }, b: { x: 0.15, y: 0.86 } },
    easeInBack: { a: { x: 0.6, y: -0.28 }, b: { x: 0.735, y: 0.045 } },
    easeOutBack: { a: { x: 0.175, y: 0.885 }, b: { x: 0.32, y: 1.275 } },
    easeInOutBack: { a: { x: 0.68, y: -0.55 }, b: { x: 0.265, y: 1.55 } }
};
module.exports = exports["default"];

},{}],7:[function(require,module,exports){
Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = {
    ADD_TO_STAGE: 'add_to_stage',
    ENTER_FRAME: 'enter_frame'
};
module.exports = exports['default'];

},{}],8:[function(require,module,exports){
Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Global = require('./Global');

var _Global2 = _interopRequireDefault(_Global);

var _Util = require('./Util');

var _Util2 = _interopRequireDefault(_Util);

var EventDispatcher = (function () {
    function EventDispatcher() {
        _classCallCheck(this, EventDispatcher);
    }

    _createClass(EventDispatcher, [{
        key: 'on',
        value: function on(target, eventName, callback, useCapture) {
            var _me = this;

            if (typeof target === 'string') {
                var _ref = [_me, target, eventName, callback];
                target = _ref[0];
                eventName = _ref[1];
                callback = _ref[2];
                useCapture = _ref[3];
            }

            if (eventName && callback) {
                useCapture = useCapture ? useCapture : false;
                if (_Util2['default'].isType(eventName, 'Array')) {
                    _Util2['default'].each(eventName, function (item) {
                        EventDispatcher.prototype.on.call(_me, item, callback, useCapture);
                    });
                } else {
                    (function () {
                        var handlers = target.handlers;
                        var fn = function fn(event) {
                            var callbacks = handlers[eventName];
                            var ev = _me._fixEvent(event);

                            for (var i = 0, len = callbacks.length; i < len; i += 1) {
                                var item = callbacks[i];
                                if (ev.isImmediatePropagationStopped()) {
                                    break;
                                } else if (item._guid === fn._guid) {
                                    item._callback.call(_me, ev);
                                }
                            }
                        };

                        fn._fnStr = callback._fntStr ? callback._fnStr : callback.toString().replace(_Global2['default'].fnRegExp, '');
                        fn._callback = callback;
                        fn._useCapture = useCapture;
                        fn._guid = _Global2['default'].guid;
                        _Global2['default'].guid += 1;

                        if (!handlers) {
                            handlers = target.handlers = {};
                        }

                        if (!handlers[eventName]) {
                            handlers[eventName] = [];
                        }

                        handlers[eventName].push(fn);

                        if (handlers[eventName].length) {
                            if (target.addEventListener) {
                                target.addEventListener(eventName, fn, useCapture);
                            } else if (target.attachEvent) {
                                target.attachEvent(eventName, fn);
                            }
                        }
                    })();
                }
            }

            return _me;
        }
    }, {
        key: 'off',
        value: function off(target, eventName, callback) {
            var _me = this;
            if (typeof target === 'string') {
                var _ref2 = [_me, target, eventName];
                target = _ref2[0];
                eventName = _ref2[1];
                callback = _ref2[2];
            }

            if (eventName || callback) {
                if (_Util2['default'].isType(eventName, 'Array')) {
                    _Util2['default'].each(eventName, function (item) {
                        EventDispatcher.prototype.off.call(_me, target, item, callback);
                    });
                } else if (!callback) {
                    var handlers = target.handlers;
                    if (handlers) {
                        var callbacks = handlers[eventName] ? handlers[eventName] : [];
                        _Util2['default'].each(callbacks, function (item) {
                            EventDispatcher.prototype.off.call(_me, target, eventName, item);
                        });
                    }
                } else {
                    var handlers = target.handlers;
                    if (handlers) {
                        var fnStr = callback._fnStr ? callback._fnStr : callback.toString().replace(_Global2['default'].fnRegExp, '');
                        var callbacks = handlers[eventName] ? handlers[eventName] : [];

                        for (var i = callbacks.length - 1; i >= 0; i -= 1) {
                            var item = callbacks[i];
                            if (item._fnStr === fnStr) {
                                Array.prototype.splice.call(callbacks, i, 1);
                            }
                        }
                    }
                }
            }

            return _me;
        }
    }, {
        key: 'once',
        value: function once(target, eventName, callback, useCapture) {
            var _me = this;

            if (typeof target === 'string') {
                var _ref3 = [_me, target, eventName, callback];
                target = _ref3[0];
                eventName = _ref3[1];
                callback = _ref3[2];
                useCapture = _ref3[3];
            }

            var fn = function fn(event) {
                callback.call(_me, event);

                if (event.isImmediatePropagationStopped()) {
                    EventDispatcher.prototype.off.call(target, eventName, fn);
                }

                if (useCapture) {
                    if (event.eventPhase === 0) {
                        EventDispatcher.prototype.off.call(target, eventName, fn);
                    }
                } else {
                    EventDispatcher.prototype.off.call(target, eventName, fn);
                }
            };

            fn._fnStr = callback.toString().replace(_Global2['default'].fnRegExp, '');
            EventDispatcher.prototype.on.call(target, eventName, fn, useCapture);
            return _me;
        }
    }, {
        key: 'trigger',
        value: function trigger(target, eventName, event) {
            var _me = this;

            if (!target && !eventName) {
                return;
            } else if (typeof target === 'string') {
                var _ref4 = [_me, target, eventName];
                target = _ref4[0];
                eventName = _ref4[1];
                event = _ref4[2];
            }

            var handlers = target && target.handlers;
            if (!handlers) {
                return _me;
            }

            var callbacks = handlers[eventName] ? handlers[eventName] : [];
            if (!callbacks.length) {
                return _me;
            }

            var ev = event || {};
            if (ev.target === null) {
                ev.target = ev.currentTarget = target;
            }

            ev = _me._fixEvent(ev);

            var parent = target.parent || target.parentNode;
            var handlerList = {
                propagations: [],
                useCaptures: []
            };

            while (parent) {
                var _handlers = parent.handlers;
                if (_handlers) {
                    var _callbacks = _handlers[eventName] ? _handlers[eventName] : [];
                    for (var i = 0, len = _callbacks.length; i < len; i += 1) {
                        var useCapture = _callbacks[i]._useCapture;
                        if (!useCapture) {
                            handlerList.propagations.push({
                                target: parent,
                                callback: _callbacks[i]
                            });
                        } else {
                            var tmp = {
                                target: parent,
                                callback: _callbacks[i]
                            };

                            if (!i) {
                                handlerList.useCaptures.unshift(tmp);
                            } else {
                                handlerList.useCaptures.splice(1, 0, tmp);
                            }
                        }
                    }
                }
                parent = parent.parent || parent.parentNode;
            }

            var useCaptures = handlerList.useCaptures;
            var prevTarget = null;
            ev.eventPhase = 0;
            for (var i = 0, len = useCaptures.length; i < len; i += 1) {
                var handler = useCaptures[i];
                target = handler.target;

                if (ev.isImmediatePropagationStopped()) {
                    break;
                } else if (prevTarget === target && ev.isPropagationStopped()) {
                    handler.callback.call(_me, ev);
                } else {
                    handler.callback.call(_me, ev);
                    prevTarget = target;
                }
            }

            var isUseCapturePhaseStopped = false;
            if (useCaptures.length) {
                isUseCapturePhaseStopped = ev.isImmediatePropagationStopped() || ev.isPropagationStopped();
            }

            ev.eventPhase = 1;
            for (var i = 0, len = callbacks.length; i < len; i += 1) {
                var item = callbacks[i];
                if (isUseCapturePhaseStopped) {
                    break;
                } else {
                    item.call(_me, ev);
                }
            }

            var propagations = handlerList.propagations;
            prevTarget = null;
            ev.eventPhase = 2;
            for (var i = 0, len = propagations.length; i < len; i += 1) {
                var handler = propagations[i];
                target = handler.target;
                ev.target = target;
                if (isUseCapturePhaseStopped) {
                    if (ev.isImmediatePropagationStopped() || ev.isPropagationStopped()) {
                        break;
                    } else {
                        handler.callback.call(_me, ev);
                        prevTarget = target;
                    }
                } else {
                    if (ev.isImmediatePropagationStopped()) {
                        break;
                    } else if (ev.isPropagationStopped()) {
                        if (prevTarget === target) {
                            handler.callback.call(_me, ev);
                        } else {
                            break;
                        }
                    } else {
                        handler.callback.call(_me, ev);
                        prevTarget = target;
                    }
                }
            }
        }
    }, {
        key: '_fixEvent',
        value: function _fixEvent(event) {
            var _me = this;
            var returnTrue = function returnTrue() {
                return true;
            };
            var returnFalse = function returnFalse() {
                return false;
            };

            if (!event || !event.isPropagationStopped) {
                (function () {
                    event = event ? event : {};

                    var preventDefault = event.preventDefault;
                    var stopPropagation = event.stopPropagation;
                    var stopImmediatePropagation = event.stopImmediatePropagation;

                    if (!event.target) {
                        event.target = event.srcElement || document;
                    }

                    if (!event.currentTarget) {
                        event.currentTarget = _me;
                    }

                    event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;

                    event.preventDefault = function () {
                        if (preventDefault) {
                            preventDefault.call(event);
                        }
                        event.returnValue = false;
                        event.isDefaultPrevented = returnTrue;
                        event.defaultPrevented = true;
                    };

                    event.isDefaultPrevented = returnFalse;
                    event.defaultPrevented = false;

                    event.stopPropagation = function () {
                        if (stopPropagation) {
                            stopPropagation.call(event);
                        }
                        event.cancelBubble = true;
                        event.isPropagationStopped = returnTrue;
                    };

                    event.isPropagationStopped = returnFalse;

                    event.stopImmediatePropagation = function () {
                        if (stopImmediatePropagation) {
                            stopImmediatePropagation.call(event);
                        }
                        event.isImmediatePropagationStopped = returnTrue;
                        event.stopPropagation();
                    };

                    event.isImmediatePropagationStopped = returnFalse;

                    if (event.clientX !== null) {
                        var doc = document.documentElement,
                            body = document.body;

                        event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);

                        event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
                    }

                    event.which = event.charCode || event.keyCode;
                })();
            }

            return event;
        }
    }]);

    return EventDispatcher;
})();

exports['default'] = EventDispatcher;
module.exports = exports['default'];

},{"./Global":9,"./Util":27}],9:[function(require,module,exports){
Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Vec3 = require('./Vec3');

var _Vec32 = _interopRequireDefault(_Vec3);

var Global = (function () {
    function Global() {
        _classCallCheck(this, Global);
    }

    _createClass(Global, null, [{
        key: 'guid',
        get: function get() {
            this._guid = this._guid || 0;
            return this._guid;
        },
        set: function set(guid) {
            this._guid = guid;
        }
    }, {
        key: 'fnRegExp',
        get: function get() {
            return (/\s+/g
            );
        }
    }, {
        key: 'maxNumber',
        get: function get() {
            return Number.MAX_VALUE;
        }
    }, {
        key: 'minNumber',
        get: function get() {
            return -1 * Number.MAX_VALUE;
        }
    }, {
        key: 'maxNumberVec3',
        get: function get() {
            var maxNumber = Number.MAX_VALUE;
            return new _Vec32['default'](maxNumber, maxNumber, 1);
        }
    }, {
        key: 'minNumberVec3',
        get: function get() {
            var minNumber = -1 * Number.MAX_VALUE;
            return new _Vec32['default'](minNumber, minNumber, 1);
        }
    }]);

    return Global;
})();

exports['default'] = Global;
module.exports = exports['default'];

},{"./Vec3":28}],10:[function(require,module,exports){
Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Util = require('./Util');

var _Util2 = _interopRequireDefault(_Util);

var _EventDispatcher = require('./EventDispatcher');

var _EventDispatcher2 = _interopRequireDefault(_EventDispatcher);

var InteractiveEvent = (function () {
    function InteractiveEvent() {
        _classCallCheck(this, InteractiveEvent);
    }

    _createClass(InteractiveEvent, null, [{
        key: 'getList',
        value: function getList() {
            return _Util2['default'].clone(this._list);
        }
    }, {
        key: 'add',
        value: function add(eventName, item) {
            if (item instanceof _EventDispatcher2['default']) {
                var list = this._list;
                list[eventName] = list[eventName] ? list[eventName] : [];

                var isNotExists = _Util2['default'].inArray(item, list[eventName], function (a1, a2) {
                    return a1.aIndex === a2.aIndex;
                }) === -1;

                if (isNotExists) {
                    list[eventName].push(item);
                }
            }
        }
    }, {
        key: 'remove',
        value: function remove(eventName, item) {
            if (item instanceof _EventDispatcher2['default']) {
                var list = this._list;
                if (list[eventName]) {
                    var index = _Util2['default'].inArray(item, list[eventName], function (a1, a2) {
                        return a1.aIndex === a2.aIndex;
                    });

                    if (index !== -1) {
                        list[eventName].splice(index, 1);
                    }
                }
            }
        }
    }, {
        key: '_list',
        get: function get() {
            this._list_ = this._list_ || {};
            return this._list_;
        },
        set: function set(list) {
            this._list_ = list;
        }
    }]);

    return InteractiveEvent;
})();

exports['default'] = InteractiveEvent;
module.exports = exports['default'];

},{"./EventDispatcher":8,"./Util":27}],11:[function(require,module,exports){
Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _DisplayObject2 = require('./DisplayObject');

var _DisplayObject3 = _interopRequireDefault(_DisplayObject2);

var _Util = require('./Util');

var _Util2 = _interopRequireDefault(_Util);

var _KeyboardEvent = require('./KeyboardEvent');

var _KeyboardEvent2 = _interopRequireDefault(_KeyboardEvent);

var _MouseEvent = require('./MouseEvent');

var _MouseEvent2 = _interopRequireDefault(_MouseEvent);

var InteractiveObject = (function (_DisplayObject) {
    _inherits(InteractiveObject, _DisplayObject);

    function InteractiveObject() {
        _classCallCheck(this, InteractiveObject);

        _get(Object.getPrototypeOf(InteractiveObject.prototype), 'constructor', this).call(this);
        this.name = 'InteractiveObject';
    }

    _createClass(InteractiveObject, [{
        key: 'on',
        value: function on(eventName, callback, useCapture) {
            var _me = this;
            if (arguments.length > 1) {
                var eventNameUpperCase = eventName.toUpperCase();
                if (_Util2['default'].inArray(eventNameUpperCase, _MouseEvent2['default'].nameList) !== -1) {
                    _MouseEvent2['default'].add(eventName, _me);
                } else if (_Util2['default'].inArray(eventNameUpperCase, _KeyboardEvent2['default'].nameList) !== -1) {
                    _KeyboardEvent2['default'].add(eventName, _me);
                }

                _get(Object.getPrototypeOf(InteractiveObject.prototype), 'on', this).call(this, _me, eventName, callback, useCapture);
            }
        }
    }, {
        key: 'off',
        value: function off(eventName, callback) {
            var _me = this;

            if (arguments.length) {
                var eventNameUpperCase = eventName.toUpperCase();
                if (_Util2['default'].inArray(eventNameUpperCase, _MouseEvent2['default'].nameList) !== -1) {
                    _MouseEvent2['default'].remove(eventName, _me);
                } else if (_Util2['default'].inArray(eventNameUpperCase, _KeyboardEvent2['default'].nameList) !== -1) {
                    _KeyboardEvent2['default'].remove(eventName, _me);
                }
            } else {
                _Util2['default'].each(_MouseEvent2['default'].nameList, function (item) {
                    _MouseEvent2['default'].remove(item, _me);
                });
                _Util2['default'].each(_KeyboardEvent2['default'].nameList, function (item) {
                    _KeyboardEvent2['default'].remove(item, _me);
                });
            }

            _get(Object.getPrototypeOf(InteractiveObject.prototype), 'off', this).call(this, _me, eventName, callback);
        }
    }]);

    return InteractiveObject;
})(_DisplayObject3['default']);

exports['default'] = InteractiveObject;
module.exports = exports['default'];

},{"./DisplayObject":4,"./KeyboardEvent":12,"./MouseEvent":17,"./Util":27}],12:[function(require,module,exports){
Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _InteractiveEvent2 = require('./InteractiveEvent');

var _InteractiveEvent3 = _interopRequireDefault(_InteractiveEvent2);

var _Util = require('./Util');

var _Util2 = _interopRequireDefault(_Util);

var KeyboardEvent = (function (_InteractiveEvent) {
    _inherits(KeyboardEvent, _InteractiveEvent);

    function KeyboardEvent() {
        _classCallCheck(this, KeyboardEvent);

        _get(Object.getPrototypeOf(KeyboardEvent.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(KeyboardEvent, null, [{
        key: 'getItems',
        value: function getItems(eventName) {
            var _me = this;
            return _me._list[eventName] || [];
        }
    }]);

    return KeyboardEvent;
})(_InteractiveEvent3['default']);

exports['default'] = KeyboardEvent;

var keyboardEvents = {
    KEYDOWN: 'keydown',
    KEYUP: 'keyup',
    KEYPRESS: 'keypress'
};

for (var key in keyboardEvents) {
    if (keyboardEvents.hasOwnProperty(key)) {
        KeyboardEvent[key] = keyboardEvents[key];
    }
}

KeyboardEvent.nameList = _Util2['default'].keys(keyboardEvents);
module.exports = exports['default'];

},{"./InteractiveEvent":10,"./Util":27}],13:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Label = function Label() {
  _classCallCheck(this, Label);
};

exports["default"] = Label;
module.exports = exports["default"];

},{}],14:[function(require,module,exports){
Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _DisplayObjectContainer2 = require('./DisplayObjectContainer');

var _DisplayObjectContainer3 = _interopRequireDefault(_DisplayObjectContainer2);

var _LoaderEvent = require('./LoaderEvent');

var _LoaderEvent2 = _interopRequireDefault(_LoaderEvent);

var _Util = require('./Util');

var _Util2 = _interopRequireDefault(_Util);

var _BitmapData = require('./BitmapData');

var _BitmapData2 = _interopRequireDefault(_BitmapData);

var Loader = (function (_DisplayObjectContainer) {
    _inherits(Loader, _DisplayObjectContainer);

    function Loader() {
        _classCallCheck(this, Loader);

        _get(Object.getPrototypeOf(Loader.prototype), 'constructor', this).call(this);
        this.content = new Image();
        this._close = false;
        this._loading = false;
        this._queue = [];
    }

    _createClass(Loader, [{
        key: 'on',
        value: function on(eventName, callback) {
            _get(Object.getPrototypeOf(Loader.prototype), 'on', this).call(this, eventName, callback, false);
        }
    }, {
        key: 'off',
        value: function off(eventName, callback) {
            _get(Object.getPrototypeOf(Loader.prototype), 'off', this).call(this, eventName, callback);
        }
    }, {
        key: 'toBitmapData',
        value: function toBitmapData(matrix) {
            var _me = this;
            var bmd = new _BitmapData2['default'](_me.content.width, _me.content.height);
            bmd.draw(_me.content, matrix);
            return bmd;
        }
    }, {
        key: 'load',
        value: function load(request) {
            var _me = this;
            var params = [];

            request.method = request.method.toUpperCase();

            if (request === null) {
                console.error('Loader need URLRequest instance'); // jshint ignore:line
                return;
            }

            if (_me._loading) {
                _me._queue.push(request);
                return;
            }

            var url = request.url;
            var data = request.data;
            var keys = _Util2['default'].keys(request.data);
            if (keys.length) {
                params = _Util2['default'].map(request.data, function (val, key) {
                    return key + '=' + encodeURIComponent(val);
                });
                data = params.join('&');
            }

            if (request.method === 'GET') {
                if (keys.length) {
                    url += '?' + data;
                }
                data = null;
            }

            _me.content.onload = function () {
                _me._onload();
            };

            _me.content.onerror = function () {
                _me._onerror();
            };

            _me.content.src = url;
            _me._loading = true;
        }
    }, {
        key: 'close',
        value: function close() {
            this._close = true;
        }
    }, {
        key: '_onload',
        value: function _onload() {
            var _me = this;
            if (!_me._close) {
                _me.trigger(_me, _LoaderEvent2['default'].COMPLETE, {
                    target: _me
                });
            }

            _me._close = false;
            _me._loading = false;
            _me._next();
        }
    }, {
        key: '_onerror',
        value: function _onerror() {
            var _me = this;
            if (!_me._close) {
                _me.trigger(_me, _LoaderEvent2['default'].ERROR);
            }

            _me._close = false;
            _me._loading = false;
            _me._next();
        }
    }, {
        key: '_next',
        value: function _next() {
            var _me = this;
            if (_me._queue.length) {
                _me.load(_me._queue.shift());
            }
        }
    }]);

    return Loader;
})(_DisplayObjectContainer3['default']);

exports['default'] = Loader;
module.exports = exports['default'];

},{"./BitmapData":3,"./DisplayObjectContainer":5,"./LoaderEvent":15,"./Util":27}],15:[function(require,module,exports){
Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = {
    COMPLETE: 'complete',
    ERROR: 'error'
};
module.exports = exports['default'];

},{}],16:[function(require,module,exports){
Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Util = require('./Util');

var _Util2 = _interopRequireDefault(_Util);

var Matrix3 = (function () {
    function Matrix3(m) {
        _classCallCheck(this, Matrix3);

        this._matrix = m || [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0];
    }

    _createClass(Matrix3, [{
        key: 'setMatrix',
        value: function setMatrix(matrix) {
            this._matrix = matrix;
            return this;
        }
    }, {
        key: 'getMatrix',
        value: function getMatrix() {
            return this._matrix;
        }
    }, {
        key: 'add',
        value: function add(matrix3) {
            var matrix = matrix3._matrix;

            this._matrix[0] += matrix[0];
            this._matrix[1] += matrix[1];
            this._matrix[2] += matrix[2];

            this._matrix[3] += matrix[3];
            this._matrix[4] += matrix[4];
            this._matrix[5] += matrix[5];

            this._matrix[6] += matrix[6];
            this._matrix[7] += matrix[7];
            this._matrix[8] += matrix[8];

            return this;
        }
    }, {
        key: 'sub',
        value: function sub(matrix3) {
            var matrix = matrix3._matrix;

            this._matrix[0] -= matrix[0];
            this._matrix[1] -= matrix[1];
            this._matrix[2] -= matrix[2];

            this._matrix[3] -= matrix[3];
            this._matrix[4] -= matrix[4];
            this._matrix[5] -= matrix[5];

            this._matrix[6] -= matrix[6];
            this._matrix[7] -= matrix[7];
            this._matrix[8] -= matrix[8];

            return this;
        }
    }, {
        key: 'multi',
        value: function multi(matrix3) {
            var matrix = matrix3._matrix;

            var b00 = matrix[0];
            var b10 = matrix[1];
            var b20 = matrix[2];

            var b01 = matrix[3];
            var b11 = matrix[4];
            var b21 = matrix[5];

            var b02 = matrix[6];
            var b12 = matrix[7];
            var b22 = matrix[8];

            matrix = this._matrix;

            var a00 = matrix[0];
            var a10 = matrix[1];
            var a20 = matrix[2];

            var a01 = matrix[3];
            var a11 = matrix[4];
            var a21 = matrix[5];

            var a02 = matrix[6];
            var a12 = matrix[7];
            var a22 = matrix[8];

            matrix[0] = a00 * b00 + a01 * b10 + a02 * b20;
            matrix[1] = a10 * b00 + a11 * b10 + a12 * b20;
            matrix[2] = a20 * b00 + a21 * b10 + a22 * b20;

            matrix[3] = a00 * b01 + a01 * b11 + a02 * b21;
            matrix[4] = a10 * b01 + a11 * b11 + a12 * b21;
            matrix[5] = a20 * b01 + a21 * b11 + a22 * b21;

            matrix[6] = a00 * b02 + a01 * b12 + a02 * b22;
            matrix[7] = a10 * b02 + a11 * b12 + a12 * b22;
            matrix[8] = a20 * b02 + a21 * b12 + a22 * b22;

            return this;
        }
    }, {
        key: 'translate',
        value: function translate(x, y) {
            this._matrix[6] = x;
            this._matrix[7] = y;

            return this;
        }
    }, {
        key: 'rotate',
        value: function rotate(angle) {
            var cosa = Math.cos(angle * Math.PI / 180);
            var sina = Math.sin(angle * Math.PI / 180);
            this._matrix[0] = cosa;
            this._matrix[1] = sina;
            this._matrix[3] = -sina;
            this._matrix[4] = cosa;

            return this;
        }
    }, {
        key: 'scale',
        value: function scale(scaleX, scaleY) {
            this._matrix[0] = scaleX;
            this._matrix[4] = scaleY;

            return this;
        }
    }], [{
        key: 'clone',
        value: function clone(m) {
            var matrix = m.getMatrix();
            var tmp = [];

            for (var i = 0, len = matrix.length; i < len; i += 1) {
                tmp[i] = matrix[i];
            }

            return new Matrix3(tmp);
        }
    }, {
        key: 'copy',
        value: function copy(m1, m2) {
            var clone = Matrix3.clone(m2);
            m1.setMatrix(clone.getMatrix());
        }
    }, {
        key: 'zero',
        value: function zero() {
            return new Matrix3([0, 0, 0, 0, 0, 0, 0, 0, 0]);
        }
    }, {
        key: 'isZero',
        value: function isZero(matrix) {
            matrix = matrix.getMatrix();
            return _Util2['default'].every(matrix, function (item) {
                return item === 0;
            });
        }
    }, {
        key: 'identity',
        value: function identity() {
            return new Matrix3([1, 0, 0, 0, 1, 0, 0, 0, 1]);
        }
    }, {
        key: 'isIdentity',
        value: function isIdentity(matrix) {
            matrix = matrix.getMatrix();
            return _Util2['default'].every(matrix, function (item, index) {
                if (index % 4 === 0) {
                    return item === 1;
                } else {
                    return item === 0;
                }
            });
        }
    }, {
        key: 'translation',
        value: function translation(x, y) {
            return new Matrix3([1, 0, 0, 0, 1, 0, x, y, 1]);
        }
    }, {
        key: 'rotation',
        value: function rotation(angle) {
            var cosa = Math.cos(angle * Math.PI / 180);
            var sina = Math.sin(angle * Math.PI / 180);
            return new Matrix3([cosa, sina, 0, -sina, cosa, 0, 0, 0, 1]);
        }
    }, {
        key: 'scaling',
        value: function scaling(scaleX, scaleY) {
            return new Matrix3([scaleX, 0, 0, 0, scaleY, 0, 0, 0, 1]);
        }
    }, {
        key: 'transpose',
        value: function transpose(m) {
            var matrix = m.getMatrix();
            var tmp = matrix[1];

            matrix[1] = matrix[3];
            matrix[3] = tmp;

            tmp = matrix[2];
            matrix[2] = matrix[6];
            matrix[6] = tmp;

            tmp = matrix[5];
            matrix[5] = matrix[7];
            matrix[7] = tmp;

            m.setMatrix(matrix);
        }
    }, {
        key: 'inverse',
        value: function inverse(m) {
            var matrix = m.getMatrix();

            var a00 = matrix[0];
            var a01 = matrix[1];
            var a02 = matrix[2];

            var a10 = matrix[3];
            var a11 = matrix[4];
            var a12 = matrix[5];

            var a20 = matrix[6];
            var a21 = matrix[7];
            var a22 = matrix[8];

            var deter = a00 * a11 * a22 + a01 * a12 * a20 + a02 * a10 * a21 - a02 * a11 * a20 - a01 * a10 * a22 - a00 * a12 * a21;

            var c00 = (a11 * a22 - a21 * a12) / deter;
            var c01 = -(a10 * a22 - a20 * a12) / deter;
            var c02 = (a10 * a21 - a20 * a11) / deter;

            var c10 = -(a01 * a22 - a21 * a02) / deter;
            var c11 = (a00 * a22 - a20 * a02) / deter;
            var c12 = -(a00 * a21 - a20 * a01) / deter;

            var c20 = (a01 * a12 - a11 * a02) / deter;
            var c21 = -(a00 * a12 - a10 * a02) / deter;
            var c22 = (a00 * a11 - a10 * a01) / deter;

            matrix = new Matrix3([c00, c01, c02, c10, c11, c12, c20, c21, c22]);

            Matrix3.transpose(matrix);

            return matrix;
        }
    }]);

    return Matrix3;
})();

exports['default'] = Matrix3;
module.exports = exports['default'];

},{"./Util":27}],17:[function(require,module,exports){
Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _InteractiveEvent2 = require('./InteractiveEvent');

var _InteractiveEvent3 = _interopRequireDefault(_InteractiveEvent2);

var _Util = require('./Util');

var _Util2 = _interopRequireDefault(_Util);

var MouseEvent = (function (_InteractiveEvent) {
    _inherits(MouseEvent, _InteractiveEvent);

    function MouseEvent() {
        _classCallCheck(this, MouseEvent);

        _get(Object.getPrototypeOf(MouseEvent.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(MouseEvent, null, [{
        key: 'getTopItem',
        value: function getTopItem(eventName, cord) {
            var _me = this;
            var items = _me._list[eventName] || [];

            items = _Util2['default'].filter(items, function (item) {
                if (item.isMouseOn && item.isMouseOn(cord)) {
                    return true;
                }
            });

            items = Array.prototype.sort.call(items, function (i, j) {
                var a1 = i.objectIndex.split('.');
                var a2 = j.objectIndex.split('.');
                var len = Math.max(a1.length, a2.length);

                for (var k = 0; k < len; k += 1) {
                    if (!a2[k] || !a1[k]) {
                        return a2[k] ? 1 : -1;
                    } else if (a2[k] !== a1[k]) {
                        return a2[k] - a1[k];
                    }
                }
            });

            return items[0];
        }
    }]);

    return MouseEvent;
})(_InteractiveEvent3['default']);

exports['default'] = MouseEvent;

var mouseEvents = {
    CLICK: 'click',
    MOUSEDOWN: 'mousedown',
    MOUSEUP: 'mouseup',
    MOUSEMOVE: 'mousemove'
};

for (var key in mouseEvents) {
    if (mouseEvents.hasOwnProperty(key)) {
        MouseEvent[key] = mouseEvents[key];
    }
}

MouseEvent.nameList = _Util2['default'].keys(mouseEvents);
module.exports = exports['default'];

},{"./InteractiveEvent":10,"./Util":27}],18:[function(require,module,exports){
Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _DisplayObject2 = require('./DisplayObject');

var _DisplayObject3 = _interopRequireDefault(_DisplayObject2);

var _Util = require('./Util');

var _Util2 = _interopRequireDefault(_Util);

var _Vec3 = require('./Vec3');

var _Vec32 = _interopRequireDefault(_Vec3);

var _Matrix3 = require('./Matrix3');

var _Matrix32 = _interopRequireDefault(_Matrix3);

var _Global = require('./Global');

var _Global2 = _interopRequireDefault(_Global);

var Shape = (function (_DisplayObject) {
    _inherits(Shape, _DisplayObject);

    function Shape() {
        _classCallCheck(this, Shape);

        _get(Object.getPrototypeOf(Shape.prototype), 'constructor', this).call(this);
        this.name = 'Shape';
        this._showList = [];
        this._setList = [];
    }

    _createClass(Shape, [{
        key: 'on',
        value: function on() {
            console.error('shape object can\'t interative event, please add shape to sprite'); // jshint ignore:line
        }
    }, {
        key: 'off',
        value: function off() {
            console.error('shape object can\'t interative event, please add shape to sprite'); // jshint ignore:line
        }
    }, {
        key: 'show',
        value: function show(matrix) {
            var _me = this;
            var showList = _me._showList;
            var isDrew = _get(Object.getPrototypeOf(Shape.prototype), 'show', this).call(this, matrix);

            if (isDrew) {
                for (var i = 0, len = showList.length; i < len; i += 1) {
                    var showListItem = showList[i];
                    if (typeof showListItem === 'function') {
                        showListItem();
                    }
                }

                if (_me._isSaved) {
                    var ctx = _me.ctx || _me.stage.ctx;
                    _me._isSaved = false;
                    ctx.restore();
                }
            }

            return isDrew;
        }
    }, {
        key: 'lineWidth',
        value: function lineWidth(thickness) {
            var _me = this;
            _me._showList.push(function () {
                var ctx = _me.ctx || _me.stage.ctx;
                ctx.lineWidth = thickness;
            });
        }
    }, {
        key: 'strokeStyle',
        value: function strokeStyle(color) {
            var _me = this;
            _me._showList.push(function () {
                var ctx = _me.ctx || _me.stage.ctx;
                ctx.strokeStyle = color;
            });
        }
    }, {
        key: 'stroke',
        value: function stroke() {
            var _me = this;
            _me._showList.push(function () {
                var ctx = _me.ctx || _me.stage.ctx;
                ctx.stroke();
            });
        }
    }, {
        key: 'beginPath',
        value: function beginPath() {
            var _me = this;
            _me._showList.push(function () {
                var ctx = _me.ctx || _me.stage.ctx;
                ctx.beginPath();
            });
        }
    }, {
        key: 'closePath',
        value: function closePath() {
            var _me = this;
            _me._showList.push(function () {
                var ctx = _me.ctx || _me.stage.ctx;
                ctx.closePath();
            });
        }
    }, {
        key: 'moveTo',
        value: function moveTo(x, y) {
            var _me = this;
            _me._showList.push(function () {
                var ctx = _me.ctx || _me.stage.ctx;
                ctx.moveTo(x, y);
            });
        }
    }, {
        key: 'lineTo',
        value: function lineTo(x, y) {
            var _me = this;
            _me._showList.push(function () {
                var ctx = _me.ctx || _me.stage.ctx;
                ctx.lineTo(x, y);
            });
        }
    }, {
        key: 'clear',
        value: function clear() {
            var _me = this;
            _me._showList = [];
            _me._setList = [];
        }
    }, {
        key: 'rect',
        value: function rect(x, y, width, height) {
            var _me = this;
            _me._showList.push(function () {
                var ctx = _me.ctx || _me.stage.ctx;
                ctx.rect(x, y, width, height);
            });

            _me._setList.push({
                type: 'rect',
                area: [x, y, width, height]
            });
        }
    }, {
        key: 'fillStyle',
        value: function fillStyle(color) {
            var _me = this;
            _me._showList.push(function () {
                var ctx = _me.ctx || _me.stage.ctx;
                ctx.fillStyle = color;
            });
        }
    }, {
        key: 'fill',
        value: function fill() {
            var _me = this;
            _me._showList.push(function () {
                var ctx = _me.ctx || _me.stage.ctx;
                ctx.fill();
            });
        }
    }, {
        key: 'arc',
        value: function arc(x, y, r, sAngle, eAngle, direct) {
            var _me = this;
            _me._showList.push(function () {
                var ctx = _me.ctx || _me.stage.ctx;
                ctx.arc(x, y, r, sAngle, eAngle, direct);
            });

            _me._setList.push({
                type: 'arc',
                area: [x, y, r, sAngle, eAngle, direct]
            });
        }
    }, {
        key: 'drawArc',
        value: function drawArc(thickness, lineColor, arcArgs, isFill, color) {
            var _me = this;
            _me._showList.push(function () {
                var ctx = _me.ctx || _me.stage.ctx;
                ctx.beginPath();
                ctx.arc(arcArgs[0], arcArgs[1], arcArgs[2], arcArgs[3], arcArgs[4], arcArgs[5]);

                if (isFill) {
                    ctx.fillStyle = color;
                    ctx.fill();
                }

                ctx.lineWidth = thickness;
                ctx.strokeStyle = lineColor;
                ctx.stroke();
            });

            _me._setList.push({
                type: 'arc',
                area: arcArgs
            });
        }
    }, {
        key: 'drawRect',
        value: function drawRect(thickness, lineColor, rectArgs, isFill, color) {
            var _me = this;

            _me._showList.push(function () {
                var ctx = _me.ctx || _me.stage.ctx;
                ctx.beginPath();
                ctx.rect(rectArgs[0], rectArgs[1], rectArgs[2], rectArgs[3]);

                if (isFill) {
                    ctx.fillStyle = color;
                    ctx.fill();
                }

                ctx.lineWidth = thickness;
                ctx.strokeStyle = lineColor;
                ctx.stroke();
            });

            _me._setList.push({
                type: 'rect',
                area: rectArgs
            });
        }
    }, {
        key: 'drawVertices',
        value: function drawVertices(thickness, lineColor, vertices, isFill, color) {
            var _me = this;
            var len = vertices.length;

            if (len < 3) {
                return;
            }

            _me._showList.push(function () {
                var ctx = _me.ctx || _me.stage.ctx;
                ctx.beginPath();
                ctx.moveTo(vertices[0][0], vertices[0][1]);

                for (var i = 1; i < len; i += 1) {
                    var pointArr = vertices[i];
                    ctx.lineTo(pointArr[0], pointArr[1]);
                }

                ctx.lineTo(vertices[0][0], vertices[0][1]);

                if (isFill) {
                    ctx.fillStyle = color;
                    ctx.fill();
                }

                ctx.lineWidth = thickness;
                ctx.strokeStyle = lineColor;
                ctx.closePath();
                ctx.stroke();
            });

            _me._setList.push({
                type: 'vertices',
                area: vertices
            });
        }
    }, {
        key: 'drawLine',
        value: function drawLine(thickness, lineColor, points) {
            var _me = this;

            _me._showList.push(function () {
                var ctx = _me.ctx || _me.stage.ctx;
                ctx.beginPath();
                ctx.moveTo(points[0], points[1]);
                ctx.lineTo(points[2], points[3]);
                ctx.lineWidth = thickness;
                ctx.strokeStyle = lineColor;
                ctx.closePath();
                ctx.stroke();
            });
        }
    }, {
        key: 'lineStyle',
        value: function lineStyle(thickness, color, alpha) {
            var _me = this;

            if (alpha) {
                _me.alpha = alpha;
            }

            _me._showList.push(function () {
                var ctx = _me.ctx || _me.stage.ctx;
                ctx.lineWidth = thickness;
                ctx.strokeStyle = color;
            });
        }
    }, {
        key: 'add',
        value: function add(fn) {
            var _me = this;
            _me._showList.push(function () {
                fn.call(_me);
            });
        }
    }, {
        key: 'isMouseOn',
        value: function isMouseOn(cord) {
            var _me = this;
            var vec = new _Vec32['default'](cord.x, cord.y, 1);
            var inverse = _Matrix32['default'].inverse(_me._matrix);
            vec.multiMatrix3(inverse);

            var setList = _me._setList;
            for (var i = 0, len = setList.length; i < len; i += 1) {
                var item = setList[i];
                var area = item.area; // jshint ignore:line
                var minRect = {}; // jshint ignore:line

                // jshint ignore:start
                switch (item.type) {
                    case 'rect':
                        area = [[area[0], area[1]], [area[0] + area[2], area[1]], [area[0] + area[2], area[1] + area[3]], [area[0], area[1] + area[3]]];
                    case 'vertices':
                        break;
                    case 'arc':
                        minRect = _me._computeArcMinRect.apply(_me, area);
                        area = [[minRect.s1v.x, minRect.s1v.y], [minRect.s2v.x, minRect.s2v.y], [minRect.e2v.x, minRect.e2v.y], [minRect.e1v.x, minRect.e1v.y]];
                        break;
                }
                // jshint ignore:end

                if (_Util2['default'].pip([vec.x, vec.y], area)) {
                    return true;
                }
            }

            return false;
        }
    }, {
        key: 'getBounds',
        value: function getBounds() {
            var _me = this;
            var setList = _me._setList;
            var sx = _Global2['default'].maxNumber;
            var ex = _Global2['default'].minNumber;
            var sy = _Global2['default'].maxNumber;
            var ey = _Global2['default'].minNumber;

            for (var i = 0, len = setList.length; i < len; i += 1) {
                var item = setList[i];
                var area = item.area; // jshint ignore:line
                var minRect = {}; // jshint ignore:line
                var vec3s = [];

                // jshint ignore:start
                switch (item.type) {
                    case 'rect':
                        area = [[area[0], area[1]], [area[0] + area[2], area[1]], [area[0] + area[2], area[1] + area[3]], [area[0], area[1] + area[3]]];
                    case 'vertices':
                        vec3s = _Util2['default'].map(area, function (item) {
                            var vec = new _Vec32['default'](item[0], item[1], 1);
                            return vec.multiMatrix3(_me._matrix);
                        });
                        break;
                    case 'arc':
                        minRect = _me._computeArcMinRect.apply(_me, area);
                        vec3s = _Util2['default'].map(minRect, function (item) {
                            return item.multiMatrix3(_me._matrix);
                        });
                        break;
                }
                // jshint ignore:end

                _Util2['default'].each(vec3s, function (item) {
                    sx = item.x < sx ? item.x : sx;
                    ex = item.x > ex ? item.x : ex;
                    sy = item.y < sy ? item.y : sy;
                    ey = item.y > ey ? item.y : ey;
                });
            }

            if (sx === _Global2['default'].maxNumber || ex === _Global2['default'].minNumber || sy === _Global2['default'].maxNumber || ey === _Global2['default'].minNumber) {
                sx = sy = ex = ey = 0;
            }

            return {
                sv: new _Vec32['default'](sx, sy, 1),
                ev: new _Vec32['default'](ex, ey, 1)
            };
        }
    }, {
        key: '_computeArcMinRect',
        value: function _computeArcMinRect(ox, oy, r, sAngle, eAngle, direct) {
            var sx = 0;
            var sy = 0;
            var ex = 0;
            var ey = 0;

            sAngle = _Util2['default'].rad2deg(sAngle);
            eAngle = _Util2['default'].rad2deg(eAngle);

            if (Math.abs(eAngle - sAngle) / 360 >= 1) {
                return {
                    s1v: new _Vec32['default'](ox - r, oy - r, 1),
                    s2v: new _Vec32['default'](ox + r, oy - r, 1),
                    e1v: new _Vec32['default'](ox - r, oy + r, 1),
                    e2v: new _Vec32['default'](ox + r, oy + r, 1)
                };
            }

            sAngle = sAngle - Math.floor(sAngle / 360) * 360;
            eAngle = eAngle - Math.floor(eAngle / 360) * 360;

            if (direct) {
                var _ref = [eAngle, sAngle];
                sAngle = _ref[0];
                eAngle = _ref[1];
            }

            var rotateAngle = 0;
            if (sAngle < 180 && sAngle >= 90) {
                rotateAngle = 90;
            } else if (sAngle < 270 && sAngle >= 180) {
                rotateAngle = 180;
            } else if (sAngle < 360 && sAngle >= 270) {
                rotateAngle = 270;
            }

            sAngle -= rotateAngle;
            eAngle -= rotateAngle;
            sAngle = sAngle < 0 ? sAngle + 360 : sAngle;
            eAngle = eAngle < 0 ? eAngle + 360 : eAngle;

            var sin = Math.sin;
            var cos = Math.cos;
            var v1 = _Vec32['default'].zero();
            var v2 = _Vec32['default'].zero();

            if (eAngle < 90 && eAngle > sAngle) {
                var o1 = _Util2['default'].deg2rad(sAngle);
                var o2 = _Util2['default'].deg2rad(eAngle);
                v1 = new _Vec32['default'](cos(o2) * r, sin(o1) * r, 1);
                v2 = new _Vec32['default'](cos(o1) * r, sin(o2) * r, 1);
            } else if (eAngle < 90 && eAngle < sAngle) {
                v1 = new _Vec32['default'](-r, -r, 1);
                v2 = new _Vec32['default'](r, r, 1);
            } else if (eAngle < 180 && eAngle >= 90) {
                var o = _Util2['default'].deg2rad(Math.min(180 - eAngle, sAngle));
                var o1 = _Util2['default'].deg2rad(sAngle);
                var o2 = _Util2['default'].deg2rad(180 - eAngle);
                v1 = new _Vec32['default'](-cos(o2) * r, sin(o) * r, 1);
                v2 = new _Vec32['default'](cos(o1) * r, r, 1);
            } else if (eAngle < 270 && eAngle >= 180) {
                var o1 = _Util2['default'].deg2rad(sAngle);
                var o2 = _Util2['default'].deg2rad(eAngle - 180);
                v1 = new _Vec32['default'](-r, -sin(o2) * r, 1);
                v2 = new _Vec32['default'](cos(o1) * r, r, 1);
            } else if (eAngle < 360 && eAngle >= 270) {
                var o = _Util2['default'].deg2rad(Math.min(360 - eAngle, sAngle));
                v1 = new _Vec32['default'](-r, -r, 1);
                v2 = new _Vec32['default'](cos(o) * r, r, 1);
            }

            var translateMat = _Matrix32['default'].translation(ox, oy);
            var rotateMat = _Matrix32['default'].rotation(rotateAngle);
            var mat = translateMat.multi(rotateMat);

            v1.multiMatrix3(mat);
            v2.multiMatrix3(mat);

            if (v1.x < v2.x) {
                sx = v1.x;
                ex = v2.x;
            } else {
                sx = v2.x;
                ex = v1.x;
            }

            if (v1.y < v2.y) {
                sy = v1.y;
                ey = v2.y;
            } else {
                sy = v2.y;
                ey = v1.y;
            }

            return {
                s1v: new _Vec32['default'](sx, sy, 1),
                s2v: new _Vec32['default'](ex, sy, 1),
                e1v: new _Vec32['default'](sx, ey, 1),
                e2v: new _Vec32['default'](ex, ey, 1)
            };
        }
    }, {
        key: 'width',
        get: function get() {
            var _me = this;
            var bounds = _me.getBounds();
            return Math.abs(bounds.ev.x - bounds.sv.x);
        }
    }, {
        key: 'height',
        get: function get() {
            var _me = this;
            var bounds = _me.getBounds();
            return Math.abs(bounds.ev.y - bounds.sv.y);
        }
    }]);

    return Shape;
})(_DisplayObject3['default']);

exports['default'] = Shape;
module.exports = exports['default'];

},{"./DisplayObject":4,"./Global":9,"./Matrix3":16,"./Util":27,"./Vec3":28}],19:[function(require,module,exports){
Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _DisplayObjectContainer2 = require('./DisplayObjectContainer');

var _DisplayObjectContainer3 = _interopRequireDefault(_DisplayObjectContainer2);

var _DisplayObject = require('./DisplayObject');

var _DisplayObject2 = _interopRequireDefault(_DisplayObject);

var _Shape = require('./Shape');

var _Shape2 = _interopRequireDefault(_Shape);

var Sprite = (function (_DisplayObjectContainer) {
    _inherits(Sprite, _DisplayObjectContainer);

    function Sprite() {
        _classCallCheck(this, Sprite);

        _get(Object.getPrototypeOf(Sprite.prototype), 'constructor', this).call(this);
        this.name = 'Sprite';
        this.graphics = null;
    }

    _createClass(Sprite, [{
        key: 'addChild',
        value: function addChild(child) {
            if (child instanceof _Shape2['default']) {
                console.error('shape object should be linked to Sprite\'s graphics property'); // jshint ignore:line
            } else {
                    _get(Object.getPrototypeOf(Sprite.prototype), 'addChild', this).call(this, child);
                }
        }
    }, {
        key: 'removeChild',
        value: function removeChild(child) {
            if (child instanceof _Shape2['default']) {
                console.error('shape object should be linked to Sprite\'s graphics property'); // jshint ignore:line
            } else {
                    _get(Object.getPrototypeOf(Sprite.prototype), 'removeChild', this).call(this, child);
                }
        }
    }, {
        key: 'show',
        value: function show(matrix) {
            var isDrew = _get(Object.getPrototypeOf(Sprite.prototype), 'show', this).call(this, matrix);
            if (!isDrew) {
                return isDrew;
            }

            var _me = this;
            if (_me.graphics && _me.graphics.show) {
                _DisplayObject2['default'].prototype.show.call(_me, matrix);
                _me.graphics.show(_me._matrix);
            }

            if (_me._isSaved) {
                var ctx = _me.ctx || _me.stage.ctx;
                _me._isSaved = false;
                ctx.restore();
            }

            return isDrew;
        }
    }, {
        key: 'isMouseOn',
        value: function isMouseOn(cord) {
            var _me = this;
            var isMouseOn = _get(Object.getPrototypeOf(Sprite.prototype), 'isMouseOn', this).call(this, cord);

            if (!isMouseOn && _me.graphics && _me.graphics instanceof _Shape2['default']) {
                isMouseOn = _me.graphics.isMouseOn && _me.graphics.isMouseOn(cord);
            }

            return isMouseOn;
        }
    }, {
        key: 'width',
        get: function get() {
            var _me = this;
            var bounds = _get(Object.getPrototypeOf(Sprite.prototype), 'getBounds', this).call(this);
            var shapeBounds = null;

            if (_me.graphics instanceof _Shape2['default']) {
                shapeBounds = _me.graphics.getBounds();
            }

            if (shapeBounds) {
                bounds.sv.x = bounds.sv.x < shapeBounds.sv.x ? bounds.sv.x : shapeBounds.sv.x;
                bounds.ev.x = bounds.ev.x > shapeBounds.ev.x ? bounds.ev.x : shapeBounds.ev.x;
            }

            return Math.abs(bounds.ev.x - bounds.sv.x);
        }
    }, {
        key: 'height',
        get: function get() {
            var _me = this;
            var bounds = _get(Object.getPrototypeOf(Sprite.prototype), 'getBounds', this).call(this);
            var shapeBounds = null;

            if (_me.graphics instanceof _Shape2['default']) {
                shapeBounds = _me.graphics.getBounds();
            }

            if (shapeBounds) {
                bounds.sv.y = bounds.sv.y < shapeBounds.sv.y ? bounds.sv.y : shapeBounds.sv.y;
                bounds.ev.y = bounds.ev.y > shapeBounds.ev.y ? bounds.ev.y : shapeBounds.ev.y;
            }

            return Math.abs(bounds.ev.y - bounds.sv.y);
        }
    }]);

    return Sprite;
})(_DisplayObjectContainer3['default']);

exports['default'] = Sprite;
module.exports = exports['default'];

},{"./DisplayObject":4,"./DisplayObjectContainer":5,"./Shape":18}],20:[function(require,module,exports){
Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _DisplayObjectContainer2 = require('./DisplayObjectContainer');

var _DisplayObjectContainer3 = _interopRequireDefault(_DisplayObjectContainer2);

var _Util = require('./Util');

var _Util2 = _interopRequireDefault(_Util);

var _EventDispatcher = require('./EventDispatcher');

var _EventDispatcher2 = _interopRequireDefault(_EventDispatcher);

var _Timer = require('./Timer');

var _Timer2 = _interopRequireDefault(_Timer);

var _KeyboardEvent = require('./KeyboardEvent');

var _KeyboardEvent2 = _interopRequireDefault(_KeyboardEvent);

var _MouseEvent = require('./MouseEvent');

var _MouseEvent2 = _interopRequireDefault(_MouseEvent);

var _Sprite = require('./Sprite');

var _Sprite2 = _interopRequireDefault(_Sprite);

var _Vec3 = require('./Vec3');

var _Vec32 = _interopRequireDefault(_Vec3);

var Stage = (function (_DisplayObjectContainer) {
    _inherits(Stage, _DisplayObjectContainer);

    function Stage(canvasId, fn) {
        _classCallCheck(this, Stage);

        _get(Object.getPrototypeOf(Stage.prototype), 'constructor', this).call(this);

        this.name = 'Stage';
        this.domElem = document.getElementById(canvasId);
        this._width = parseFloat(this.domElem.getAttribute('width'), 10);
        this._height = parseFloat(this.domElem.getAttribute('height'), 10);
        this.ctx = this.domElem.getContext('2d');

        var offset = this._getOffset();
        this.x = offset.left;
        this.y = offset.top;

        this._initialize();

        if (typeof fn === 'function') {
            fn(this);
        }
    }

    _createClass(Stage, [{
        key: '_initialize',
        value: function _initialize() {
            var _me = this;

            _Util2['default'].each(_MouseEvent2['default'].nameList, function (eventName) {
                eventName = _MouseEvent2['default'][eventName];
                _EventDispatcher2['default'].prototype.on.call(_me, _me.domElem, eventName, function (event) {
                    _me._mouseEvent(event);
                }, false);
            });

            _Util2['default'].each(_KeyboardEvent2['default'].nameList, function (eventName) {
                eventName = _KeyboardEvent2['default'][eventName];
                _EventDispatcher2['default'].prototype.on.call(_me, document, eventName, function (event) {
                    _me._keyboardEvent(event);
                });
            }, false);

            _me.show(_me._matrix);

            _Timer2['default'].add(_me);
            _Timer2['default'].start();
        }
    }, {
        key: 'show',
        value: function show(matrix) {
            var _me = this;
            _me.ctx.clearRect(0, 0, _me._width, _me._height);
            _get(Object.getPrototypeOf(Stage.prototype), 'show', this).call(this, matrix);
        }
    }, {
        key: 'dispose',
        value: function dispose() {}
    }, {
        key: 'tick',
        value: function tick() {
            this.show(this._matrix);
        }
    }, {
        key: 'addChild',
        value: function addChild(child) {
            var _me = this;
            var addStage = function addStage(child) {
                child.stage = _me;

                if (child instanceof _Sprite2['default'] && child.graphics) {
                    child.graphics.stage = _me;
                    child.graphics.parent = child;
                    child.graphics.objectIndex = child.objectIndex + '.0';
                }
            };

            addStage(child);

            if (child.getAllChild) {
                var childs = child.getAllChild();
                _Util2['default'].each(childs, function (item) {
                    addStage(item);
                });
            }

            _get(Object.getPrototypeOf(Stage.prototype), 'addChild', this).call(this, child);
        }
    }, {
        key: 'isMouseOn',
        value: function isMouseOn() {
            return true;
        }
    }, {
        key: 'getBounds',
        value: function getBounds() {
            return {
                sv: new _Vec32['default'](0, 0, 1),
                ev: new _Vec32['default'](this.width, this.height, 1)
            };
        }
    }, {
        key: '_mouseEvent',
        value: function _mouseEvent(event) {
            var _me = this;
            var cord = {
                x: 0,
                y: 0
            };

            if (event.clientX !== null) {
                cord.x = event.pageX - _me.x;
                cord.y = event.pageY - _me.y;
            }

            event.cord = cord;

            var eventName = event.type;
            var item = _MouseEvent2['default'].getTopItem(eventName, cord);
            if (item) {
                item.trigger(eventName, event);
            }
        }
    }, {
        key: '_keyboardEvent',
        value: function _keyboardEvent(event) {
            var eventName = event.type;
            var items = _KeyboardEvent2['default'].getItems(eventName);

            if (items.length) {
                _Util2['default'].each(items, function (item) {
                    item.trigger(eventName, event);
                });
            }
        }
    }, {
        key: '_getOffset',
        value: function _getOffset() {
            return {
                top: 0,
                left: 0
            };
        }
    }, {
        key: 'width',
        get: function get() {
            return this._width;
        }
    }, {
        key: 'height',
        get: function get() {
            return this._height;
        }
    }]);

    return Stage;
})(_DisplayObjectContainer3['default']);

exports['default'] = Stage;
module.exports = exports['default'];

},{"./DisplayObjectContainer":5,"./EventDispatcher":8,"./KeyboardEvent":12,"./MouseEvent":17,"./Sprite":19,"./Timer":23,"./Util":27,"./Vec3":28}],21:[function(require,module,exports){
Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ('value' in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _InteractiveObject2 = require('./InteractiveObject');

var _InteractiveObject3 = _interopRequireDefault(_InteractiveObject2);

var _TextFieldEvent = require('./TextFieldEvent');

var _TextFieldEvent2 = _interopRequireDefault(_TextFieldEvent);

var _MouseEvent = require('./MouseEvent');

var _MouseEvent2 = _interopRequireDefault(_MouseEvent);

var _EventDispatcher = require('./EventDispatcher');

var _EventDispatcher2 = _interopRequireDefault(_EventDispatcher);

var _Event = require('./Event');

var _Event2 = _interopRequireDefault(_Event);

var TextField = (function (_InteractiveObject) {
    _inherits(TextField, _InteractiveObject);

    function TextField() {
        _classCallCheck(this, TextField);

        _get(Object.getPrototypeOf(TextField.prototype), 'constructor', this).call(this);
        this.name = 'TextField';
        this._input = this._createInputElement();
        this._color = 0x000000;
        this._textAlign = 'left';
        this._text = '';
        this._textBaseline = 'middle';
        this._font = 'arial';
        this._size = 12;
        this._wordWrap = false;
        this._fontHeight = 0;
        this._areas = [];
        this._bindEvents();
    }

    _createClass(TextField, [{
        key: 'show',
        value: function show(matrix) {
            var isDrew = _get(Object.getPrototypeOf(TextField.prototype), 'show', this).call(this, matrix);
            if (!isDrew) {
                return isDrew;
            }

            var _me = this;
            var ctx = _me.ctx || _me.stage.ctx;

            ctx.strokeStyle = _me._color;
            ctx.font = _me._size + 'px ' + _me._font;
            ctx.textAlign = _me._textAlign;
            ctx.textBaseline = _me._textBaseline;

            ctx.restore();

            return isDrew;
        }
    }, {
        key: 'isMouseOn',
        value: function isMouseOn() {}
    }, {
        key: 'getBounds',
        value: function getBounds() {}
    }, {
        key: 'dispose',
        value: function dispose() {}
    }, {
        key: '_bindEvents',
        value: function _bindEvents() {
            var _me = this;
            var DispatcherProtoOnMethod = _EventDispatcher2['default'].prototype.on;

            _me.on(_MouseEvent2['default'].CLICK, function () {});

            DispatcherProtoOnMethod.call(_me._input, _TextFieldEvent2['default'].BLUR, function () {}, false);

            DispatcherProtoOnMethod.call(_me._input, _TextFieldEvent2['default'].CHANGE, function () {}, false);

            _me.on(_Event2['default'].ADD_TO_STAGE, function () {
                _me._compute();
            });
        }
    }, {
        key: '_createInputElement',
        value: function _createInputElement() {
            var _me = this;
            var $input = document.createElement('INPUT');

            $input.style.font = _me.size + 'px ' + _me.font;
            $input.style.width = '0px';
            $input.style.height = '0px';
            $input.style.position = 'absolute';
            $input.style.top = '0px';
            $input.style.left = '0px';
            $input.style.display = 'none';

            document.body.appendChild($input);

            return $input;
        }
    }, {
        key: '_compute',
        value: function _compute() {
            var _me = this;
            _me._fontHeight = _me._computeFontHeight();
            if (_me._wordWrap) {
                _me._areas = _me._computeAreas();
            } else {
                _me._areas = [];
            }
        }
    }, {
        key: '_computeFontHeight',
        value: function _computeFontHeight() {
            var _me = this;
            var $span = document.createElement('span');
            $span.innerHTML = 'Hg';
            $span.style.font = _me.size + 'px ' + _me.font;

            var $block = document.createElement('div');
            $block.style.display = 'inline-block';
            $block.style.width = '1px';
            $block.style.height = '0px';

            var $container = document.createElement('div');
            $container.appendChild($span);
            $container.appendChild($block);

            document.body.appendChild($container);

            var height = -1;
            try {
                $block.style.verticalAlign = 'bottom';
                height = $block.offsetTop - $span.offsetTop;
            } finally {
                document.body.removeChild($container);
            }

            return height;
        }
    }, {
        key: '_computeAreas',
        value: function _computeAreas() {
            var _me = this;
            var cache = {};
            var ctx = _me.ctx || _me.stage.ctx;
            var text = _me._text;
            var tWidth = _me._width;
            var count = 0;
            var areas = [];

            for (var i = 0, len = text.length; i < len; i += 1) {
                var char = text.charAt(i);
                var width = 0;

                if (char === '\n') {
                    count = 0;
                    areas.push(i);
                    continue;
                }

                if (cache[char]) {
                    width = cache[char];
                } else {
                    width = ctx.measureText(char).width;
                }

                count += width;
                if (count >= tWidth) {
                    count = 0;
                    areas.push(i);
                }
            }

            return areas;
        }
    }, {
        key: 'color',
        get: function get() {
            return this._color;
        },
        set: function set(color) {
            var _me = this;
            _me._color = color;
            _me._input.style.color = color;
        }
    }, {
        key: 'textAlign',
        get: function get() {
            return this._textAlign;
        },
        set: function set(textAlign) {
            var _me = this;
            _me._textAlign = textAlign;
            _me._input.style.textAlign = textAlign;
        }
    }, {
        key: 'textBaseline',
        get: function get() {
            return this._textBaseline;
        },
        set: function set(textBaseline) {
            var _me = this;
            _me._textBaseline = textBaseline;
            _me._input.style.verticalAlign = textBaseline;
        }
    }, {
        key: 'size',
        get: function get() {
            return this._size;
        },
        set: function set(size) {
            var _me = this;
            _me._size = size;
            _me._input.style.font = size + 'px ' + _me._font;
            if (_me._addedToStage) {
                _me._compute();
            }
        }
    }, {
        key: 'font',
        get: function get() {
            return this._font;
        },
        set: function set(font) {
            var _me = this;
            _me._font = font;
            _me._input.style.font = _me.size + 'px ' + font;
            if (_me._addedToStage) {
                _me._compute();
            }
        }
    }, {
        key: 'wordWrap',
        get: function get() {
            return this._wordWrap;
        },
        set: function set(wordWrap) {
            var _me = this;
            _me._wordWrap = wordWrap;
            if (_me._addedToStage) {
                _me._compute();
            }
        }
    }, {
        key: 'text',
        get: function get() {
            return this._text;
        },
        set: function set(text) {
            var _me = this;
            _me._text = text.replace('\r\n', '\n');
            if (_me._addedToStage) {
                _me._compute();
            }
        }

        // jshint ignore: start

    }, {
        key: 'width',
        set: function set(width) {
            this._width = width;
            this._input.style.width = width + 'px';
        }
    }, {
        key: 'height',
        set: function set(height) {
            this._height = height;
            this._input.style.height = height + 'px';
        }
    }, {
        key: 'rotate',
        set: function set(rotate) {
            _set(Object.getPrototypeOf(TextField.prototype), 'rotate', rotate, this);
            if (rotate % 360 !== 0) {
                this.visible = false;
            }
        }

        // jshint ignore: end

    }]);

    return TextField;
})(_InteractiveObject3['default']);

exports['default'] = TextField;
module.exports = exports['default'];

},{"./Event":7,"./EventDispatcher":8,"./InteractiveObject":11,"./MouseEvent":17,"./TextFieldEvent":22}],22:[function(require,module,exports){
Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = {
    'FOCUS': 'focus',
    'BLUR': 'blur',
    'CHANGE': 'change'
};
module.exports = exports['default'];

},{}],23:[function(require,module,exports){
Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Util = require('./Util');

var _Util2 = _interopRequireDefault(_Util);

var Timer = (function () {
    function Timer() {
        _classCallCheck(this, Timer);
    }

    _createClass(Timer, null, [{
        key: 'add',
        value: function add(timerObject) {
            var _me = this;
            var index = _Util2['default'].inArray(timerObject, _me._list, function (obj, item) {
                return obj.aIndex === item.aIndex;
            });

            if (index === -1) {
                _me._list.push(timerObject);
            }

            return _me;
        }
    }, {
        key: 'remove',
        value: function remove(timerObject) {
            var _me = this;
            var index = _Util2['default'].inArray(timerObject, _me._list, function (obj, item) {
                return obj.aIndex === item.aIndex;
            });

            if (index !== -1) {
                _me._list.splice(index, 1);
            }

            return _me;
        }
    }, {
        key: 'start',
        value: function start() {
            var _me = this;
            _me.isStoped = false;

            if (!_me._isInit) {
                _me._init();
            }

            _me._raf();

            return _me;
        }
    }, {
        key: 'stop',
        value: function stop() {
            var _me = this;
            _me.isStoped = true;

            if (!_me._isInit) {
                _me._init();
            }

            _me._craf();

            return _me;
        }
    }, {
        key: '_init',
        value: function _init() {
            var _me = this;
            var lastTime = 0;
            var vendors = ['webkit', 'moz'];
            var requestAnimationFrame = window.requestAnimationFrame;
            var cancelAnimationFrame = window.cancelAnimationFrame;
            var i = vendors.length - 1;

            while (i >= 0 && !requestAnimationFrame) {
                requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
                cancelAnimationFrame = window[vendors[i] + 'CancelAnimationFrame'];
                i -= 1;
            }

            if (!requestAnimationFrame || !cancelAnimationFrame) {
                requestAnimationFrame = function (callback) {
                    var now = +new Date(),
                        nextTime = Math.max(lastTime + 16, now);
                    return setTimeout(function () {
                        callback(lastTime = nextTime);
                    }, nextTime - now);
                };

                cancelAnimationFrame = clearTimeout;
            }

            _me._requestAnimationFrame = requestAnimationFrame;
            _me._cancelAnimationFrame = cancelAnimationFrame;
            _me._isInit = true;
        }
    }, {
        key: '_raf',
        value: function _raf() {
            this._timer = this._requestAnimationFrame.call(window, this._callback.bind(this));
        }
    }, {
        key: '_craf',
        value: function _craf() {
            this._cancelAnimationFrame.call(window, this._timer);
        }
    }, {
        key: '_callback',
        value: function _callback() {
            var _me = this;
            var list = _me._list;
            for (var i = 0, len = list.length; i < len; i += 1) {
                var item = list[i];
                if (item.tick) {
                    item.tick();
                }
            }
            _me._raf();
        }
    }, {
        key: 'isStoped',
        get: function get() {
            return this._isStoped;
        },
        set: function set(isStoped) {
            this._isStoped = isStoped;
        }
    }, {
        key: '_list',
        get: function get() {
            this._list_ = this._list_ || [];
            return this._list_;
        },
        set: function set(list) {
            this._list_ = list;
        }
    }, {
        key: '_isInit',
        get: function get() {
            return this._isInit_ || false;
        },
        set: function set(isInit) {
            this._isInit_ = isInit;
        }
    }, {
        key: '_timer',
        get: function get() {
            return this._timer_;
        },
        set: function set(timer) {
            this._timer_ = timer;
        }
    }, {
        key: '_requestAnimationFrame',
        get: function get() {
            return this._requestAnimationFrame_;
        },
        set: function set(requestAnimationFrame) {
            this._requestAnimationFrame_ = requestAnimationFrame;
        }
    }, {
        key: '_cancelAnimationFrame',
        get: function get() {
            return this._cancelAnimationFrame_;
        },
        set: function set(cancelAnimationFrame) {
            this._cancelAnimationFrame_ = cancelAnimationFrame;
        }
    }]);

    return Timer;
})();

exports['default'] = Timer;
module.exports = exports['default'];

},{"./Util":27}],24:[function(require,module,exports){
Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _EventDispatcher2 = require('./EventDispatcher');

var _EventDispatcher3 = _interopRequireDefault(_EventDispatcher2);

var _Util = require('./Util');

var _Util2 = _interopRequireDefault(_Util);

var _URLLoaderEvent = require('./URLLoaderEvent');

var _URLLoaderEvent2 = _interopRequireDefault(_URLLoaderEvent);

var URLLoader = (function (_EventDispatcher) {
    _inherits(URLLoader, _EventDispatcher);

    function URLLoader(request) {
        _classCallCheck(this, URLLoader);

        _get(Object.getPrototypeOf(URLLoader.prototype), 'constructor', this).call(this);
        this._request = request;
        this._close = false;
        this._loading = false;
        this._queue = [];
    }

    _createClass(URLLoader, [{
        key: 'on',
        value: function on(eventName, callback) {
            _get(Object.getPrototypeOf(URLLoader.prototype), 'on', this).apply(this, [this, eventName, callback, false]);
        }
    }, {
        key: 'off',
        value: function off(eventName, callback) {
            _get(Object.getPrototypeOf(URLLoader.prototype), 'off', this).apply(this, [this, eventName, callback]);
        }
    }, {
        key: 'load',
        value: function load(request) {
            var _me = this;
            var xhr = false;
            var params = [];
            request = request || _me._request;
            request.method = request.method.toUpperCase();

            if (request === null) {
                console.error('URLLoader need URLRequest instance'); // jshint ignore:line
                return xhr;
            }

            if (_me._loading) {
                _me._queue.push(request);
                return xhr;
            }

            // jshint ignore:start
            try {
                xhr = new XMLHttpRequest();
            } catch (e) {
                try {
                    xhr = new ActiveXObject('Msxml2.XMLHTTP');
                } catch (e) {
                    try {
                        xhr = new ActiveXObject('Microsoft.XMLHTTP');
                    } catch (failed) {
                        xhr = false;
                    }
                }
            }
            // jshint ignore:end

            if (xhr === false) {
                console.error('xhr cant be init'); // jshint ignore:line
                return xhr;
            }

            _me._xhr = xhr;

            var url = request.url;
            var data = request.data;
            var keys = _Util2['default'].keys(request.data);
            if (keys.length) {
                params = _Util2['default'].map(request.data, function (val, key) {
                    return key + '=' + encodeURIComponent(val);
                });
                data = params.join('&');
            }

            if (request.method === 'GET') {
                if (keys.length) {
                    url += '?' + data;
                }
                data = null;
            }

            xhr.open(request.method, url, true);
            xhr.onreadystatechange = function () {
                _me._onreadystatechange();
            };

            if (request.contentType) {
                request.requestHeaders['Content-Type'] = request.contentType;
            }

            _Util2['default'].each(request.requestHeaders, function (val, key) {
                xhr.setRequestHeader(key, val);
            });

            xhr.send(data);
            _me._loading = true;
        }
    }, {
        key: 'close',
        value: function close() {
            this._close = true;
        }
    }, {
        key: '_onreadystatechange',
        value: function _onreadystatechange() {
            var _me = this;
            var xhr = _me._xhr;
            var eventName = '';

            if (xhr.readyState === 4) {
                if (!_me._close) {
                    if (xhr.status === 200) {
                        eventName = _URLLoaderEvent2['default'].COMPLETE;
                    } else {
                        eventName = _URLLoaderEvent2['default'].ERROR;
                    }
                    _me.trigger(_me, eventName, {
                        data: xhr.responseText,
                        status: xhr.status
                    });
                }

                _me._close = false;
                _me._loading = false;
                _me._next();
            }
        }
    }, {
        key: '_next',
        value: function _next() {
            var _me = this;
            if (_me._queue.length) {
                _me.load(_me._queue.shift());
            }
        }
    }]);

    return URLLoader;
})(_EventDispatcher3['default']);

exports['default'] = URLLoader;
module.exports = exports['default'];

},{"./EventDispatcher":8,"./URLLoaderEvent":25,"./Util":27}],25:[function(require,module,exports){
Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = {
    COMPLETE: 'complete',
    ERROR: 'error'
};
module.exports = exports['default'];

},{}],26:[function(require,module,exports){
Object.defineProperty(exports, '__esModule', {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var URLRequest = function URLRequest(url) {
    _classCallCheck(this, URLRequest);

    this.url = url || '';
    this.data = {};
    this.method = 'GET';
    this.requestHeaders = {};
    this.contentType = '';
};

exports['default'] = URLRequest;
module.exports = exports['default'];

},{}],27:[function(require,module,exports){
Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Util = (function () {
    function Util() {
        _classCallCheck(this, Util);
    }

    _createClass(Util, null, [{
        key: 'isType',
        value: function isType(target, type) {
            return Object.prototype.toString.call(target) === '[object ' + type + ']';
        }
    }, {
        key: 'each',
        value: function each(arr, callback) {
            var _me = this;

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
    }, {
        key: 'filter',
        value: function filter(arr, callback) {
            var _me = this;

            if (_me.isType(arr, 'Array') && Array.prototype.filter) {
                return Array.prototype.filter.call(arr, callback);
            } else {
                var _ret = (function () {
                    var tmp = [];
                    _me.each(arr, function (item, index, arr) {
                        if (callback.call(arr, item, index, arr) === true) {
                            tmp.push(item);
                        }
                    });
                    return {
                        v: tmp
                    };
                })();

                if (typeof _ret === 'object') return _ret.v;
            }
        }
    }, {
        key: 'map',
        value: function map(arr, callback) {
            var _me = this;

            if (_me.isType(arr, 'Array') && Array.prototype.map) {
                return Array.prototype.map.call(arr, callback);
            } else {
                var _ret2 = (function () {
                    var tmp = [];
                    _me.each(arr, function (item, index, arr) {
                        tmp.push(callback.call(arr, item, index, arr));
                    });
                    return {
                        v: tmp
                    };
                })();

                if (typeof _ret2 === 'object') return _ret2.v;
            }
        }
    }, {
        key: 'some',
        value: function some(arr, callback) {
            var _me = this;

            if (_me.isType(arr, 'Array') && Array.prototype.some) {
                return Array.prototype.some.call(arr, callback);
            } else {
                var bol = false;
                _me.each(arr, function (item, index, arr) {
                    if (callback.call(arr, item, index, arr) === true) {
                        bol = true;
                    }
                });
                return bol;
            }
        }
    }, {
        key: 'every',
        value: function every(arr, callback) {
            var _me = this;

            if (_me.isType(arr, 'Array') && Array.prototype.some) {
                return Array.prototype.some.call(arr, callback);
            } else {
                var bol = true;
                _me.each(arr, function (item, index, arr) {
                    if (!callback.call(arr, item, index, arr)) {
                        bol = false;
                    }
                });
                return bol;
            }
        }
    }, {
        key: 'deg2rad',
        value: function deg2rad(deg) {
            return deg * Math.PI / 180;
        }
    }, {
        key: 'rad2deg',
        value: function rad2deg(rad) {
            return rad / Math.PI * 180;
        }
    }, {
        key: 'keys',
        value: function keys(obj) {
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
    }, {
        key: 'inArray',
        value: function inArray(item, arr, fn) {
            for (var i = 0, len = arr.length; i < len; i += 1) {
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
    }, {
        key: 'extends',
        value: function _extends(obj) {
            var _me = this;

            if (!_me.isType(obj, 'Object')) {
                return obj;
            }

            for (var i = 1, _length = arguments.length; i < _length; i += 1) {
                var source = arguments[i];
                for (var prop in source) {
                    if (source.hasOwnProperty(prop)) {
                        obj[prop] = source[prop];
                    }
                }
            }

            return obj;
        }
    }, {
        key: 'toArray',
        value: function toArray(argv) {
            if (argv && argv.length && argv[0]) {
                return Array.prototype.slice.call(argv, 0, argv.length);
            } else {
                return [];
            }
        }
    }, {
        key: 'clone',
        value: function clone(obj) {
            var _me = this;

            if (typeof obj !== 'object') {
                return obj;
            }

            return _me.isType(obj, 'Array') ? Array.prototype.slice.call(obj) : _me['extends']({}, obj);
        }

        // ray-casting algorithm
        // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    }, {
        key: 'pip',
        value: function pip(point, vs) {
            var isInside = false;
            var x = point[0],
                y = point[1];

            for (var i = 0, j = vs.length - 1; i < vs.length; j = i, i += 1) {
                var xi = vs[i][0],
                    yi = vs[i][1];
                var xj = vs[j][0],
                    yj = vs[j][1];

                var intersect = yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
                if (intersect) {
                    isInside = !isInside;
                }
            }

            return isInside;
        }
    }]);

    return Util;
})();

exports['default'] = Util;
module.exports = exports['default'];

},{}],28:[function(require,module,exports){
Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Vec3 = (function () {
    function Vec3(x, y, z) {
        _classCallCheck(this, Vec3);

        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    _createClass(Vec3, [{
        key: 'distance',
        value: function distance() {
            var x = this.x;
            var y = this.y;
            var z = this.z;

            return Math.sqrt(x * x + y * y + z * z);
        }
    }, {
        key: 'multi',
        value: function multi(k) {
            if (k instanceof Vec3) {
                var x = k.x;
                var y = k.y;
                var z = k.z;

                return this.x * x + this.y * y + this.z * z;
            } else {
                this.x *= k;
                this.y *= k;
                this.z *= k;
            }

            return this;
        }
    }, {
        key: 'divi',
        value: function divi(k) {
            if (k instanceof Vec3) {
                var x = k.x;
                var y = k.y;
                var z = k.z;

                return this.x / x + this.y / y + this.z / z;
            } else {
                this.x /= k;
                this.y /= k;
                this.z /= k;
            }

            return this;
        }
    }, {
        key: 'add',
        value: function add(vec3) {
            this.x += vec3.x;
            this.y += vec3.y;
            this.z += vec3.z;
            return this;
        }
    }, {
        key: 'sub',
        value: function sub(vec3) {
            var clone = Vec3.clone(vec3);
            clone.multi(-1);
            this.add(clone);
            return this;
        }
    }, {
        key: 'multiMatrix3',
        value: function multiMatrix3(m) {
            var matrix = m.getMatrix();
            var x = this.x;
            var y = this.y;
            var z = this.z;

            this.x = x * matrix[0] + y * matrix[3] + z * matrix[6];
            this.y = x * matrix[1] + y * matrix[4] + z * matrix[7];
            this.z = x * matrix[2] + y * matrix[5] + z * matrix[8];
            return this;
        }
    }], [{
        key: 'zero',
        value: function zero() {
            return new Vec3(0, 0, 0);
        }
    }, {
        key: 'clone',
        value: function clone(vec3) {
            return new Vec3(vec3.x, vec3.y, vec3.z);
        }
    }, {
        key: 'angle',
        value: function angle(v1, v2) {
            var c1 = Vec3.clone(v1);
            var c2 = Vec3.clone(v2);
            var rad = c1.multi(c2) / (v1.distance() * v2.distance());
            return Math.acos(rad);
        }
    }, {
        key: 'equal',
        value: function equal(v1, v2) {
            return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z;
        }
    }, {
        key: 'crossProduct',
        value: function crossProduct(v1, v2) {
            return new Vec3(v1.y * v2.z - v1.z * v2.y, v1.z * v2.x - v1.x * v2.z, v1.x * v2.y - v1.y * v2.x);
        }
    }, {
        key: 'proj',
        value: function proj(v1, v2) {
            var v = Vec3.clone(v2);
            var distance = v.distance();
            var vii = v.multi(Vec3.zero().add(v1).multi(v) / (distance * distance));
            return v1.sub(vii);
        }
    }, {
        key: 'norm',
        value: function norm(vec3) {
            var clone = Vec3.clone(vec3);
            var distance = clone.distance();
            if (distance) {
                return clone.multi(1 / distance);
            } else {
                throw new Error('zero vec3 cant be norm');
            }
        }
    }]);

    return Vec3;
})();

exports['default'] = Vec3;
module.exports = exports['default'];

},{}],"Moco":[function(require,module,exports){
Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Vec3 = require('./Vec3');

var _Vec32 = _interopRequireDefault(_Vec3);

var _Matrix3 = require('./Matrix3');

var _Matrix32 = _interopRequireDefault(_Matrix3);

var _Util = require('./Util');

var _Util2 = _interopRequireDefault(_Util);

var _Timer = require('./Timer');

var _Timer2 = _interopRequireDefault(_Timer);

var _Event = require('./Event');

var _Event2 = _interopRequireDefault(_Event);

var _InteractiveEvent = require('./InteractiveEvent');

var _InteractiveEvent2 = _interopRequireDefault(_InteractiveEvent);

var _MouseEvent = require('./MouseEvent');

var _MouseEvent2 = _interopRequireDefault(_MouseEvent);

var _KeyboardEvent = require('./KeyboardEvent');

var _KeyboardEvent2 = _interopRequireDefault(_KeyboardEvent);

var _EventDispatcher = require('./EventDispatcher');

var _EventDispatcher2 = _interopRequireDefault(_EventDispatcher);

var _DisplayObject = require('./DisplayObject');

var _DisplayObject2 = _interopRequireDefault(_DisplayObject);

var _InteractiveObject = require('./InteractiveObject');

var _InteractiveObject2 = _interopRequireDefault(_InteractiveObject);

var _DisplayObjectContainer = require('./DisplayObjectContainer');

var _DisplayObjectContainer2 = _interopRequireDefault(_DisplayObjectContainer);

var _Stage = require('./Stage');

var _Stage2 = _interopRequireDefault(_Stage);

var _Sprite = require('./Sprite');

var _Sprite2 = _interopRequireDefault(_Sprite);

var _Shape = require('./Shape');

var _Shape2 = _interopRequireDefault(_Shape);

var _LoaderEvent = require('./LoaderEvent');

var _LoaderEvent2 = _interopRequireDefault(_LoaderEvent);

var _Loader = require('./Loader');

var _Loader2 = _interopRequireDefault(_Loader);

var _Bitmap = require('./Bitmap');

var _Bitmap2 = _interopRequireDefault(_Bitmap);

var _BitmapData = require('./BitmapData');

var _BitmapData2 = _interopRequireDefault(_BitmapData);

var _URLLoaderEvent = require('./URLLoaderEvent');

var _URLLoaderEvent2 = _interopRequireDefault(_URLLoaderEvent);

var _URLLoader = require('./URLLoader');

var _URLLoader2 = _interopRequireDefault(_URLLoader);

var _URLRequest = require('./URLRequest');

var _URLRequest2 = _interopRequireDefault(_URLRequest);

var _TextField = require('./TextField');

var _TextField2 = _interopRequireDefault(_TextField);

var _Label = require('./Label');

var _Label2 = _interopRequireDefault(_Label);

var _Easing = require('./Easing');

var _Easing2 = _interopRequireDefault(_Easing);

var _Animate = require('./Animate');

var _Animate2 = _interopRequireDefault(_Animate);

exports['default'] = {
    Vec3: _Vec32['default'],
    Matrix3: _Matrix32['default'],
    Util: _Util2['default'],
    Timer: _Timer2['default'],
    Event: _Event2['default'],
    InteractiveEvent: _InteractiveEvent2['default'],
    MouseEvent: _MouseEvent2['default'],
    KeyboardEvent: _KeyboardEvent2['default'],
    EventDispatcher: _EventDispatcher2['default'],
    DisplayObject: _DisplayObject2['default'],
    InteractiveObject: _InteractiveObject2['default'],
    DisplayObjectContainer: _DisplayObjectContainer2['default'],
    Stage: _Stage2['default'],
    Sprite: _Sprite2['default'],
    Shape: _Shape2['default'],
    LoaderEvent: _LoaderEvent2['default'],
    Loader: _Loader2['default'],
    Bitmap: _Bitmap2['default'],
    BitmapData: _BitmapData2['default'],
    URLLoaderEvent: _URLLoaderEvent2['default'],
    URLLoader: _URLLoader2['default'],
    URLRequest: _URLRequest2['default'],
    TextField: _TextField2['default'],
    Label: _Label2['default'],
    Easing: _Easing2['default'],
    Animate: _Animate2['default']
};
module.exports = exports['default'];

},{"./Animate":1,"./Bitmap":2,"./BitmapData":3,"./DisplayObject":4,"./DisplayObjectContainer":5,"./Easing":6,"./Event":7,"./EventDispatcher":8,"./InteractiveEvent":10,"./InteractiveObject":11,"./KeyboardEvent":12,"./Label":13,"./Loader":14,"./LoaderEvent":15,"./Matrix3":16,"./MouseEvent":17,"./Shape":18,"./Sprite":19,"./Stage":20,"./TextField":21,"./Timer":23,"./URLLoader":24,"./URLLoaderEvent":25,"./URLRequest":26,"./Util":27,"./Vec3":28}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,"Moco",17,18,19,20,21,22,23,24,25,26,27,28]);
