class DisplayObject extends EventDispatcher {
    constructor() {
        super();
        this.name = "DisplayObject";
        this.alpha = 1;
        this._height = 0;
        this._width = 0;
        this.mask = null;
        this.rotate = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.parent = null;
        this.globalCompositeOperation = "";
        this.x = 0;
        this.y = 0;
        this.parent = null;
        this.visible = true;
        this.aIndex = this.objectIndex = "" + (guid++);
        this._isSaved = false;
        this._matrix = Matrix3.identity();

        this._observeOffsetProperty();
        this._observeTransformProperty();
    }

    on() {
        super.bind.apply(this, arguments);
    }

    off() {
        super.bind.apply(this, arguments);
    }

    show(matrix) {
        let _me = this;
        let ctx = _me.ctx || _me.stage.ctx;

        _me._matrix = Matrix3.identity();

        if (!_me.visible || _me.alpha <= 0.001) {
            return false;
        }

        if (
            (_me.mask != null && _me.mask.show) ||
            _me.rotate != 0 ||
            _me.scaleX != 1 ||
            _me.scaleY != 1 ||
            _me.x != 0 ||
            _me.y != 0 ||
            _me.globalCompositeOperation != ""
        ) {
            _me._isSaved = true;
            ctx.save();
        }

        if (_me.mask != null && _me.mask.show) {
            _me.mask.show();
            ctx.clip();
        }

        if (_me.alpha < 1) {
            ctx.globalAlpha = _me.alpha > 1 ? 1 : _me.alpha;
        }

        _me._matrix.multi(matrix);

        if (_me.x != 0 || _me.y != 0) {
            let x = _me.x;
            let y = _me.y;
            _me._matrix.multi(Matrix3.translation(x, y));
            ctx.translate(x, y);
        }

        if (_me.rotate != 0) {
            let angle = _me.rotate;
            _me._matrix.multi(Matrix3.rotation(angle));
            ctx.rotate(Util.deg2rad(angle));
        }

        if (_me.scaleX != 1 || _me.scaleY != 1) {
            let scaleX = _me.scaleX;
            let scaleY = _me.scaleY;
            _me._matrix.multi(Matrix3.scaling(scaleX, scaleY));
            ctx.scale(scaleX, scaleY);
        }

        return true;
    }

    dispose() {
        let _me = this;
        let eventNames = Util.keys(_me._handlers);
        _me.off(eventNames);
    }

    _getWidth() {
        return this._width;
    }

    _getHeight() {
        return this._height;
    }

    _observeOffsetProperty() {
        let _me = this;
        let properties = [{
            key: 'width',
            method: "_getWidth"
        }, {
            key: 'height',
            method: "_getHeight"
        }];

        for (let i = 0, len = properties.length; i < len; i++) {
            let prop = properties[i];
            Object.defineProperty(_me, prop.key, {
                get: () => {
                    return _me[prop.method].call(_me);
                }
            });
        }
    }

    _observeTransformProperty() {
        let _me = this;
        let properties = [{
            key: 'x',
            method: 'translate',
            args: (value) => {
                return [value, _me.y]
            }
        }, {
            key: 'y',
            method: 'translate',
            args: (value) => {
                return [_me.x, value]
            }
        }, {
            key: 'rotate',
            method: 'rotate',
            args: (value) => {
                return [value];
            }
        }, {
            key: 'scaleX',
            method: 'scale',
            args: (value) => {
                return [value, _me.scaleY]
            }
        }, {
            key: 'scaleY',
            method: 'scale',
            args: (value) => {
                return [_me.scaleX, value]
            }
        }];

        for (let i = 0, len = properties.length; i < len; i++) {
            let prop = properties[i];
            let val = _me[prop.key];
            Object.defineProperty(_me, prop.key, {
                set: (newValue) => {
                    val = newValue;
                    _me._matrix[prop.method].apply(_me._matrix, prop.args(newValue));
                },
                get: () => {
                    return val;
                }
            })
        }
    }
}

Moco.DisplayObject = DisplayObject;