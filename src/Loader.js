import DisplayObjectContainer from './DisplayObjectContainer';
import LoaderEvent from './LoaderEvent';
import Util from './Util';
import BitmapData from './BitmapData';

export default class Loader extends DisplayObjectContainer {
    constructor() {
        super();
        this.content = new Image();
        this._close = false;
        this._loading = false;
        this._queue = [];
    }

    on(eventName, callback) {
        super.bind.apply(this, [this, eventName, callback, false]);
    }

    off(eventName, callback) {
        super.bind.apply(this, [this, eventName, callback]);
    }

    toBitmapData(matrix) {
        let _me = this;
        let bmd = new BitmapData(_me.content.width, _me.content.height);
        bmd.draw(_me.content, matrix);
        return bmd;
    }

    load(request) {
        let _me = this;
        let params = [];

        request.method = request.method.toUpperCase();

        if (request === null) {
            console.error('Loader need URLRequest instance'); // jshint ignore:line
            return;
        }

        if (_me._loading) {
            _me._queue.push(request);
            return;
        }

        let url = request.url;
        let data = request.data;
        let keys = Util.keys(request.data);
        if (keys.length) {
            params = Util.map(request.data, (val, key) => {
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

        _me.content.onload = () => {
            _me._onload();
        };

        _me.content.onerror = () => {
            _me._onerror();
        };

        _me.content.src = url;
        _me._loading = true;
    }

    close() {
        this._close = true;
    }

    _onload() {
        let _me = this;
        if (!_me._close) {
            _me.trigger(_me, LoaderEvent.COMPLETE, {
                target: _me
            });
        }

        _me._close = false;
        _me._loading = false;
        _me._next();
    }

    _onerror() {
        let _me = this;
        if (!_me._close) {
            _me.trigger(_me, LoaderEvent.ERROR);
        }

        _me._close = false;
        _me._loading = false;
        _me._next();
    }

    _next() {
        let _me = this;
        if (_me._queue.length) {
            _me.load(_me._queue.shift());
        }
    }
}
