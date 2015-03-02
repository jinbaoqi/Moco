/**
 * Shape绘图类
 */

function Shape() {
    DisplayObject.call(this);

    this.name = "Shape";
    this._showList = [];
    this._setList = [];
}

Shape.prototype.show = function (cord) {
    var self = this,
        showList = self._showList,
        len = showList.length;

    if (cord == null) {
        cord = {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1
        };
    }

    debugger;
    DisplayObject.prototype.show.call(this, cord);

    if (len) {
        for (var i = 0; i < len; i++) {
            showList[i](cord);
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
    self._showList.push(function (cord) {
        self.stage.ctx.moveTo(x + cord.x, y + cord.y);
    });
};

Shape.prototype.lineTo = function (x, y) {
    var self = this;
    self._showList.push(function (cord) {
        self.stage.ctx.lineTo(x + cord.x, y + cord.y);
    });
};

Shape.prototype.clear = function () {
    var self = this;
    self._showList = [];
    self._setList = [];
};

Shape.prototype.rect = function (x, y, width, height) {
    var self = this;

    self._showList.push(function (cord) {
        self.stage.ctx.rect(x + cord.x, y + cord.y, width, height);
    });

    self._setList.push({
        type: "rect",
        pos: [x, y, width, height]
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

    self._showList.push(function (cord) {
        self.stage.ctx.arc(x + cord.x, y + cord.y, r, sAngle, eAngle, direct);
    });

    self._setList.push({
        type: "arc",
        pos: pointArr
    });
};

Shape.prototype.drawArc = function (thickness, lineColor, pointArr, isFill, color) {
    var self = this,
        canvas;

    self._showList.push(function (cord) {
        canvas = self.stage.ctx;

        canvas.beginPath();
        canvas.arc(pointArr[0] + cord.x, pointArr[1] + cord.y, pointArr[2], pointArr[3], pointArr[4], pointArr[5]);

        if (isFill) {
            canvas.fillStyle = color;
            canvas.fill();
        }
        canvas.lineWidth = thickness;
        canvas.strokeStyle = lineColor;
        canvas.stroke();
    });

    self._setList.push({
        type: "arc",
        pos: pointArr
    });
};

Shape.prototype.drawRect = function (thickness, lineColor, pointArr, isFill, color) {
    var self = this,
        canvas;

    self._showList.push(function (cord) {
        canvas = self.stage.ctx;

        canvas.beginPath();
        canvas.rect(pointArr[0] + cord.x, pointArr[1] + cord.y, pointArr[2], pointArr[3]);

        if (isFill) {
            canvas.fillStyle = color;
            canvas.fill();
        }
        canvas.lineWidth = thickness;
        canvas.strokeStyle = lineColor;
        canvas.stroke();
    });

    self._setList.push({
        type: "rect",
        pos: pointArr
    });
};

//TODO:多边形不具有事件检测的功能
Shape.prototype.drawVertices = function (thickness, lineColor, vertices, isFill, color) {
    var self = this,
        length = vertices.length,
        canvas, i;

    if (length < 3) {
        return;
    }

    self._showList.push(function (cord) {
        canvas = self.stage.ctx;

        canvas.beginPath();
        canvas.moveTo(vertices[0][0] + cord.x, vertices[0][1] + cord.y);

        for (i = 1; i < length; i++) {
            var pointArr = vertices[i];
            canvas.lineTo(pointArr[0] + cord.x, pointArr[1] + cord.y);
        }

        canvas.lineTo(vertices[0][0] + cord.x, vertices[0][1] + cord.y);

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

    self._showList.push(function (cord) {
        canvas = self.stage.ctx;

        canvas.beginPath();
        canvas.moveTo(pointArr[0] + cord.x, pointArr[1] + cord.y);
        canvas.lineTo(pointArr[2] + cord.x, pointArr[3] + cord.y);
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

    self._showList.push(function (cord) {
        fn.call(self.stage);
    });
};

Shape.prototype.isMouseon = function (cord, pos) {
    var self = this,
        i, len, item, ax, ay, ar, ar2, ox, oy, osx, osy;

    if (pos == null) {
        pos = {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1
        };
    }

    debugger;
    pos = DisplayObject.prototype.isMouseon.call(self, cord, pos);
    cord = self._getRotateCord(cord, pos, self.rotate);


    osx = pos.scaleX * self.scaleX;
    osy = pos.scaleY * self.scaleY;

    ox = (self.x + self.translateX) * osx + pos.x;
    oy = (self.y + self.translateY) * osy + pos.y;

    for (i = 0, len = self._setList.length; i < len; i++) {
        item = self._setList[i];

        if (
                item.type == "rect" &&
                cord.x >= item.pos[0] * osx + ox &&
                cord.x <= (item.pos[2] + item.pos[0]) * osx + ox &&
                cord.y >= item.pos[1]* osy + oy &&
                cord.y <= (item.pos[3] + item.pos[1]) * osy + oy
            ) {
            return true;
        }
        else if (item.type == "arc") {
            ax = Math.pow(cord.x - (item.pos[0] * osx + ox), 2);
            ay = Math.pow(cord.y - (item.pos[1] * osy + oy), 2);
            ar = Math.pow(item.pos[2] * osx, 2);
            ar2 = Math.pow(item.pos[2] * osy, 2);

            if (osx == osy && ax + ay <= ar) {
                return true;
            } else if (osx != osy && ax / ar + ay / ar2 <= 1) {
                return true;
            }
        }
    }

    return false;
}

Base.inherit(Shape, InteractiveObject);
