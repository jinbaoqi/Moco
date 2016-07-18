import Util from './Util';

export default class Timer {
    static add(timerObject) {
        let _me = this;
        let index = Util.inArray(timerObject, _me._list, (obj, item) => {
            return obj.aIndex === item.aIndex;
        });

        if (index === -1) {
            _me._list.push(timerObject);
        }

        return _me;
    }

    static remove(timerObject) {
        let _me = this;
        let index = Util.inArray(timerObject, _me._list, (obj, item) => {
            return obj.aIndex === item.aIndex;
        });

        if (index !== -1) {
            _me._list.splice(index, 1);
        }

        return _me;
    }

    static start() {
        let _me = this;
        _me.isStoped = false;

        if (!_me._isInit) {
            _me._init();
        }

        _me._raf();

        return _me;
    }

    static stop() {
        let _me = this;
        _me.isStoped = true;

        if (!_me._isInit) {
            _me._init();
        }

        _me._craf();

        return _me;
    }

    static _init() {
        let _me = this;
        let lastTime = 0;
        let vendors = ['webkit', 'moz'];
        let requestAnimationFrame = window.requestAnimationFrame;
        let cancelAnimationFrame = window.cancelAnimationFrame;
        let i = vendors.length - 1;

        while (i >= 0 && !requestAnimationFrame) {
            requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
            cancelAnimationFrame = window[vendors[i] + 'CancelAnimationFrame'];
            i -= 1;
        }

        if (!requestAnimationFrame || !cancelAnimationFrame) {
            requestAnimationFrame = (callback) => {
                let now = +new Date(),
                    nextTime = Math.max(lastTime + 16, now);
                return setTimeout(() => {
                    callback(lastTime = nextTime);
                }, nextTime - now);
            };

            cancelAnimationFrame = clearTimeout;
        }

        _me._requestAnimationFrame = requestAnimationFrame;
        _me._cancelAnimationFrame = cancelAnimationFrame;
        _me._isInit = true;
    }

    static _raf() {
        this._timer = this._requestAnimationFrame.call(window, this._callback.bind(this));
    }

    static _craf() {
        this._cancelAnimationFrame.call(window, this._timer);
    }

    static _callback() {
        let _me = this;
        let list = _me._list;
        for (let i = 0, len = list.length; i < len; i += 1) {
            let item = list[i];
            if (item.tick) {
                item.tick();
            }
        }
        _me._raf();
    }

    static get isStoped() {
        return this._isStoped;
    }

    static set isStoped(isStoped) {
        this._isStoped = isStoped;
    }

    static get _list() {
        this._list_ = this._list_ || [];
        return this._list_;
    }

    static set _list(list) {
        this._list_ = list;
    }

    static get _isInit() {
        return this._isInit_ || false;
    }

    static set _isInit(isInit) {
        this._isInit_ = isInit;
    }

    static get _timer() {
        return this._timer_;
    }

    static set _timer(timer) {
        this._timer_ = timer;
    }

    static get _requestAnimationFrame() {
        return this._requestAnimationFrame_;
    }

    static set _requestAnimationFrame(requestAnimationFrame) {
        this._requestAnimationFrame_ = requestAnimationFrame;
    }

    static get _cancelAnimationFrame() {
        return this._cancelAnimationFrame_;
    }

    static set _cancelAnimationFrame(cancelAnimationFrame) {
        this._cancelAnimationFrame_ = cancelAnimationFrame;
    }
}