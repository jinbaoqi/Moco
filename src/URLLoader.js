import EventDispatcher from './EventDispatcher';
import Util from './Util';
import URLLoaderEvent from './URLLoaderEvent';

export default class URLLoader extends EventDispatcher {
    constructor(request) {
        super();
        this._request = request;
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
        let _me = this;
        let xhr = false;
        let params = [];
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

        let url = request.url;
        let data = request.data;
        let keys = Util.keys(request.data);
        if (keys.length) {
            params = Util.map(request.data, function (val, key) {
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

        Util.each(request.requestHeaders, function (val, key) {
            xhr.setRequestHeader(key, val);
        });

        xhr.send(data);
        _me._loading = true;

    }

    close() {
        this._close = true;
    }

    _onreadystatechange() {
        let _me = this;
        let xhr = _me._xhr;
        let eventName = '';

        if (xhr.readyState === 4) {
            if (!_me._close) {
                if (xhr.status === 200) {
                    eventName = URLLoaderEvent.COMPLETE;
                } else {
                    eventName = URLLoaderEvent.ERROR;
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

    _next() {
        let _me = this;
        if (_me._queue.length) {
            _me.load(_me._queue.shift());
        }
    }
}