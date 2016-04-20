class Sprite extends DisplayObjectContainer {
	constructor() {
		super();
		this.name = "Sprite";
		this.graphics = null;
	}

	addChild(child) {
		if (child instanceof Shape) {
			console.error("shape object should be linked to Sprite's graphics property");
		} else {
			super.addChild(child);
		}
	}

	removeChild(child) {
		if (child instanceof Shape) {
			console.error("shape object should be linked to Sprite's graphics property");
		} else {
			super.removeChild(child);
		}
	}

	show(matrix) {
		let _me = this;
		let isDrew = super.show(matrix);

		if (isDrew) {
			if (_me.graphics && _me.graphics.show) {
				DisplayObject.prototype.show.call(_me, matrix);
				_me.graphics.show(_me._matrix);
			}
			
			if (_me._isSaved) {
				let ctx = _me.ctx || _me.stage.ctx;
				_me._isSaved = false;
				ctx.restore();
			}
		}

		return isDrew;
	}

	isMouseon(cord) {
		return true;
	}

	_getWidth() {
		let _me = this;
		let shape = _me.graphics;
		let width = super._getWidth();

		if (shape) {
			let shapeWidth = shape.x + shape.width;
			width = shapeWidth < width ? width : shapeWidth;
		}

		return width;
	}

	_getHeight() {
		let _me = this;
		let shape = _me.graphics;
		let height = super._getHeight();

		if (shape) {
			let shapeHeight = shape.x + shape.height;
			height = shapeHeight < height ? height : shapeHeight;
		}

		return height;
	}
}

Moco.Sprite = Sprite;