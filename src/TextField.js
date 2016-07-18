import InteractiveObject from './InteractiveObject';
import TextFieldEvent from './TextFieldEvent';
import MouseEvent from './MouseEvent';
import EventDispatcher from './EventDispatcher';
import Event from './Event';

export default class TextField extends InteractiveObject {
    constructor() {
        super();
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

    show(matrix) {
        super.show(matrix);
    }

    isMouseOn() {

    }

    getBounds() {

    }

    dispose() {

    }

    _bindEvents() {
        let _me = this;
        let DispatcherProtoOnMethod = EventDispatcher.prototype.on;

        _me.on(MouseEvent.CLICK, ()=> {

        });

        DispatcherProtoOnMethod.call(_me._input, TextFieldEvent.BLUR, ()=> {

        }, false);

        DispatcherProtoOnMethod.call(_me._input, TextFieldEvent.CHANGE, ()=> {

        }, false);

        _me.on(Event.ADD_TO_STAGE, ()=> {
            _me._compute();
        });
    }

    _createInputElement() {
        let _me = this;
        let $input = document.createElement('INPUT');

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

    _compute() {
        let _me = this;
        _me._fontHeight = _me._computeFontHeight();
        if (_me._wordWrap) {
            _me._areas = _me._computeAreas();
        } else {
            _me._areas = [];
        }
    }

    _computeFontHeight() {
        let _me = this;
        let $span = document.createElement('span');
        $span.innerHTML = 'Hg';
        $span.style.font = _me.size + 'px ' + _me.font;

        let $block = document.createElement('div');
        $block.style.display = 'inline-block';
        $block.style.width = '1px';
        $block.style.height = '0px';

        var $container = document.createElement('div');
        $container.appendChild($span);
        $container.appendChild($block);

        document.body.appendChild($container);

        let height = -1;
        try {
            $block.style.verticalAlign = 'bottom';
            height = $block.offsetTop - $span.offsetTop;
        } finally {
            document.body.removeChild($container);
        }

        return height;
    }

    _computeAreas() {
        let _me = this;
        let cache = {};
        let ctx = _me.ctx || _me.stage.ctx;
        let text = _me._text;
        let tWidth = _me._width;
        let count = 0;
        let areas = [];

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
                areas.push(i);
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
    }

    set height(height) {
        this._height = height;
        this._input.style.height = height + 'px';
    }

    set rotate(rotate) {
        super.rotate = rotate;
        if (rotate % 360 !== 0) {
            this.visible = false;
        }
    }

    // jshint ignore: end

}