import DisplayObjectContainer from './DisplayObjectContainer';
import Util from './Util';
import EventDispatcher from './EventDispatcher';
import Timer from './Timer';
import KeyboardEvent from './KeyboardEvent';
import MouseEvent from './MouseEvent';
import Sprite from './Sprite';
import Vec3 from './Vec3';

export default class Stage extends DisplayObjectContainer {
    constructor(canvasId, fn) {
        super();

        this.name = 'Stage';
        this.domElem = document.getElementById(canvasId);
        this._width = parseFloat(this.domElem.getAttribute('width'), 10);
        this._height = parseFloat(this.domElem.getAttribute('height'), 10);
        this.ctx = this.domElem.getContext('2d');

        let offset = this._getOffset();
        this._x = offset.left;
        this._y = offset.top;

        if (typeof fn === 'function') {
            fn(this);
        }

        this.initialize();
    }

    initialize() {
        let _me = this;

        Util.each(MouseEvent.nameList, (eventName) => {
            eventName = MouseEvent[eventName];
            EventDispatcher.prototype.on.call(_me, _me.domElem, eventName, (event) => {
                _me._mouseEvent(event);
            }, false);
        });

        Util.each(KeyboardEvent.nameList, (eventName) => {
            eventName = KeyboardEvent[eventName];
            EventDispatcher.prototype.off.call(_me, document, eventName, (event) => {
                _me._keyboardEvent(event);
            });
        }, false);

        Timer.add(_me);
        Timer.start();
    }

    show(matrix) {
        let _me = this;
        _me.ctx.clearRect(0, 0, _me._width, _me._height);
        super.show(matrix);
    }

    tick() {
        let _me = this;
        _me.show(_me._matrix);
    }

    addChild(child) {
        let _me = this;
        let addStage = (child) => {
            child.stage = _me;

            if (child instanceof Sprite && child.graphics) {
                child.graphics.stage = _me;
                child.graphics.parent = child;
                child.graphics.objectIndex = child.objectIndex + '.0';
            }
        };

        addStage(child);

        if (child.getAllChild) {
            let childs = child.getAllChild();
            Util.each(childs, (item) => {
                addStage(item);
            });
        }

        super.addChild(child);
    }

    isMouseOn() {
        return true;
    }

    getBounds() {
        return {
            sv: new Vec3(0, 0, 1),
            ev: new Vec3(this.width, this.height, 1)
        };
    }

    _mouseEvent(event) {
        let _me = this;
        let cord = {
            x: 0,
            y: 0
        };

        if (event.clientX !== null) {
            cord.x = event.pageX - _me.x;
            cord.y = event.pageY - _me.y;
        }

        event.cord = cord;

        let eventName = event.type;
        let item = MouseEvent.getTopItem(eventName, cord);
        if (item) {
            item.trigger(eventName, event);
        }
    }

    _keyboardEvent(event) {
        let eventName = event.type;
        let items = KeyboardEvent.getItems(eventName);

        if (items.length) {
            Util.each(items, (item) => {
                item.trigger(eventName, event);
            });
        }
    }

    _getOffset() {
        return {
            top: 0,
            left: 0
        };
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

}