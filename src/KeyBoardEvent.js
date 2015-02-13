
var KeyBoardEvent = {
    KEY_DOWN: "keydown",
    KEY_UP: "keyup",
    KEY_PRESS: "keypress"
};

KeyBoardEvent.nameList = Util.keys(KeyBoardEvent);

KeyBoardEvent.getObjs = function(){
    return this._list;
}

Util.extends(KeyBoardEvent,EventCore);