
var KeyBoardEvent = {
    KEY_DOWN: "keydown",
    KEY_UP: "keyup",
    KEY_PRESS: "keypress"
};

KeyBoardEvent.nameList = Util.keys(KeyBoardEvent);

Util.extends(KeyBoardEvent,EventCore);