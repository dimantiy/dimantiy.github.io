(function () {
	"use strict";
	
	var DP = window.DP = {}; // Dmitry Pankov namespace
	
	DP.Combinator = function (settings) {
		this._Sum = settings.Sum || 0;
	};
	
	var combinatorP = DP.Combinator.prototype;
	
	combinatorP._sort = function (a, b)
	{
		return a - b;
	};
	
	combinatorP._filterPos = function (a)
	{
		return a > 0;
	};
	
	combinatorP._filterNeg = function (a)
	{
		return a < 0;
	};
	
	combinatorP._findCombo
	
	combinatorP.run = function (arr)
	{
		// Splitting
		var positive = arr.filter(this._filterPos);
		var negative = arr.filter(this._filterNeg);
		
		// Sorting
		positive.sort(this._sort);
		negative.sort(this._sort).reverse();
		
		
		
		return [positive, negative];
	};
	
	combinatorP = null;
	
})();