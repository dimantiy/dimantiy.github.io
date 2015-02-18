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
	
	combinatorP._reduceSum = function (p, n)
	{
		return p + n;
	};
	
	combinatorP._filterPos = function (a)
	{
		return a > 0;
	};
	
	combinatorP._filterNeg = function (a)
	{
		return a < 0;
	};
	
	combinatorP._findCombo = function (sum, arr, index)
	{
		index = index || 0;
		var res = null;
		
		
		
		return res;
	};
	
	combinatorP.run = function (arr)
	{
		// Check arguments
		arr = arr || [];
		
		// Splitting
		var positive = arr.filter(this._filterPos);
		var negative = arr.filter(this._filterNeg);
		var sumPos = positive.length ? positive.reduce(this._reduceSum) : 0;
		var sumNeg = negative.length ? negative.reduce(this._reduceSum) : 0;
		
		// Sorting
		positive.sort(this._sort);
		negative.sort(this._sort).reverse();
		
		// Main loop
		
		
		return [positive, negative];
	};
	
	combinatorP = null;
	
})();
