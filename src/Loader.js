let loaderEvent = {
    COMPLETE: "complete",
    ERROR: "error"
};

class Loader extends DisplayObjectContainer {
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

    load(request) {
        var _me = this;
        var params = [];

        request.method = request.method.toUpperCase();

        if (request == null) {
            console.error("Loader need URLRequest instance");
            return;
        }
        debugger;

        if (_me._loading) {
            _me._queue.push(request);
            return;
        }

        var url = request.url;
        var data = request.data;
        var keys = Util.keys(request.data);
        if (keys.length) {
            params = Util.map(request.data, function (val, key) {
                return key + "=" + encodeURIComponent(val);
            });
            data = params.join("&");
        }

        if (request.method == "GET") {
            if (keys.length) {
                url += "?" + data;
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

    close() {
        this._close = true;
    }

    _onload() {
        var _me = this;
        if (!_me._close) {
            _me.trigger(_me, loaderEvent.COMPLETE, {
                target: _me
            });
        }

        _me._close = false;
        _me._loading = false;
        _me._next();
    }

    _onerror() {
        var _me = this;
        if (!_me._close) {
            _me.trigger(_me, loaderEvent.ERROR);
        }

        _me._close = false;
        _me._loading = false;
        _me._next();
    }

    _next() {
        var _me = this;
        if (_me._queue.length) {
            _me.load(_me._queue.shift());
        }
    }
}

Moco.Loader = Loader;
Moco.LoaderEvent = loaderEvent;
