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
		this._Width = 0;
		this._Height = 0;
		this._Scale = 1.0;
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
	
	DP.TextWidget = function (settings)
	{
		this._Text = "Widget";
		this._FontSize = 14;
		this._Width = 100;
		DP.TextWidget.base.constructor.apply(this, arguments);
		this.Loaded.fire();
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
		layer.drawImage(this.getSettings());
	};
	
	imageWidgetP = null;
	
	DP.StickerWidget = function (settings)
	{
		this._Text = "Sticker";
		this._Padding = 20;
		DP.StickerWidget.base.constructor.apply(this, arguments);
	};
	
	DP.initClass(DP.StickerWidget, DP.ImageWidget);
	
	var stickerWidgetP = DP.StickerWidget.prototype;
		
	stickerWidgetP._Url = "assets/img/sticker.png";
	
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