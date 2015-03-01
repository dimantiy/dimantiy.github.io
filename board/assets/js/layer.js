/*
 * Different kinds of layers
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

})();

(function ()
{
	"use strict";

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
		node.style.fontSize = settings.FontSize + "px";
		node.style.width = settings.Width + "px";
		node.style.left = settings.Left - settings.Width / 2 - settings.FontSize + "px";
		node.style.background = settings.Background;
		node.style.padding = settings.FontSize + "px";
		if (settings.Height)
			node.style.height = settings.Height + "px";
		node.style.transform = "rotate(" + settings.Angle + "deg)";
		this._DomNode.appendChild(node);
		node.style.top = settings.Top - $(node).height() / 2 - settings.FontSize + "px";
	};

	domLayerP.drawImage = function (settings)
	{
		var node = DP.createElement("dp-dom-layer-widget", "img");
		node.src = settings.Url;
		node.style.top = settings.Top - settings.Height / 2 + "px";
		node.style.left = settings.Left - settings.Width / 2 + "px";
		node.style.width = settings.Width + "px";
		node.style.height = settings.Height + "px";
		node.style.transform = "rotate(" + settings.Angle + "deg)";
		this._DomNode.appendChild(node);
	};

	domLayerP = null;

})();

(function ()
{
	"use strict";

	// Canvas Layer

	DP.CanvasLayer = function (settings)
	{
		this._TileWidth = 500;
		this._TileHeight = 500;
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
		var width = settings.Width;
		var height = settings.Height;
		var cx = settings.Left + width / 2;
		var cy = settings.Top + height / 2;
		var r = Math.sqrt(width * width + height * height) / 2;

		var rowBegin = Math.floor((cy - r) / this._TileHeight);
		var colBegin = Math.floor((cx - r) / this._TileWidth);
		var rowEnd = Math.floor((cy + r) / this._TileHeight);
		var colEnd = Math.floor((cx + r) / this._TileWidth);

		for (var row = rowBegin; row <= rowEnd; row++)
		{
			for (var col = colBegin; col <= colEnd; col++)
			{
				var offsetX = col * this.getTileWidth();
				var offsetY = row * this.getTileHeight();
				var canvas = this._getTile(row, col);
				var context = canvas.getContext("2d");

				context.save();
				context.translate(-offsetX, -offsetY);
				context.translate(cx, cy);
				context.rotate(settings.Angle);

				switch (settings.Type)
				{
					case DP.FigureType.Image:
						this._drawImage(settings, cx, cy, context);
						break;
					case DP.FigureType.Text:
						this._drawText(settings, cx, cy, context);
						break;
				}

				context.restore();

			}
		}
	};

	canvasLayerP._parseColor = function (text)
	{
		var reg = /#[0-9a-f]{6}/gi;
		var color = reg.exec(text) || ["#000000"];
		return color[0];
	};

	canvasLayerP._clearText = function (text)
	{
		return text.replace(/<[^>]*>/gi, "");
	};

	canvasLayerP._textToParagraph = function (text)
	{
		var paragraphs = [];
		var pText = text.split("</P>");
		for (var i = 0; i < pText.length; i++)
		{
			var p = pText[i];
			paragraphs.push({
				Color: this._parseColor(p),
				Text: this._clearText(p)
			});
		}
		return paragraphs;
	};

	canvasLayerP._getRow = function (context, words, width)
	{
		if (words.length === 0)
			return "";

		var row = words.shift();

		while (words.length)
		{
			var t = row + " " + words[0];
			if (context.measureText(t).width <= width)
			{
				row = t;
				words.shift();
			}
			else
			{
				break;
			}
		}

		return row;
	};

	canvasLayerP._splitRows = function (context, text, width)
	{
		var rows = [];
		var words = text.split(" ");
		var row = "";
		while (row = this._getRow(context, words, width))
		{
			rows.push(row);
		}
		return rows;
	};

	canvasLayerP._drawText = function (settings, offsetX, offsetY, context)
	{
		var rowHeight = settings.FontSize;
		var rowCount = 1;
		var para = this._textToParagraph(settings.Text);

		var fs = settings.FontSize;
		var top = settings.Top - offsetY;
		var left = settings.Left - offsetX;
		var width = settings.Width;
		var height = settings.Height;

		context.fillStyle = settings.Background;
		context.fillRect(left, top, width, height);


		context.font = settings.FontSize + "px 'Helvetica Neue', Helvetica, Arial, sans-serif";
		for (var i = 0; i < para.length; i++)
		{
			var p = para[i];
			context.fillStyle = p.Color;
			var rows = this._splitRows(context, p.Text, width - 2 * fs);

			for (var j = 0; j < rows.length; j++)
			{
				context.fillText(rows[j], left + fs, top + fs + rowHeight * rowCount);
				rowCount++;
			}

			if (rows.length)
				rowCount++;
		}
	};

	canvasLayerP._drawImage = function (settings, offsetX, offsetY, context)
	{
		var image = new Image();
		image.src = settings.Url;
		context.drawImage(
			image,
			settings.Left - offsetX,
			settings.Top - offsetY,
			settings.Width,
			settings.Height);
	};

	canvasLayerP.drawText = function (settings)
	{
		settings.Type = DP.FigureType.Text;
		settings.Height += settings.FontSize * 2;
		settings.Width += settings.FontSize * 2;
		settings.Left -= settings.Width / 2;
		settings.Top -= settings.Height / 2;
		settings.Angle *= Math.PI / 180;
		this._shapes.push(settings);
		if (!this._redrawTimeout)
		{
			this._redrawTimeout = setTimeout(this._redrawAll.bind(this), 0);
		}
	};

	canvasLayerP.drawImage = function (settings)
	{
		settings.Type = DP.FigureType.Image;
		settings.Left -= settings.Width / 2;
		settings.Top -= settings.Height / 2;
		settings.Angle *= Math.PI / 180;
		this._shapes.push(settings);
		if (!this._redrawTimeout)
		{
			this._redrawTimeout = setTimeout(this._redrawAll.bind(this), 0);
		}
	};

	canvasLayerP = null;


})();