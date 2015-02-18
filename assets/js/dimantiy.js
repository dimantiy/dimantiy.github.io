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
	
	combinatorP._clone = function (a)
	{
		return JSON.parse(JSON.stringify(a));
	};
	
	combinatorP._findCombo = function (state, result)
	{
		var index = state.Index || 0;
		var items = state.Items || [];
		var bound = state.Bound || 0;
		var chain = state.Chain || [];
		
		for (var i = index; i < items.length; i++)
		{
			var value = items[i];
			if (value > bound) break;
			if (value == bound)
			{
				chain.push(value);
				result.push(this._clone(chain));
				chain.pop();
			}
			if (value < bound)
			{
				chain.push(value);
				this._findCombo({
					Index: i + 1,
					Items: items,
					Bound: bound - value,
					Chain: chain
				}, result);
				chain.pop();
			}
		}
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
		var result = [];
		
		this._findCombo({
			Index: 0,
			Items: positive,
			Bound: this._Sum,
			Chain: []
		}, result);
		
		return result;
	};
	
	combinatorP = null;
	
})();
