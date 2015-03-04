/*
 * Board for display widgets
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
		this._Widgets = [];
		this._SelectedIndex = -1;
		this._StartDragTimeout = 500;
		DP.Board.base.constructor.apply(this, arguments);
		this._ClassName = "dp-board";
		this._Layers = [];
		this._dragIndex = -1;
		this._dragDx = 0;
		this._dragDy = 0;
	};

	DP.initClass(DP.Board, DP.Control);

	DP.Board.ZOOM_IN = 10 / 9;
	DP.Board.ZOOM_OUT = 9 / 10;

	var boardP = DP.Board.prototype;

	boardP.getWidth = function ()
	{
		return $(this._DomNode).width();
	};

	boardP.getHeight = function ()
	{
		return $(this._DomNode).height();
	};

	boardP._getLayerContainer = function ()
	{
		if (!this._layerContainer)
		{
			this._layerContainer = DP.createElement("dp-board-layer-container");
		}
		return this._layerContainer;
	};

	boardP._getMapContainer = function ()
	{
		if (!this._mapContainer)
		{
			this._mapContainer = DP.createElement("dp-board-layer-map");
		}
		return this._mapContainer;
	};

	boardP._getEventFacade = function ()
	{
		if (!this._eventFacade)
		{
			this._eventFacade = DP.createElement("dp-board-event-facade");
			$(this._eventFacade)
				.mousewheel(this._onMouseWheel.bind(this))
				.mousedown(this._onMouseDown.bind(this))
				.mousemove(this._onMouseMove.bind(this))
				.mouseup(this._onMouseUp.bind(this));
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
		this._runDragTimeout();
	};

	boardP._runDragTimeout = function ()
	{
		this._clearDragTimeout();
		this._dragTimeout = setTimeout(this._startDrag.bind(this), this._StartDragTimeout);
	};

	boardP._clearDragTimeout = function ()
	{
		if (this._dragTimeout)
		{
			clearTimeout(this._dragTimeout);
			this._dragTimeout = null;
		}
	};

	boardP._needDrag = function ()
	{
		return this._dragIndex >= 0;
	};

	boardP._toBoardCoord = function (mp)
	{
		var bp = {
			X: (mp.X - this.getLeft()) / this.getScale(),
			Y: (mp.Y - this.getTop()) / this.getScale()
		};
		return bp;
	};

	boardP._startDrag = function ()
	{
		if (this._mousePosition)
		{
			var pos = this._toBoardCoord(this._mousePosition);
			this._dragIndex = this._getWidgetIndexByXY(pos.X, pos.Y);
			if (this._dragIndex >= 0)
			{
				this._dragDx = 0;
				this._dragDy = 0;
				var widget = this._Widgets[this._dragIndex];
				widget.draw(this._selectLayer);
				this._mainLayer.getDomNode().style.opacity = 0.5;
				this.update();
			}
		}
	};

	boardP._endDrag = function ()
	{
		if (this._needDrag())
		{
			var widget = this._Widgets[this._dragIndex];
			widget.setTop(widget.getTop() + this._dragDy / this.getScale());
			widget.setLeft(widget.getLeft() + this._dragDx / this.getScale());
			this._dragIndex = -1;
			this._selectLayer.clear();
			this._mainLayer.getDomNode().style.opacity = 1;
			this._renderLayers();
		}
	};

	boardP._onMouseMove = function (event)
	{
		this._clearDragTimeout();
		if (this._startPosition)
		{
			var dx = event.pageX - this._mousePosition.X;
			var dy = event.pageY - this._mousePosition.Y;
			if (this._needDrag())
			{
				this._dragDx = dx;
				this._dragDy = dy;
				this.update();
			}
			else
			{
				this._Left = this._startPosition.X + dx;
				this._Top = this._startPosition.Y + dy;
				this.update();
			}
		}
	};

	boardP._onMouseUp = function (event)
	{
		this._startPosition = null;
		this._mousePosition = null;
		this._clearDragTimeout();
		this._endDrag();
	};

	boardP._onMouseWheel = function (event)
	{
		var delta = event.originalEvent.wheelDelta;
		var x = event.pageX;
		var y = event.pageY;
		var s = delta < 0 ? DP.Board.ZOOM_OUT : delta > 0 ? DP.Board.ZOOM_IN : 1;

		this._zoom(x, y, s);
	};

	boardP._getWidgetIndexByXY = function (x, y)
	{
		var widgets = this._Widgets;
		for (var i = 0; i < widgets.length; i++)
		{
			var w = widgets[i];
			if (w.checkOver(x, y))
			{
				return i;
			}
		}
		return -1;
	};

	boardP._render = function ()
	{
		this._DomNode.appendChild(this._getLayerContainer());
		this._DomNode.appendChild(this._getEventFacade());
		this._DomNode.appendChild(this._getMapContainer());

		this._renderLayers();
	};

	boardP._renderLayers = function ()
	{
		var layerContainer = this._getLayerContainer();
		var mapContainer = this._getMapContainer();

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

		this._mapLayer = new DP.MapLayer({ Board: this });
		this._mapLayer.render(mapContainer);
		this._Layers.push(this._mapLayer);

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
			if (layers[i] === this._selectLayer)
			{
				layers[i].setTop(this.getTop() + this._dragDy);
				layers[i].setLeft(this.getLeft() + this._dragDx);
			}
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
			widgets[i].draw(this._mainLayer);
			widgets[i].draw(this._mapLayer);
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
		this._Scale = Math.min(100, Math.max(0.01, value));
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
		var centerY = height / 2;

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
			bottom = Math.max(bottom, w.getTop());
		}

		var dx = right - left || width;
		var dy = bottom - top || height;

		var scale = Math.max(width / dx, height / dy);

		this.setScale(scale);

		scale = this.getScale();

		this.setTop(-top * scale);
		this.setLeft(-left * scale);

		this.update();
	};

	boardP.setWidgets = function (value)
	{
		this._Widgets = value;
		this._fillLayers();
	};

	boardP = null;

})();