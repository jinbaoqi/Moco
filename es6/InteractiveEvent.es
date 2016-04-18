class InteractiveEvent {
	static getList() {
		return Util.clone(this._list);
	}

	static add(item) {
		if (item instanceof EventDispatcher) {
			this._list.push(item);
		}
	}

	static remove(item) {
		if (item instanceof EventDispatcher) {
			for (let i = 0, len = this._list.length; i < len; i++) {
				let listItem = this._list[i];
				if (listItem.aIndex == item.aIndex) {
					this._list.splice(i, 1);
					break;
				}
			}
		}
	}
}

InteractiveEvent._list = [];

Moco.InteractiveEvent = InteractiveEvent;