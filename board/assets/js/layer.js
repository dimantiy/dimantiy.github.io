/*
 * 
 * 
 * (c) Dmitriy Pankov 2015
 */
 
(function ()
{
	"use strict";
	
	DP.LayerType = {
		Dom: "Dom",
		Canvas: "Canvas"
	};
	
	// Abstract layer
	DP.Layer = function (settings)
	{
		this._Top = 0;
		this._Left = 0;
		this._Scale = 1.0;
		this._ParentNode = null;
		DP.Layer.base.constructor.apply(this, arguments);
	};
	
	DP.initClass(DP.Layer, DP.Control);
	
	var layerP = DP.Layer.prototype;
	
	layerP.clear = function ()
	{
		throw DP.Error.NotImplemented("clear");
	};
	
	layerP.update = function ()
	{
		throw DP.Error.NotImplemented("update");
	};
	
	layerP.drawImage = function (url, area)
	{
		throw DP.Error.NotImplemented("drawImage");
	};
	
	layerP.drawText = function (text, area)
	{
		throw DP.Error.NotImplemented("drawText");
	};
	
	layerP = null;
	
	// DOM Layer
	
	DP.DomLayer = function (settings)
	{
		DP.DomLayer.base.constructor.apply(this, arguments);
		this._ClassName = "dp-dom-layer";
	};
	
	DP.initClass(DP.DomLayer, DP.Layer);
	
	var domLayerP = DP.DomLayer.prototype;
	
	domLayerP._render = function ()
	{
		this.update();
	};
	
	domLayerP.update = function ()
	{
		if (this._DomNode)
		{
			var container = this.getDomNode();
			var scale = this.getScale();
			var left = this.getLeft();
			var top = this.getTop();
			
			container.style.transform = "scale(" + scale + ", " + scale + ")";
			container.style.left = left + "px";
			container.style.top = top + "px";
		}
	};
	
	domLayerP.clear = function ()
	{
		if (this._DomNode)
		{
			this._DomNode.innerHTML = "";
		}
	};
	
	domLayerP.drawText = function (settings)
	{
		var node = DP.createElement("dp-dom-layer-widget");
		node.innerHTML = settings.Text;
		node.style.top = settings.Top + "px";
		node.style.left = settings.Left + "px";
		node.style.width = settings.Width + "px";
		node.style.height = settings.Height + "px";
		this._DomNode.appendChild(node);
	};
	
	domLayerP.drawImage = function (settings)
	{
		var node = DP.createElement("dp-dom-layer-widget", "img");
		node.src = settings.Url;
		node.style.top = settings.Top + "px";
		node.style.left = settings.Left + "px";
		node.style.width = settings.Width + "px";
		node.style.height = settings.Height + "px";
		this._DomNode.appendChild(node);
	};
	
	domLayerP = null;
	
	// Canvas Layer
	
	DP.CanvasLayer = function (settings)
	{
		DP.CanvasLayer.base.constructor.apply(this, arguments);
		this._ClassName = "dp-canvas-layer";
		this._OffsetX = 0;
		this._OffsetY = 0;
	};
	
	DP.initClass(DP.CanvasLayer, DP.Layer);
	
	var canvasLayerP = DP.CanvasLayer.prototype;
	
	canvasLayerP._getCanvas = function ()
	{
		if (!this._canvas)
		{
			this._canvas = DP.createElement("dp-canvas-layer-canvas", "canvas");
		}
		return this._canvas;
	};
	
	canvasLayerP._render = function ()
	{
		this._DomNode.appendChild(this._getCanvas());
		
		this.update();
	};
	
	canvasLayerP.update = function ()
	{
		if (this._DomNode)
		{
			var container = this.getDomNode();
			var scale = this.getScale();
			var left = this.getLeft();
			var top = this.getTop();
			
			container.style.transform = "scale(" + scale + ", " + scale + ")";
			container.style.left = left + "px";
			container.style.top = top + "px";
		}
	};
	
	canvasLayerP.clear = function ()
	{
		if (this._DomNode)
		{
			
		}
	};
	
	canvasLayerP.drawText = function (settings)
	{
		// Создаем всеобъемлящий канвас
	};
	
	canvasLayerP.drawImage = function (settings)
	{
		
	};
	
	canvasLayerP = null;
	
	// Map Layer
	
	DP.MapLayer = function (settings)
	{
		DP.MapLayer.base.constructor.apply(this, arguments);
	};
	
	DP.initClass(DP.MapLayer, DP.Layer);
	
	var mapLayerP = DP.MapLayer.prototype;
	
	
	
	mapLayerP = null;
	
	
})();