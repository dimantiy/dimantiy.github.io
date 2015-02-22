/*
 * 
 * 
 * (c) Dmitriy Pankov 2015
 */
 
(function ()
{
	"use strict";
	
	var app = {};
	
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
		
		$("#id-dp-search-form").submit(function () {
			var text = $("#id-dp-search-input").val();
			app.Board.search(text);
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
	});
	
})();