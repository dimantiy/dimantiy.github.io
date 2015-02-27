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
	
	DP.FigureType = {
		Image: "Image",
		Text: "Text"
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
		node.style.top = settings.Top + node.height * (settings.Scale - 1) / 2 + "px";
		node.style.left = settings.Left + node.width * (settings.Scale - 1) / 2 + "px";
		//node.style.width = settings.Width + "px";
		//node.style.height = settings.Height + "px";
		node.style.transform = "scale(" + settings.Scale + ", " + settings.Scale + ")";
		this._DomNode.appendChild(node);
	};
	
	domLayerP = null;
	
	// Canvas Layer
	
	DP.CanvasLayer = function (settings)
	{
		this._TileWidth = 400;
		this._TileHeight = 400;
		DP.CanvasLayer.base.constructor.apply(this, arguments);
		this._ClassName = "dp-canvas-layer";
		this._tiles = {};
		this._shapes = [];
		this._redrawCollection = [];
	};
	
	DP.initClass(DP.CanvasLayer, DP.Layer);
	
	var canvasLayerP = DP.CanvasLayer.prototype;
	
	canvasLayerP._render = function ()
	{
		this.update();
	};
	
	canvasLayerP._getTile = function (row, col)
	{
		var tiles = this._tiles;
		this._tiles[row] = this._tiles[row] || {};
		if (!this._tiles[row][col])
		{
			var tile = DP.createElement("dp-canvas-layer-tile", "canvas");
			tile.width = this._TileWidth;
			tile.height = this._TileHeight;
			tile.style.top = row * this._TileHeight + "px";
			tile.style.left = col * this._TileWidth + "px";
			this._DomNode.appendChild(tile);
			this._tiles[row][col] = tile;
		}
		return this._tiles[row][col];
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
			this._shapes = [];
			this._tiles = {};
			this._DomNode.innerHTML = "";
		}
	};
	
	canvasLayerP._redrawAll = function ()
	{
		var shapes = this._shapes;
		var tiles = this._tiles;
		
		for (var y in tiles)
		{
			var row = tiles[y];
			for (var x in row)
			{
				var tile = row[x];
				var context = tile.getContext('2d');
				context.clearRect(0, 0, this._TileWidth, this._TileHeight);
			}
		}
		
		for (var i = 0; i < shapes.length; i++)
		{
			var settings = shapes[i];
			this._drawShape(settings);
		}
		
		this._redrawTimeout = null;
	};
	
	canvasLayerP._drawShape = function (settings)
	{
		var rowBegin = Math.floor(settings.Top / this._TileHeight);
		var colBegin = Math.floor(settings.Left / this._TileWidth);
		var rowEnd = Math.floor((settings.Top + settings.Height) / this._TileHeight);
		var colEnd = Math.floor((settings.Left + settings.Width) / this._TileWidth);
		for (var row = rowBegin; row <= rowEnd; row++)
		{
			for (var col = colBegin; col <= colEnd; col++)
			{
				var tile = this._getTile(row, col);
				var left = settings.Left - col * this._TileWidth;
				var top = settings.Top - row * this._TileHeight;
				switch (settings.Type)
				{
					case DP.FigureType.Image:
						this._drawImage(tile, settings, left, top);
						break;
					case DP.FigureType.Text:
						this._drawText(tile, settings, left, top);
						break;
				}
			}
		}
	};
	
	canvasLayerP._drawText = function (canvas, settings, left, top)
	{
		var context = canvas.getContext("2d");
		context.fillStyle = "#000";
		context.font = "14px 'Helvetica Neue', Helvetica, Arial, sans-serif";
		var maxWidth = settings.Width;
		var rowHeight = 14;
		var rowCount = 1;
		var para = settings.Text.split("</P>");
		
		for (var j = 0; j < para.length; j++)
		{
			var p = para[j];
			var words = p.replace(/<[^>]*>/gi, "").split(" ");
			var rowText = words[0];
			
			for (var i = 1; i < words.length; i++)
			{
				if (context.measureText(rowText + " " + words[i]).width < maxWidth)
				{
					rowText += " " + words[i];
				}
				else
				{
					context.fillText(rowText, left, top + rowCount * rowHeight);
					rowCount++;
					rowText = words[i];
				}
			}
			
			context.fillText(rowText, left, top + rowCount * rowHeight);
			rowCount++;
		}
	};
	
	canvasLayerP._drawImage = function (canvas, settings, left, top)
	{
		var context = canvas.getContext("2d");
		var image = new Image();
		image.src = settings.Url;
		context.drawImage(image, left, top, settings.Width, settings.Height);
	};
	
	canvasLayerP.drawText = function (settings)
	{
		settings.Type = DP.FigureType.Text;
		settings.Height = 1000;
		this._shapes.push(settings);
		if (!this._redrawTimeout)
		{
			this._redrawTimeout = setTimeout(this._redrawAll.bind(this), 0);
		}
	};
	
	canvasLayerP.drawImage = function (settings)
	{
		settings.Type = DP.FigureType.Image;
		this._shapes.push(settings);
		if (!this._redrawTimeout)
		{
			this._redrawTimeout = setTimeout(this._redrawAll.bind(this), 0);
		}
	};
	
	canvasLayerP = null;
	
	
})();