class KeyboardEvent extends InteractiveEvent {}

let keyboardEvents = {
	KEY_DOWN: "keydown",
	KEY_UP: "keyup",
	KEY_PRESS: "keypress"
};

for (let key in keyboardEvents) {
	KeyboardEvent[key] = keyboardEvents[key];
}

KeyboardEvent.nameList = Util.keys(keyboardEvents);

Moco.KeyboardEvent = KeyboardEvent;