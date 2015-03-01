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
		var text = {
			Top: this.getTop(),
			Left: this.getLeft(),
			Width: this.getWidth() * this.getScale(),
			Height: this.getHeight() * this.getScale(),
			Angle: this.getAngle(),
			Text: this.getText(),
			Background: this.getBackground(),
			FontSize: this.getFontSize() * this.getScale()
		};
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
		var img = {
			Top: this.getTop(),
			Left: this.getLeft(),
			Width: this.getWidth() * this.getScale(),
			Height: this.getHeight() * this.getScale(),
			Angle: this.getAngle(),
			Url: this.getUrl()
		};
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
		this._FontSize = 30;
		this._Padding = 15;
		DP.StickerWidget.base.constructor.apply(this, arguments);
		this._Width = 200;
		this._Height = 200;
	};
	
	DP.initClass(DP.StickerWidget, DP.ImageWidget);
	
	var stickerWidgetP = DP.StickerWidget.prototype;
		
	stickerWidgetP._Url = "assets/img/sticker.png";
	
	stickerWidgetP.draw = function (layer)
	{
		var width = this.getWidth() * this.getScale();
		var height = this.getHeight() * this.getScale();
		var padding = this.getPadding() * this.getScale();

		var img = {
			Top: this.getTop(),
			Left: this.getLeft(),
			Width: width,
			Height: height,
			Angle: this.getAngle(),
			Url: this.getUrl()
		};

		var text = {
			Top: this.getTop() + padding,
			Left: this.getLeft() + padding,
			Width: width - 2 * padding,
			Height: height - 2 * padding,
			Angle: this.getAngle(),
			Text: this.getText(),
			Background: "rgba(0, 0, 0, 0)",
			FontSize: this.getFontSize() * this.getScale()
		};

		layer.drawImage(img);
		layer.drawText(text);
	};
	
	stickerWidgetP = null;
	
})();