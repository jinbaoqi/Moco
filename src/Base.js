/**
 * Base继承类
 */

var Base = {
    inherit: function (Child, Parent) {
        var F = function () {
            },
            old = Child.prototype;

        F.prototype = Parent.prototype;
        Child.prototype = new F();
        Child.prototype.constructor = Child;

        for (var key in old) {
            if (old.hasOwnProperty(key)) {
                Child.prototype[key] = old[key];
            }
        }
    }
};