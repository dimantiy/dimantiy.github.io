(function ()
{
	'use strict';
	
	///
	/// Инициализация пространства имен DP (Dmitriy Pankov)
	///
	var dp = window.DP = window.DP || {};
	
	///
	/// Установка значения в хеш-строку
	///
	
	function _splitHash()
	{
		var hash = window.location.hash.replace('#', '');
		var pairs = hash.split('&');
		var values = {};
		for (var i = 0; i < pairs.length; i++)
		{
			if (pairs[i])
			{
				var p = pairs[i].split('=');
				values[p[0]] = p[1];
			}
		}
		return values;
	};
	function _joinHash(values)
	{
		var hash = [];
		for (var key in values)
		{
			hash.push(key + '=' + values[key]);
		}
		return '#' + hash.join('&');
	};
	
	dp.setHash = function (key, value)
	{
		var hash = _splitHash();
		hash[key] = value;
		window.location.hash = _joinHash(hash);
	};
	
	dp.getHash = function (key)
	{
		var hash = _splitHash();
		return hash[key];
	};
	
	dp.removeHash = function (key)
	{
		var hash = _splitHash();
		delete hash[key];
		window.location.hash = _joinHash(hash);
	};
	
	function _getStorage()
	{
		return window.localStorage || {};
	}
	
	dp.save = function (key, value)
	{
		var storage = _getStorage();
		storage[key] = value;
	};
	
	dp.restore = function (key)
	{
		var storage = _getStorage();
		return storage[key];
	};
	
})();