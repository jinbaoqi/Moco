/**
 * Base继承类
 */

var Base = {
    _inherit: function(Child,Parent){
        var F = function(){},
            old = Child.prototype;

        F.prototype = Parent.prototype;
        Child.prototype = new F();
        Child.prototype.constructor = Child;

        for(var key in old){
            if(old.hasOwnProperty(key)){
                Child.prototype[key] = old[key];
            }
        }
    },
    create: function(Child,Parent){
        var self = this;

        if(objProto.create){
            objProto.create.call(Object,Child,Parent);
        }else{
            self._inherit(Child,Parent);
        }
    }
};