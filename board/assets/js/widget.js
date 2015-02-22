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
		this._Url = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAgQAAAIEBHRF40wAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAInSURBVDiNdZHdS5NhGMZ/9/Nu05zmwIgiOhASFh11MNCcUhiNziOkTuvMKKkg1FUypZhZQUR0FvgnVBgdlG6YSEdR9LEoxI/IsNXUudz2vncHtqX47jp8rud3cd/3JapKSd1jvwOeKnNX0HZVRsXricVD/u8DiaZjInIOCKpyq6899bDESCng0tjyDsvnPFc4WE4UubObA72rxW3TwM7Ss0Ksry11FcAAXEyk9xqfk9wEA6iezhZrIhthAIHoYLLpHoh4+t/js7zWOEojW5UR1TTi4iBdg8l9S2b511JHBRiEecuxZly99Q9njKp8AYqutmp2DWelcgAfzXC4LqUQQXmGkAU+AS8Efaoqr/z56hzKY1RHFSYF5oA06G3B01lu4XIi04hHWnGcOfGaeaGYy+fMSsDbXON17F22Yc1yqFJhD1BdY/150t0ym5PrqiY7kRlB6ORfKxt2uFBfCEUQOe4y/k9BuszqZOYIwqktMPKttnjyHWJcOwAaQIeM2Lro5tpqnzVMx1AeVbqgKovmZjjwBtX7mwxhqMFu3i9IUEQrtZBVo90GIN4a6FLhxjrLlUAxtKiiMdBZW3CbMO0IHX3hz2PlvYda6ntE5VCdHfILnADyIjIcDaemFMb/n4YFR63D0XBqCsADEJ8I1uUdO7IdOQ+aAOl31JqJtn14C1C/opHlWjmKSrBg2SPXwqkf5byBRNNLYFVVXptC4UFPx9eFSkdz019xj+ntXgOvFgAAAABJRU5ErkJggg==";
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
		DP.StickerWidget.base.constructor.apply(this, arguments);
		this._Url = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAgQAAAIEBHRF40wAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAInSURBVDiNdZHdS5NhGMZ/9/Nu05zmwIgiOhASFh11MNCcUhiNziOkTuvMKKkg1FUypZhZQUR0FvgnVBgdlG6YSEdR9LEoxI/IsNXUudz2vncHtqX47jp8rud3cd/3JapKSd1jvwOeKnNX0HZVRsXricVD/u8DiaZjInIOCKpyq6899bDESCng0tjyDsvnPFc4WE4UubObA72rxW3TwM7Ss0Ksry11FcAAXEyk9xqfk9wEA6iezhZrIhthAIHoYLLpHoh4+t/js7zWOEojW5UR1TTi4iBdg8l9S2b511JHBRiEecuxZly99Q9njKp8AYqutmp2DWelcgAfzXC4LqUQQXmGkAU+AS8Efaoqr/z56hzKY1RHFSYF5oA06G3B01lu4XIi04hHWnGcOfGaeaGYy+fMSsDbXON17F22Yc1yqFJhD1BdY/150t0ym5PrqiY7kRlB6ORfKxt2uFBfCEUQOe4y/k9BuszqZOYIwqktMPKttnjyHWJcOwAaQIeM2Lro5tpqnzVMx1AeVbqgKovmZjjwBtX7mwxhqMFu3i9IUEQrtZBVo90GIN4a6FLhxjrLlUAxtKiiMdBZW3CbMO0IHX3hz2PlvYda6ntE5VCdHfILnADyIjIcDaemFMb/n4YFR63D0XBqCsADEJ8I1uUdO7IdOQ+aAOl31JqJtn14C1C/opHlWjmKSrBg2SPXwqkf5byBRNNLYFVVXptC4UFPx9eFSkdz019xj+ntXgOvFgAAAABJRU5ErkJggg==";
	};
	
	DP.initClass(DP.StickerWidget, DP.Widget);
	
	var stickerWidgetP = DP.StickerWidget.prototype;
	
	stickerWidgetP.draw = function (layer)
	{
		layer.drawImage(this.getSettings());
		layer.drawText(this.getSettings());
	};
	
	stickerWidgetP = null;
	
	
})();