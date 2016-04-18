var EventCore = {
    _list: [],
    add: function (obj) {
        if (obj instanceof EventDispatcher) {
            this._list.push(obj);
        }
    },
    remove: function (obj) {
        var i, len, item;

        if (obj instanceof  EventDispatcher) {
            for (i = 0, len = this._list.length; i < len; i++) {
                item = this._list[i];
                if (item.aIndex == obj.aIndex) {
                    this._list.splice(i, 1);
                    break;
                }
            }
        }
    },
    getObjs: function () {
        return this._list;
    }
};
