(function ()
{
	"use strict";
	
	///
	/// Инициализация пространства имен
	///
	var DP = window.DP = window.DP || {};
	
	///
	/// Класс для хранения состояния игры
	///
	DP.Game = function (settings)
	{
		settings = settings || {};
		
		this._Symbols = settings.Symbols || this._Symbols;
		this._Length = settings.Length || this._Length;
		
		accept(typeof this._Symbols === "string", "Символы должны быть представлены строкой");
		accept(this._validateUnique(this._Symbols), "Символы должны быть уникальны");
		accept(typeof this._Length === "number", "Длина должна быть числом");
		accept(this._Length <= this._Symbols.length, "Длина должна быть не более количества символов");
		accept(this._Length > 0, "Длина должна быть положительным числом");
		
		// Инициализация приватных переменных
		this._symbols = {};
		var symbols = this._Symbols.split('');
		var i = symbols.length;
		while (i--)
		{
			var s = symbols[i];
			this._symbols[s] = s;
		}
	};
	
	var gameP = DP.Game.prototype;
	
	gameP._Symbols = '123456789';
	gameP._Length = 4;
	
	gameP.validate = function (number)
	{
		var result = true;
		result = result
			&& accept(typeof number === "string", "Число не определено")
			&& accept(number.length >= this._Length, "Длина числа меньше необходимой")
			&& accept(number.length <= this._Length, "Длина числа больше необходимой")
			&& accept(this._validateSymbols(number), "Число содержит недопустимые символы")
			&& accept(this._validateUnique(number), "Число содержит повторяющиеся символы");
		
		return result;
	};
	
	gameP._validateUnique = function (number)
	{
		var symbols = number.split('');
		var hash = {};
		for (var i = 0; i < symbols.length; i++)
		{
			var s = symbols[i];
			if (hash[s])
			{
				return false;
			}
			else 
			{
				hash[s] = s;
			}
		}
		return true;
	};
	
	gameP._validateSymbols = function (number)
	{
		var symbols = number.split('');
		for (var i = 0; i < symbols.length; i++)
		{
			var s = symbols[i];
			if (!this._symbols[s])
			{
				return false;
			}
		}
		return true;
	};
	
	gameP.getBulls = function (original, number)
	{
		var bulls = 0;
		if (this.validate(original) && this.validate(number))
		{
			var os = original.split('');
			var ns = number.split('');
			for (var i = 0; i < os.length; i++)
			{
				if (os[i] === ns[i])
				{
					bulls++;
				}
			}
		}
		return bulls;
	};
	
	gameP.getCows = function (original, number)
	{
		var cows = 0;
		if (this.validate(original) && this.validate(number))
		{
			var os = original.split('');
			for (var i = 0; i < os.length; i++)
			{
				var j = number.indexOf(os[i]);
				if (j >= 0 && j !== i)
				{
					cows++;
				}
			}
		}
		return cows;
	};
	
	gameP.getSymbols = function ()
	{
		return this._Symbols;
	};
	
	gameP.getLength = function ()
	{
		return this._Length;
	};
	
	///
	/// Загадыватель числа
	///
	DP.Proposer = function (settings)
	{
		settings = settings || {};
		
		this._Game = settings.Game || new DP.Game();
		this._Number = settings.Number || this._generateNumber();
		
		accept(this._Game.validate(this._Number), "Загаданное число должно быть валидным");
	};
	
	var proposerP = DP.Proposer.prototype;
	
	proposerP._generateNumber = function ()
	{
		var symbols = this._Game.getSymbols();
		var arr = symbols.split('');
		var sortArr = [];
		for (var i = 0; i < arr.length; i++)
		{
			sortArr.push({
				"Char": arr[i],
				"Weight": Math.random(),
				"toString": function () { return this.Char; }
			});
		}
		sortArr.sort(this._sort);
		sortArr.length = this._Game.getLength();
		return sortArr.join('');
	};
	
	proposerP._sort = function (a, b)
	{
		return a.Weight - b.Weight;
	};
	
	proposerP.check = function (number)
	{
		if (!this._Game.validate(number)) return null;
		return {
			"Number": number,
			"Bulls": this._Game.getBulls(this._Number, number),
			"Cows": this._Game.getCows(this._Number, number)
		};
	};
	
	///
	/// Отгадыватель числа
	///
	DP.Solver = function ()
	{
		
	};
	
	///
	/// Вспомогательная функция проверки условия
	///
	function accept(condition, message)
	{
		if (!condition)
		{
			console.log(message);
			throw new Error(message);
		}
		return condition;
	};
	
})();