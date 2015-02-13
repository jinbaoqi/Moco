
var MouseEvent = {
    CLICK: "click",
    MOUSE_DOWN: "mousedown",
    MOUSE_UP: "mouseup",
    MOUSE_MOVE: "mousemove"
};

MouseEvent.nameList = Util.keys(MouseEvent);

Util.extends(MouseEvent,EventCore);