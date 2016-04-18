class InteractiveEvent {
	static getList() {
		return Util.clone(this._list);
	}

	static add(eventName, item) {
		if (item instanceof EventDispatcher) {
			let list = this._list;
			list[eventName] = list[eventName] ? list[eventName] : [];

			let index = Util.inArray(item, list[eventName], (a1, a2) => {
				return a1.aIndex == a2.aIndex;
			});

			if (!~index) {
				list[eventName].push(item);
			}
		}
	}

	static remove(eventName, item) {
		if (item instanceof EventDispatcher) {
			let list = this._list;
			if (list[eventName]) {
				let index = Util.inArray(item, list[eventName], (a1, a2) => {
					return a1.aIndex == a2.aIndex;
				});

				if (~index) {
					list[eventName].splice(i, 1);
				}
			}
		}
	}
}

InteractiveEvent._list = {};

Moco.InteractiveEvent = InteractiveEvent;