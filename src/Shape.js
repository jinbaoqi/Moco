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
            y: 0
        };
    }

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
        self.stage.ctx.moveTo(x + cord.x + self.x, y + cord.y + self.y);
    });
};

Shape.prototype.lineTo = function (x, y) {
    var self = this;
    self._showList.push(function (cord) {
        self.stage.ctx.lineTo(x + cord.x + self.x, y + cord.y + self.y);
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
        self.stage.ctx.rect(x + cord.x + self.x, y + cord.y + self.y, width, height);
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
        self.stage.ctx.arc(x + cord.x + self.x, y + cord.y + self.y, r, sAngle, eAngle, direct);
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
        canvas.arc(pointArr[0] + cord.x + self.x, pointArr[1] + cord.y + self.y, pointArr[2], pointArr[3], pointArr[4], pointArr[5]);

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
        canvas.rect(pointArr[0] + cord.x + self.x, pointArr[1] + cord.y + self.y, pointArr[2], pointArr[3]);

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
        canvas.moveTo(vertices[0][0] + cord.x + self.x, vertices[0][1] + cord.y + self.y);

        for (i = 1; i < length; i++) {
            var pointArr = vertices[i];
            canvas.lineTo(pointArr[0] + cord.x + self.x, pointArr[1] + cord.y + self.y);
        }

        canvas.lineTo(vertices[0][0] + cord.x + self.x, vertices[0][1] + cord.y + self.y);

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
        canvas.moveTo(pointArr[0] + cord.x + self.x, pointArr[1] + cord.y + self.y);
        canvas.lineTo(pointArr[2] + cord.x + self.x, pointArr[3] + cord.y + self.y);
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

    debugger;

    pos = DisplayObject.prototype.isMouseon.call(self, cord, pos);
    cord = self._getRotatePos(cord, pos, self.rotate);

    ox = self.x + pos.x + self.translateX;
    oy = self.y + pos.y + self.translateY;
    osx = pos.scaleX * self.scaleX;
    osy = pos.scaleY * self.scaleY;

    for (i = 0, len = self._setList.length; i < len; i++) {
        item = self._setList[i];

        debugger;
        if (
            item.type == "rect" &&
            cord.x >= item.pos[0] + ox &&
            cord.x <= item.pos[2] * osx + ox + item.pos[0] &&
            cord.y >= item.pos[1] + oy &&
            cord.y <= item.pos[3] * osy + oy + item.pos[1]
            ) {
            return true;
        } else if (item.type == "arc") {
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
