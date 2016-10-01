import InteractiveObject from './InteractiveObject';
import Event from './Event';
import Util from './Util';
import Matrix3 from './Matrix3';
import Vec3 from './Vec3';
import Global from './Global';

export default class Label extends InteractiveObject {
    constructor() {
        super();
        this.name = 'Label';
        this._input = this._createInputElement();
        this._color = '#000000';
        this._textAlign = 'left';
        this._text = '';
        this._textBaseline = 'alphabetic'; // equal to baseline
        this._font = 'arial';
        this._size = 12;
        this._wordWrap = false;
        this._fontHeight = 0;
        this._fontAscent = 0;
        this._fillX = 0;
        this._areas = [];
        this._bindEvents();
    }

    show(matrix) {
        let isDrew = super.show(matrix);
        if (!isDrew) {
            return isDrew;
        }

        let _me = this;
        let ctx = _me.ctx || _me.stage.ctx;

        ctx.strokeStyle = _me._color;
        ctx.fillStyle = _me._color;
        ctx.font = _me._size + 'px ' + _me._font;
        ctx.textAlign = _me._textAlign;
        ctx.textBaseline = _me._textBaseline;

        let fontHeight = _me._fontHeight;
        let fontAscent = _me._fontAscent;
        let text = _me._text;
        let areas = _me._areas;
        for (let i = 1, len = _me._areas.length; i < len; i += 1) {
            ctx.fillText(text.slice(areas[i - 1], areas[i]), _me._fillX, fontAscent + (i - 1) * fontHeight);
        }

        ctx.restore();

        return isDrew;
    }

    isMouseOn(cord) {
        let _me = this;
        let vec = new Vec3(cord.x, cord.y, 1);
        let inverse = Matrix3.inverse(_me._matrix);
        let area = [
            [0, 0],
            [_me._width, 0],
            [_me._width, _me._height],
            [0, _me._height]
        ];

        vec.multiMatrix3(inverse);
        return Util.pip([vec.x, vec.y], area);
    }

    getBounds() {
        let _me = this;
        let sx = Global.maxNumber;
        let ex = Global.minNumber;
        let sy = Global.maxNumber;
        let ey = Global.minNumber;
        let area = [
            [0, 0],
            [_me._width, 0],
            [_me._width, _me._height],
            [0, _me._height]
        ];

        let matrix = _me._matrix;
        let vec3s = Util.map(area, (item) => {
            let vec = new Vec3(item[0], item[1], 1);
            return vec.multiMatrix3(matrix);
        });

        Util.each(vec3s, (item) => {
            sx = item.x < sx ? item.x : sx;
            ex = item.x > ex ? item.x : ex;
            sy = item.y < sy ? item.y : sy;
            ey = item.y > ey ? item.y : ey;
        });

        if (sx === Global.maxNumber ||
            ex === Global.minNumber ||
            sy === Global.maxNumber ||
            ey === Global.minNumber) {
            sx = sy = ex = ey = 0;
        }

        return {
            sv: new Vec3(sx, sy, 1),
            ev: new Vec3(ex, ey, 1)
        };
    }

    _bindEvents() {
        let _me = this;
        _me.on(Event.ADD_TO_STAGE, ()=> {
            _me._compute();
        });
    }

    _createInputElement() {
        let _me = this;
        let $input = document.createElement('INPUT');

        $input.style.font = _me._size + 'px ' + _me._font;
        $input.style.width = '0px';
        $input.style.height = '0px';
        $input.style.position = 'absolute';
        $input.style.top = '0px';
        $input.style.left = '0px';
        $input.style.display = 'none';

        document.body.appendChild($input);

        return $input;
    }

    _compute() {
        let _me = this;
        let textLen = _me._text.length;
        _me._computeFontBox();
        _me._areas = [];
        if (_me._wordWrap) {
            _me._areas = _me._areas.concat(0, _me._computeAreas(), textLen);
        } else {
            _me._areas.push(0, _me._text.length);
        }
    }

    _computeFontBox() {
        let _me = this;
        let $span = document.createElement('span');
        $span.innerHTML = 'Hg';
        $span.style.font = _me._size + 'px ' + _me._font;

        let $block = document.createElement('div');
        $block.style.display = 'inline-block';
        $block.style.width = '1px';
        $block.style.height = '0px';

        var $container = document.createElement('div');
        $container.appendChild($span);
        $container.appendChild($block);

        document.body.appendChild($container);

        try {
            $block.style.verticalAlign = 'baseline';
            _me._fontAscent = $block.offsetTop - $span.offsetTop;
            $block.style.verticalAlign = 'bottom';
            _me._fontHeight = $block.offsetTop - $span.offsetTop;
        } finally {
            document.body.removeChild($container);
        }
    }

    _computeAreas() {
        let _me = this;
        let cache = {};
        let ctx = _me.ctx || _me.stage.ctx;
        let text = _me._text;
        let tWidth = _me._width;
        let count = 0;
        let areas = [];

        ctx.strokeStyle = _me._color;
        ctx.fillStyle = _me._color;
        ctx.font = _me._size + 'px ' + _me._font;
        ctx.textAlign = _me._textAlign;
        ctx.textBaseline = _me._textBaseline;

        for (let i = 0, len = text.length; i < len; i += 1) {
            let char = text.charAt(i);
            let width = 0;

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
                areas.push(i -= 1);
            }
        }

        return areas;
    }

    get color() {
        return this._color;
    }

    set color(color) {
        let _me = this;
        _me._color = color;
        _me._input.style.color = color;
    }

    get textAlign() {
        return this._textAlign;
    }

    set textAlign(textAlign) {
        let _me = this;
        _me._textAlign = textAlign;
        _me._input.style.textAlign = textAlign;

        // jshint ignore: start
        switch (textAlign) {
            case 'end':
            case 'right':
                _me._fillX = _me._width;
                break;
            case 'center':
                _me._fillX = _me._width / 2;
                break;
            case 'start':
            case 'left':
            default:
                _me._fillX = 0;
                break;
        }
        // jshint ignore: end
    }

    get textBaseline() {
        return this._textBaseline;
    }

    set textBaseline(textBaseline) {
        let _me = this;
        _me._textBaseline = textBaseline;
        _me._input.style.verticalAlign = textBaseline;
    }

    get size() {
        return this._size;
    }

    set size(size) {
        let _me = this;
        _me._size = size;
        _me._input.style.font = size + 'px ' + _me._font;
        if (_me._addedToStage) {
            _me._compute();
        }
    }

    get font() {
        return this._font;
    }

    set font(font) {
        let _me = this;
        _me._font = font;
        _me._input.style.font = _me.size + 'px ' + font;
        if (_me._addedToStage) {
            _me._compute();
        }
    }

    get wordWrap() {
        return this._wordWrap;
    }

    set wordWrap(wordWrap) {
        let _me = this;
        _me._wordWrap = wordWrap;
        if (_me._addedToStage) {
            _me._compute();
        }
    }

    get text() {
        return this._text;
    }

    set text(text) {
        let _me = this;
        _me._text = text.replace('\r\n', '\n');
        if (_me._addedToStage) {
            _me._compute();
        }
    }

    // jshint ignore: start

    set width(width) {
        this._width = width;
        this._input.style.width = width + 'px';
        this.textAlign = this._textAlign;
    }

    set height(height) {
        this._height = height;
        this._input.style.height = height + 'px';
    }

    // jshint ignore: end

}