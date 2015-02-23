/*
 * 
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
		this._Scale = 1.0;
		this._Width = 100;
		this._Height = 100;
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
	
	DP.TextWidget = function (settings)
	{
		this._Text = "Widget";
		DP.TextWidget.base.constructor.apply(this, arguments);
	};
	
	DP.initClass(DP.TextWidget, DP.Widget);
	
	var textWidgetP = DP.TextWidget.prototype;
	
	textWidgetP.draw = function (layer)
	{
		layer.drawText(this.getSettings());
	};
	
	textWidgetP = null;
	
	DP.ImageWidget = function (settings)
	{
		this._Url = "assets/img/sticker.png";
		DP.ImageWidget.base.constructor.apply(this, arguments);
	};
	
	DP.initClass(DP.ImageWidget, DP.Widget);
	
	var imageWidgetP = DP.ImageWidget.prototype;
	
	imageWidgetP.draw = function (layer)
	{
		layer.drawImage(this.getSettings());
	};
	
	imageWidgetP = null;
	
	DP.StickerWidget = function (settings)
	{
		this._Text = "Sticker";
		this._Padding = 20;
		DP.StickerWidget.base.constructor.apply(this, arguments);
		this._Url = "assets/img/sticker.png";
	};
	
	DP.initClass(DP.StickerWidget, DP.Widget);
	
	var stickerWidgetP = DP.StickerWidget.prototype;
	
	stickerWidgetP.draw = function (layer)
	{
		layer.drawImage(this.getSettings());
		var textSettings = this.getSettings()
		textSettings.Top += this._Padding;
		textSettings.Left += this._Padding;
		textSettings.Width -= this._Padding * 2;
		textSettings.Height -= this._Padding * 2;
		layer.drawText(textSettings);
	};
	
	stickerWidgetP = null;
	
	
})();