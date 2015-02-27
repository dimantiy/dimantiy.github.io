/*
 * 
 * 
 * (c) Dmitriy Pankov 2015
 */
 
(function ()
{
	"use strict";
	
	var app = window.app = {};
	
	app.Board = new DP.Board();
	
	$(function () {
		app.Board.render($(".dp-board-container")[0]);
		
		$("#id-dp-zoom-in").click(function () {
			app.Board.zoomIn();
		});
		
		$("#id-dp-zoom-out").click(function () {
			app.Board.zoomOut();
		});
		
		$("#id-dp-minimize").click(function () {
			app.Board.minimize();
		});
		
		var btnDom = $("#id-dp-dom");
		var btnCanvas = $("#id-dp-canvas");
		
		var updateLayerTypeButtons = function ()
		{
			var layerType = app.Board.getLayerType();
			
			btnDom.removeClass("active");
			btnCanvas.removeClass("active");
			
			switch (layerType)
			{
				case DP.LayerType.Dom:
					btnDom.addClass("active");
					break;
				case DP.LayerType.Canvas:
					btnCanvas.addClass("active");
					break;
			}
		};
		
		btnDom.click(function () {
			app.Board.setLayerType(DP.LayerType.Dom);
			updateLayerTypeButtons();
		});
		
		btnCanvas.click(function () {
			app.Board.setLayerType(DP.LayerType.Canvas);
			updateLayerTypeButtons();
		});
		
		updateLayerTypeButtons();
		app.Board.minimize();
		
		app.loadedWidgets = 0;
		app.widgets = [];
		app.onWidgetLoaded = function ()
		{
			app.loadedWidgets--;
			if (app.loadedWidgets === 0)
			{
				app.Board.setWidgets(app.widgets);
				updateLayerTypeButtons();
				app.Board.minimize();
			}
		};
		
		$.ajax({
			type: "GET",
			url: "http://api.realtimeboard.com/objects/74254402",
			success: function (data)
			{
				var widgets = app.widgets;
				app.loadedWidgets = data.widgets.length;
				for (var i = 0; i < data.widgets.length; i++)
				{
					// widgets.push(new DP.TextWidget({
						// Text: "asdf asdf asdf asd fasd fasdf asdf asd fasd asdf\r\nasd asd fasdf asd asd fasdf asd asdf asdf asdf asd fasdf asd fasdf adsf asdf",
						// Height: 1000,
						// Width: 50
					// }));
					// break;
					var w = data.widgets[i];
					switch (w.type)
					{
						case 1: // Images
							widgets.push(new DP.ImageWidget({
								Loaded: app.onWidgetLoaded,
								Scale: w.scale || 1,
								Top: w.y,
								Left: w.x,
								Width: w.width || 100,
								Height: w.height || 100,
								Url: w.url
							}));
							break;
						case 4: // Text
							widgets.push(new DP.TextWidget({
								Loaded: app.onWidgetLoaded,
								Scale: w.scale || 1,
								Top: w.y,
								Left: w.x,
								Width: w.width || 100,
								Height: w.height || 1000,
								Text: w.text.split("<F ").join("<FONT ")
							}));
							break;
						case 5: // Sticker
							widgets.push(new DP.StickerWidget({
								Loaded: app.onWidgetLoaded,
								Scale: w.scale || 1,
								Top: w.y,
								Left: w.x,
								Width: w.width || 200,
								Height: w.height || 200,
								Text: w.text
							}));
							break;
					}
				}
			},
			error: function (data)
			{
				console.log("Cann't connect to server");
			}
		});
	});
	
})();