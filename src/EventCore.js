var EventCore = {
    _list: [],
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
                if (!a1[i] || !a2[i]) {
                    return a1[i] ? 1 : -1;
                } else if (a1[i] != a2[i]) {
                    return a1[i] - a2[i];
                }
            }
        });

        k = objs[0] && objs[0].aIndex;

        for (var i = 0, len = objs.length; i < len; i++) {
            item = objs[i];
            if (k != item.aIndex) {
                break;
            } else {
                tmp.push(item);
            }
        }

        return tmp;
    }
};
