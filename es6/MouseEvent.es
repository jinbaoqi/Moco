class MouseEvent extends InteractiveEvent {
	static getItemsFromCord(cord) {
		let _me = this;

		let items = Util.filter(_me._list, function(item) {
			if (item.isMouseon(cord)) {
				return true;
			}
		});

		items = Array.prototype.sort.call(items, function(i, j) {
			let a1 = i.objectIndex.split(".");
			let a2 = j.objectIndex.split(".");
			let len = Math.max(a1.length, a2.length);

			for (let i = 0; i < len; i++) {
				if (!a2[i] || !a1[i]) {
					return a2[i] ? 1 : -1;
				} else if (a2[i] != a1[i]) {
					return a2[i] - a1[i];
				}
			}
		});

		let tmp = [];
		if (items.length) {
			let k = items[0].objectIndex;

			tmp.push(items[0]);

			for (let i = 1, len = items.length; i < len; i++) {
				item = items[i];
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
}

let mouseEvents = {
	CLICK: "click",
	MOUSE_DOWN: "mousedown",
	MOUSE_UP: "mouseup",
	MOUSE_MOVE: "mousemove"
};

for (let key in mouseEvents) {
	MouseEvent[key] = mouseEvents[key];
}

MouseEvent.nameList = Util.keys(mouseEvents);

Moco.MouseEvent = MouseEvent;