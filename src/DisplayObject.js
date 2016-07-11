import Global from './Global';
import Matrix3 from './Matrix3';
import Util from './Util';
import EventDispatcher from './EventDispatcher';

export default class DisplayObject extends EventDispatcher {
    constructor() {
        super();
        this.name = 'DisplayObject';
        this.mask = null;
        this.parent = null;
        this.globalCompositeOperation = '';
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
        this._matrix = Matrix3.identity();
        this.aIndex = this.objectIndex = '' + Global.guid;
        Global.guid += 1;
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

        if (!_me.visible || !_me.alpha) {
            return false;
        }

        if (
            (_me.mask !== null && _me.mask.show) ||
            _me.rotate !== 0 ||
            _me.scaleX !== 1 ||
            _me.scaleY !== 1 ||
            _me.x !== 0 ||
            _me.y !== 0 ||
            _me.globalCompositeOperation !== ''
        ) {
            _me._isSaved = true;
            ctx.save();
        }

        if (_me.mask !== null && _me.mask.show) {
            _me.mask.show();
            ctx.clip();
        }

        if (_me.alpha < 1) {
            ctx.globalAlpha = _me._alpha;
        }

        _me._matrix.multi(matrix);

        if (_me.x !== 0 || _me.y !== 0) {
            let x = _me.x;
            let y = _me.y;
            _me._matrix.multi(Matrix3.translation(x, y));
            ctx.translate(x, y);
        }

        if (_me.rotate !== 0) {
            let angle = _me.rotate;
            _me._matrix.multi(Matrix3.rotation(angle));
            ctx.rotate(Util.deg2rad(angle));
        }

        if (_me.scaleX !== 1 || _me.scaleY !== 1) {
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

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    get x() {
        return this._x;
    }

    set x(x) {
        this._x = x;
        this._matrix.translate(x, this._y);
    }

    get y() {
        return this._y;
    }

    set y(y) {
        this._y = y;
        this._matrix.translate(this._x, y);
    }

    get rotate() {
        return this._rotate;
    }

    set rotate(rotate) {
        this._rotate = rotate;
        this._matrix.rotate(rotate);
    }

    get scaleX() {
        return this._scaleX;
    }

    set scaleX(scaleX) {
        this._scaleX = scaleX;
        this._matrix.scale(scaleX, this._scaleY);
    }

    get scaleY() {
        return this._scaleY;
    }

    set scaleY(scaleY) {
        this._scaleY = scaleY;
        this._matrix.scale(this._scaleX, scaleY);
    }

    get alpha() {
        return this._alpha;
    }

    set alpha(alpha) {
        if (alpha > 1) {
            alpha = 1;
        } else if (alpha < 0.001) {
            alpha = 0;
        }
        this._alpha = alpha;
    }
}