/*
 * 
 * 
 * (c) Dmitriy Pankov 2015
 */
 
(function ()
{
	"use strict";
	
	DP.Board = function (settings)
	{
		this._Top = 0;
		this._Left = 0;
		this._Scale = 1.0;
		this._LayerType = DP.LayerType.Dom;
		this._Widgets = [new DP.StickerWidget(), new DP.ImageWidget({Left: 180, Top: 180, Width: 20, Height: 20})];
		this._SelectedIndex = -1;
		DP.Board.base.constructor.apply(this, arguments);
		this._ClassName = "dp-board";
		this._Layers = [];
	};
	
	DP.initClass(DP.Board, DP.Control);
	
	DP.Board.ZOOM_IN = 10 / 9;
	DP.Board.ZOOM_OUT = 9 / 10;
	
	var boardP = DP.Board.prototype;
	
	boardP._getLayerContainer = function ()
	{
		if (!this._layerContainer)
		{
			this._layerContainer = DP.createElement("dp-board-layer-container");
		}
		return this._layerContainer;
	};
	
	boardP._getEventFacade = function ()
	{
		if (!this._eventFacade)
		{
			this._eventFacade = DP.createElement("dp-board-event-facade");
			$(this._eventFacade).mousewheel(this._onMouseWheel.bind(this));
			$(this._eventFacade).mousedown(this._onMouseDown.bind(this));
			$(this._eventFacade).mousemove(this._onMouseMove.bind(this));
			$(this._eventFacade).mouseup(this._onMouseUp.bind(this));
		}
		return this._eventFacade;
	};
	
	boardP._onMouseDown = function (event)
	{
		this._startPosition = { X: this._Left, Y: this._Top };
		this._mousePosition = {
			X: event.pageX,
			Y: event.pageY
		};
	};
	
	boardP._onMouseMove = function (event)
	{
		if (this._startPosition)
		{
			var dx = event.pageX - this._mousePosition.X;
			var dy = event.pageY - this._mousePosition.Y;
			this._Left = this._startPosition.X + dx;
			this._Top = this._startPosition.Y + dy;
			this.update();
		}
	};
	
	boardP._onMouseUp = function (event)
	{
		this._startPosition = null;
		this._mousePosition = null;
	};
	
	boardP._onMouseWheel = function (event)
	{
		var delta = event.originalEvent.wheelDelta;
		var x = event.pageX;
		var y = event.pageY;
		var s = delta < 0 ? DP.Board.ZOOM_OUT : delta > 0 ? DP.Board.ZOOM_IN : 1;
		
		this._zoom(x, y, s);
	};
	
	boardP._render = function ()
	{
		this._DomNode.appendChild(this._getLayerContainer());
		this._DomNode.appendChild(this._getEventFacade());
		
		this._renderLayers();
	};
	
	boardP._renderLayers = function ()
	{
		var layerContainer = this._getLayerContainer();
		
		for (var i = 0; i < this._Layers.length; i++)
		{
			this._Layers[i].clear();
			this._Layers[i].render(null);
		}
		
		this._mainLayer = this._createLayer();
		this._mainLayer.render(layerContainer);
		this._Layers.push(this._mainLayer);
		
		this._selectLayer = this._createLayer();
		this._selectLayer.render(layerContainer);
		this._Layers.push(this._selectLayer);
		
		this._fillLayers();
		this._updateLayers();
	};
	
	boardP._updateLayers = function ()
	{
		var layers = this._Layers;
		for (var i = 0; i < layers.length; i++)
		{
			layers[i].setTop(this._Top);
			layers[i].setLeft(this._Left);
			layers[i].setScale(this._Scale);
			layers[i].update();
		}
	};
	
	boardP._fillLayers = function ()
	{
		var widgets = this._Widgets;
		
		this._mainLayer.clear();
		this._selectLayer.clear();
		
		for (var i = 0; i < widgets.length; i++)
		{
			if (i === this._SelectedIndex)
			{
				widgets[i].draw(this._selectLayer);
			}
			else
			{
				widgets[i].draw(this._mainLayer);
			}
		}
	};
	
	boardP._createLayer = function (settings)
	{
		switch (this._LayerType)
		{
			case DP.LayerType.Dom:
				return new DP.DomLayer(settings);
				break;
			case DP.LayerType.Canvas:
				return new DP.CanvasLayer(settings);
				break;
		}
	};
	
	boardP.setScale = function (value)
	{
		this._Scale = Math.min(10, Math.max(0.1, value));
	};
	
	boardP.setLayerType = function (value)
	{
		if (this.getLayerType() !== value)
		{
			this._LayerType = value;
			this._renderLayers();
		}
	};
	
	boardP.update = function ()
	{
		this._updateLayers();
	};
	
	boardP._zoom = function (x, y, s)
	{
		var top = this.getTop();
		var left = this.getLeft();
		var scale = this.getScale();
		
		var dy = y - top;
		var dx = x - left;
		
		this.setScale(scale * s);
		s = this.getScale() / scale;
		
		top = y - dy * s;
		left = x - dx * s;
		
		this.setTop(top);
		this.setLeft(left);
		
		this.update();
		
	};
	
	boardP.zoomIn = function ()
	{
		var x = $(this._DomNode).width() / 2;
		var y = $(this._DomNode).height() / 2;
		var s = DP.Board.ZOOM_IN;
		
		this._zoom(x, y, s);
	};
	
	boardP.zoomOut = function (x, y)
	{
		var x = $(this._DomNode).width() / 2;
		var y = $(this._DomNode).height() / 2;
		var s = DP.Board.ZOOM_OUT;
		
		this._zoom(x, y, s);
	};
	
	boardP.minimize = function ()
	{
		var widgets = this._Widgets;
		
		if (!widgets.length) return;
		
		var width = $(this._DomNode).width();
		var height = $(this._DomNode).height();
		var centerX = width / 2;
		var centerY = width / 2;
		
		var top = Infinity;
		var left = Infinity;
		var right = -Infinity;
		var bottom = -Infinity;
		
		for (var i = 0; i < widgets.length; i++)
		{
			var w = widgets[i];
			top = Math.min(top, w.getTop());
			left = Math.min(left, w.getLeft());
			right = Math.max(right, w.getRight());
			bottom = Math.max(bottom, w.getBottom());
		}
		
		var dx = right - left;
		var dy = bottom - top;
		
		var scale = Math.min(width / dx, height / dy);
		
		this.setTop((height - dy * scale) / 2);
		this.setLeft((width - dx * scale) / 2);
		this.setScale(scale);
		
		this.update();
	};
	
	boardP.search = function (text)
	{
		
		this.update();
	};
	
	boardP = null;
	
})();