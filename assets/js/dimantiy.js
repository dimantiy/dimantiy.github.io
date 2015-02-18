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
		var bound = state.Bound;
		var value = items[index];
		var chain = state.Chain || [];
		
		if (!bound) return;
		if (!value) return;
		if (value > bound) return;
		if (value == bound)
		{
			chain.push(value);
			result.push(this._clone(chain));
			return;
		}
		if (value < bound)
		{
			chain.push(value);
			bound -= value;
			for (var i = index + 1; i < items.length; i++)
			{
				if (items[i] > bound) break;
				
				this._findCombo({
					Index: i,
					Items: items,
					Bound: bound,
					Chain: chain
				}, result);
			}
			chain.pop();
			return;
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
