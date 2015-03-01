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
    },
    getObjsFromCord: function (cord) {
        var self = this,
            objs = [],
            tmp = [],
            k = 0,
            item;

        objs = Util.filter(self._list, function (item) {
            if (item.isMouseon(cord)) {
                return true;
            }
        });

        objs = arrProto.sort.call(objs, function (i, j) {
            var a1 = i.objectIndex.split("."),
                a2 = j.objectIndex.split("."),
                len = Math.max(a1.length, a2.length);

            for (var i = 0; i < len; i++) {
                if (!a2[i] || !a1[i]) {
                    return a2[i] ? 1 : -1;
                } else if (a2[i] != a1[i]) {
                    return a2[i] - a1[i];
                }
            }
        });

        if (objs.length) {
            k = objs[0].objectIndex;
            tmp.push(objs[0]);

            for (var i = 1, len = objs.length; i < len; i++) {
                item = objs[i];
                if (
                    k.indexOf(item.objectIndex) != -1 ||
                    k.indexOf(item.aIndex) != -1
                    ) {
                    tmp.push(item);
                }
            }
        }

        return tmp;
    }
};
