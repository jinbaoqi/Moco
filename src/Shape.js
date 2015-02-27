/**
 * Shape绘图类
 */

function Shape() {
    DisplayObject.call(this);

    this.name = "Shape";
    this._showList = [];
}

Shape.prototype.show = function () {
    DisplayObject.prototype.show.call(this);

    var self = this,
        showList = self._showList,
        len = showList.length;

    if (len > 0) {
        for (var i = 0; i < len; i++) {
            showList[i]();
        }
    }

    if (self._saveFlag) {
        self.stage.ctx.restore();
    }
};

Shape.prototype.lineWidth = function (thickness) {
    var self = this;
    self._showList.push(function () {
        self.stage.ctx.lineWidth = thickness;
    });
};

Shape.prototype.strokeStyle = function (color) {
    var self = this;
    self._showList.push(function () {
        self.stage.ctx.strokeStyle = color;
    });
};

Shape.prototype.stroke = function () {
    var self = this;
    self._showList.push(function () {
        self.stage.ctx.stroke();
    });
};

Shape.prototype.beginPath = function () {
    var self = this;
    self._showList.push(function () {
        self.stage.ctx.beginPath();
    });
};

Shape.prototype.closePath = function () {
    var self = this;
    self._showList.push(function () {
        self.stage.ctx.closePath();
    });
};

Shape.prototype.moveTo = function (x, y) {
    var self = this;
    self._showList.push(function () {
        self.stage.ctx.moveTo(x, y);
    });
};

Shape.prototype.lineTo = function (x, y) {
    var self = this;
    self._showList.push(function () {
        self.stage.ctx.lineTo(x, y);
    });
};

Shape.prototype.clear = function () {
    var self = this;
    self._showList = [];
};

Shape.prototype.rect = function (x, y, width, height) {
    var self = this;
    self._showList.push(function () {
        self.stage.ctx.rect(x, y, width, height);
    });
};

Shape.prototype.fillStyle = function (color) {
    var self = this;
    self._showList.push(function () {
        self.stage.ctx.fillStyle = color;
    });
};

Shape.prototype.fill = function () {
    var self = this;
    self._showList.push(function () {
        self.stage.ctx.fill();
    });
};

Shape.prototype.arc = function (x, y, r, sAngle, eAngle, direct) {
    var self = this;
    self._showList.push(function () {
        self.stage.ctx.arc(x, y, sAngle, eAngle, direct);
    });
};

Shape.prototype.drawArc = function (thickness, lineColor, pointArr, isFill, color) {
    var self = this,
        canvas;

    self._showList.push(function () {
        canvas = self.stage.ctx;

        canvas.beginPath();
        canvas.arc(pointArr[0], pointArr[1], pointArr[2], pointArr[3], pointArr[4], pointArr[5]);

        if (isFill) {
            canvas.fillStyle = color;
            canvas.fill();
        }
        canvas.lineWidth = thickness;
        canvas.strokeStyle = lineColor;
        canvas.stroke();
    });
};

Shape.prototype.drawRect = function (thickness, lineColor, pointArr, isFill, color) {
    var self = this,
        canvas;

    self._showList.push(function () {
        canvas = self.stage.ctx;

        canvas.beginPath();
        canvas.rect(pointArr[0], pointArr[1], pointArr[2], pointArr[3]);

        if (isFill) {
            canvas.fillStyle = color;
            canvas.fill();
        }
        canvas.lineWidth = thickness;
        canvas.strokeStyle = lineColor;
        canvas.stroke();
    });
};

Shape.prototype.drawVertices = function (thickness, lineColor, vertices, isFill, color) {
    var self = this,
        length = vertices.length,
        canvas, i;

    if (length < 3) {
        return;
    }

    self._showList.push(function () {
        canvas = self.stage.ctx;

        canvas.beginPath();
        canvas.moveTo(vertices[0][0], vertices[0][1]);

        for (i = 1; i < length; i++) {
            var pointArr = vertices[i];
            canvas.lineTo(pointArr[0], pointArr[1]);
        }

        canvas.lineTo(vertices[0][0], vertices[0][1]);

        if (isFill) {
            canvas.fillStyle = color;
            canvas.fill();
        }

        canvas.lineWidth = thickness;
        canvas.strokeStyle = lineColor;
        canvas.closePath();
        canvas.stroke();
    });
};

Shape.prototype.drawLine = function (thickness, lineColor, pointArr) {
    var self = this,
        canvas;

    self._showList.push(function () {
        canvas = self.stage.ctx;

        canvas.beginPath();
        canvas.moveTo(pointArr[0], pointArr[1]);
        canvas.lineTo(pointArr[2], pointArr[3]);
        canvas.lineWidth = thickness;
        canvas.strokeStyle = lineColor;
        canvas.closePath();
        canvas.stroke();
    });
};

Shape.prototype.lineStyle = function (thickness, color, alpha) {
    var self = this,
        canvas;

    if (!color) {
        color = self.color;
    }

    if (!alpha) {
        alpha = self.alpha;
    }

    self.color = color;
    self.alpha = alpha;

    self._showList.push(function () {
        canvas = self.stage.ctx;

        canvas.lineWidth = thickness;
        canvas.strokeStyle = color;
    });
};

Shape.prototype.add = function (fn) {
    var self = this;

    self._showList.push(function () {
        fn.call(self.stage);
    });
};

Shape.prototype.on = function(eventName, callback, useCapture){
    var self = this;
    EventDispatcher.prototype.on.apply(self,[self,eventName,callback,useCapture]);
};

Base.inherit(Shape, DisplayObject);
