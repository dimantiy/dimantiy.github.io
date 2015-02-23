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
		//node.style.height = settings.Height + "px";
		node.style.transform = "scale(" + settings.Scale + ", " + settings.Scale + ")";
		this._DomNode.appendChild(node);
	};
	
	domLayerP.drawImage = function (settings)
	{
		var node = DP.createElement("dp-dom-layer-widget", "img");
		node.src = settings.Url;
		node.style.top = settings.Top + "px";
		node.style.left = settings.Left + "px";
		//node.style.width = settings.Width + "px";
		//node.style.height = settings.Height + "px";
		node.style.transform = "scale(" + settings.Scale + ", " + settings.Scale + ")";
		this._DomNode.appendChild(node);
	};
	
	domLayerP = null;
	
	// Canvas Layer
	
	DP.CanvasLayer = function (settings)
	{
		DP.CanvasLayer.base.constructor.apply(this, arguments);
		this._ClassName = "dp-canvas-layer";
		this._canvasTop = 0;
		this._canvasLeft = 0;
		this._canvasWidth = 0;
		this._canvasHeight = 0;
	};
	
	DP.initClass(DP.CanvasLayer, DP.Layer);
	
	var canvasLayerP = DP.CanvasLayer.prototype;
	
	canvasLayerP._getCanvas = function ()
	{
		if (!this._canvas)
		{
			this._canvas = DP.createElement("dp-canvas-layer-canvas", "canvas");
			this._canvas.width = this._canvasWidth;
			this._canvas.height = this._canvasHeight;
			this._canvas.style.top = this._canvasTop + "px";
			this._canvas.style.left = this._canvasLeft + "px";
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
			
			var canvas = this._getCanvas();
			canvas.style.top = this._canvasTop + "px";
			canvas.style.left = this._canvasLeft + "px";
		}
	};
	
	canvasLayerP.clear = function ()
	{
		if (this._DomNode)
		{
			
		}
	};
	
	canvasLayerP._reDrawCanvas = function (settings)
	{
		var top = Math.min(this._canvasTop, settings.Top);
		var left = Math.min(this._canvasLeft, settings.Left);
		var right = Math.max(this._canvasLeft + this._canvasWidth, settings.Left + settings.Width);
		var bottom = Math.max(this._canvasTop + this._canvasHeight, settings.Top + settings.Height);
		var width = right - left;
		var height = bottom - top;
		
		var dx = this._canvasLeft - left;
		var dy = this._canvasTop - top;
		
		var canvas = this._getCanvas();
		var tempCanvas = DP.createElement("dp-canvas-layer-canvas", "canvas");
		tempCanvas.width = width;
		tempCanvas.height = height;
		
		var tempContext = tempCanvas.getContext("2d");
		tempContext.drawImage(canvas, dx, dy);
		
		canvas.width = width;
		canvas.height = height;
		
		var context = canvas.getContext("2d");
		context.clearRect(0, 0, width, height);
		context.drawImage(tempCanvas, 0, 0);
		
		this._canvasTop = top;
		this._canvasLeft = left;
		this._canvasWidth = width;
		this._canvasHeight = height;
	};
	
	canvasLayerP.drawText = function (settings)
	{
		this._reDrawCanvas(settings);
		var canvas = this._getCanvas();
		var context = canvas.getContext("2d");
		context.fillStyle = "#000";
		context.font = "14px 'Helvetica Neue', Helvetica, Arial, sans-serif";
		//context.textBaseline = "bottom";
		context.fillText(settings.Text, settings.Left - this._canvasLeft, settings.Top - this._canvasTop + 15, settings.Width);
		this.update();
	};
	
	canvasLayerP.drawImage = function (settings)
	{
		this._reDrawCanvas(settings);
		var canvas = this._getCanvas();
		var context = canvas.getContext("2d");
		var image = new Image();
		image.src = settings.Url;
		context.drawImage(image, settings.Left - this._canvasLeft, settings.Top - this._canvasTop, settings.Width, settings.Height);
		this.update();
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