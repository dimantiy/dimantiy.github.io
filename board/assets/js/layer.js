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

	layerP.drawImage = function (settings)
	{
		throw DP.Error.NotImplemented("drawImage");
	};

	layerP.drawText = function (settings)
	{
		throw DP.Error.NotImplemented("drawText");
	};

	layerP.removeShape = function (id)
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

			container.style.transform = "translate(" + left + "px, " + top + "px) scale(" + scale + ", " + scale + ")";
		}
	};

	domLayerP.clear = function ()
	{
		if (this._DomNode)
		{
			this._DomNode.innerHTML = "";
		}
	};

	domLayerP._createNode = function (content, settings)
	{
		$("<div />")
			.addClass("dp-dom-layer-shape")
			.addClass(settings.Id)
			.css(
				"transform",
				"translate(" + settings.Left + "px, " + settings.Top + "px) " +
				"scale(" + settings.Scale + ", " + settings.Scale + ") " +
				"rotate(" + settings.Angle + "deg) "
			)
			.append(content)
			.appendTo(this._DomNode);
	};

	domLayerP.drawText = function (settings)
	{
		this._createNode(
			$("<div />")
				.addClass("dp-dom-layer-widget")
				.html(settings.Text)
				.width(settings.Width)
				.height(settings.Height)
				.css("font-size", settings.FontSize)
				.css("margin-left", -settings.Width / 2 - settings.FontSize + "px")
				.css("margin-top", -settings.Height / 2 - settings.FontSize + "px")
				.css("padding", settings.FontSize)
				.css("background", settings.Background),
			settings
		);
	};

	domLayerP.drawImage = function (settings)
	{
		this._createNode(
			$("<img />")
				.attr("src", settings.Url)
				.addClass("dp-dom-layer-widget")
				.width(settings.Width)
				.height(settings.Height)
				.css("margin-left", -settings.Width / 2 + "px")
				.css("margin-top", -settings.Height / 2 + "px")
				.css("background", settings.Background),
			settings
		);
	};

	domLayerP.removeShape = function (id)
	{
		$(this.getDomNode()).remove("." + id);
	};

	domLayerP = null;

})();

(function ()
{
	"use strict";

	// Canvas Layer

	DP.CanvasLayer = function (settings)
	{
		DP.CanvasLayer.base.constructor.apply(this, arguments);
		this._ClassName = "dp-canvas-layer";
		this._shapes = [];
		this._redrawDelegate = this._redrawAll.bind(this);
	};

	DP.initClass(DP.CanvasLayer, DP.Layer);

	var canvasLayerP = DP.CanvasLayer.prototype;

	canvasLayerP._render = function ()
	{
		this.update();
	};

	canvasLayerP._getCanvas = function ()
	{
		if (!this._canvas)
		{
			var canvas = DP.createElement("dp-canvas-layer-canvas", "canvas");
			canvas.width = $(this._DomNode).width();
			canvas.height = $(this._DomNode).height();
			console.log($(this._DomNode).width());
			this._canvas = canvas;
			this._DomNode.appendChild(canvas);
		}
		return this._canvas;
	};

	canvasLayerP.update = function ()
	{
		if (this._DomNode)
		{
			this._clear();
			this._redrawAll();
		}
	};

	canvasLayerP.clear = function ()
	{
		if (this._DomNode)
		{
			this._DomNode.innerHTML = "";
			this._canvas = null;
		}
	};

	canvasLayerP._clear = function ()
	{
		if (this._DomNode)
		{
			var canvas = this._getCanvas();
			var context = canvas.getContext("2d");
			context.clearRect(0, 0, canvas.width, canvas.height);
		}
	};

	canvasLayerP._redrawAll = function ()
	{
		var shapes = this._shapes;
		var canvas = this._getCanvas();
		var context = canvas.getContext("2d");
		context.save();
		context.translate(this._Left, this._Top);
		context.scale(this._Scale, this._Scale);
		this._lastIndex = this._lastIndex || 0;
		for (var i = this._lastIndex; i < shapes.length; i++)
		{
			var settings = shapes[i];
			this._drawShape(settings, context);
		}
		context.restore();
		this._lastIndex = 0;
		this._redrawTimeout = null;
	};

	canvasLayerP._drawShape = function (settings, context)
	{
		context.save();

		context.translate(settings.Left, settings.Top);
		context.scale(settings.Scale, settings.Scale);
		context.rotate(settings.Angle);

		switch (settings.Type)
		{
			case DP.FigureType.Image:
				this._drawImage(settings, context);
				break;
			case DP.FigureType.Text:
				this._drawText(settings, context);
				break;
		}

		context.restore();
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

	canvasLayerP._drawText = function (settings, context)
	{
		var rowHeight = settings.FontSize;
		var rowCount = 1;
		var para = this._textToParagraph(settings.Text);

		var fs = settings.FontSize;
		var top = -settings.Height / 2;
		var left = -settings.Width / 2;
		var width = settings.Width;
		var height = settings.Height;

		context.fillStyle = settings.Background || "rgba(0,0,0,0)";
		context.fillRect(left, top, width, height);


		context.font = settings.FontSize + "px 'Helvetica Neue', Helvetica, Arial, sans-serif";
		for (var i = 0; i < para.length; i++)
		{
			var p = para[i];
			context.fillStyle = p.Color;
			var rows = this._splitRows(context, p.Text, width - 2 * fs);

			for (var j = 0; j < rows.length; j++)
			{
				context.fillText(rows[j], left + fs, top + fs * 0.85 + rowHeight * rowCount);
				rowCount++;
			}

			if (rows.length)
				rowCount++;
		}
	};

	canvasLayerP._drawImage = function (settings, context)
	{
		var image = new Image();
		image.src = settings.Url;
		context.drawImage(
			image,
			-settings.Width / 2,
			-settings.Height / 2,
			settings.Width,
			settings.Height);
	};

	canvasLayerP.drawText = function (settings)
	{
		settings.Type = DP.FigureType.Text;
		settings.Height += settings.FontSize * 2;
		settings.Width += settings.FontSize * 2;
		settings.Angle *= Math.PI / 180;
		this._shapes.push(settings);
		if (!this._redrawTimeout)
		{
			this._redrawTimeout = setTimeout(this._redrawDelegate, 0);
		}
	};

	canvasLayerP.drawImage = function (settings)
	{
		settings.Type = DP.FigureType.Image;
		settings.Angle *= Math.PI / 180;
		this._shapes.push(settings);
		if (!this._redrawTimeout)
		{
			this._redrawTimeout = setTimeout(this._redrawDelegate, 0);
		}
	};

	canvasLayerP = null;


})();