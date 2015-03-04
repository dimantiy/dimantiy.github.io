/*
 * Collection of widgets
 * 
 * (c) Dmitriy Pankov 2015
 */

(function ()
{
	"use strict";

	DP.Widget = function (settings)
	{
		this._Id = "Widget_" + (++DP.Widget._lastIndex);
		this._Top = 0;
		this._Left = 0;
		this._Width = 0;
		this._Height = 0;
		this._Scale = 1.0;
		this._Angle = 0.0;
		this.Loaded = new DP.Event();
		if (settings.Loaded)
		{
			this.Loaded.add(settings.Loaded);
			delete settings.Loaded;
		}
		DP.Widget.base.constructor.apply(this, arguments);
	};

	DP.initClass(DP.Widget, DP.Object);

	DP.Widget._lastIndex = 0;

	var widgetP = DP.Widget.prototype;

	widgetP.draw = function (layer)
	{
		throw DP.Error.NotImplemented("draw");
	};

	widgetP.getRight = function ()
	{
		return this.getLeft() + this.getWidth();
	};

	widgetP.getBottom = function ()
	{
		return this.getTop() + this.getHeight();
	};

	widgetP._getRadius = function ()
	{
		var width = this.getWidth() * this.getScale();
		var height = this.getHeight() * this.getScale();
		var r = Math.sqrt(width * width + height * height) / 2;
		return r;
	};

	widgetP.checkOver = function (x, y)
	{
		var dx = Math.abs(this.getLeft() - x);
		var dy = Math.abs(this.getTop() - y);
		var d = Math.max(dx, dy);
		var r = this._getRadius();
		return d <= r;
	};

	widgetP = null;

})();

(function ()
{

	"use strict";

	DP.TextWidget = function (settings)
	{
		this._Text = "Widget";
		this._FontSize = 14;
		this._Background = "rgba(0, 0, 0, 0)";
		DP.TextWidget.base.constructor.apply(this, arguments);
		this.Loaded.fire();
	};

	DP.initClass(DP.TextWidget, DP.Widget);

	var textWidgetP = DP.TextWidget.prototype;

	textWidgetP.draw = function (layer)
	{
		var text = this.getSettings();
		layer.drawText(text);
	};

	textWidgetP = null;

})();

(function ()
{

	"use strict";

	DP.ImageWidget = function (settings)
	{
		DP.ImageWidget.base.constructor.apply(this, arguments);
		var self = this;
		var img = this._image = new Image();
		img.onload = function ()
		{
			self._Width = img.width;
			self._Height = img.height;
			self.Loaded.fire();
		};
		img.src = this._Url;
	};

	DP.initClass(DP.ImageWidget, DP.Widget);

	var imageWidgetP = DP.ImageWidget.prototype;

	imageWidgetP._Url = "";

	imageWidgetP.draw = function (layer)
	{
		var img = this.getSettings();
		layer.drawImage(img);
	};

	imageWidgetP = null;

})();

(function ()
{

	"use strict";

	DP.StickerWidget = function (settings)
	{
		this._Text = "Sticker";
		this._FontSize = 25;
		this._Padding = 25;
		DP.StickerWidget.base.constructor.apply(this, arguments);
		this._Width = 200;
		this._Height = 200;
	};

	DP.initClass(DP.StickerWidget, DP.ImageWidget);

	var stickerWidgetP = DP.StickerWidget.prototype;

	stickerWidgetP._Url = "assets/img/sticker.png";

	stickerWidgetP.draw = function (layer)
	{
		var padding = this.getPadding();
		var fontSize = this.getFontSize();
		var img = this.getSettings();
		var text = this.getSettings();

		text.Width -= 2 * padding;
		text.Height -= 2 * padding;

		layer.drawImage(img);
		layer.drawText(text);
	};

	stickerWidgetP = null;

})();