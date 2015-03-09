/* 
 * (c) Dmitriy Pankov 2015
 */

(function ()
{
	"use strict";
	
	var DP = window.DP = {}; // Dmitry Pankov namespace
	
	DP.String = function (settings)
	{
		settings = settings || {};
		this._Points = settings.Points || [0, 2.5/5, 5/5, 4/5, 3/5, 2/5, 1/5, 0];
		this._Frequency = settings.Frequency || 22100;
		this._Resistance = settings.Resistance || 2;
		this._Acceleration = settings.Acceleration || 1000; // 100 ~ 45Ãö
		this._Length = settings.Length || 1;
		this._Harmonics = settings.Harmonics || this._Points.length - 2;
		
		this._frames = [this._Points];
		this._sound = [this._fft(this._Points)];
	};
	
	var stringP = DP.String.prototype;
	
	stringP._u = function (x, t)
	{
		if (x === 0 ||
			x === this._Points.length - 1 ||
			t <= 0)
		{
			return this._Points[x];
		}
		
		if (t < this._frames.length)
		{
			return this._frames[t][x];
		}
		
		var a = this._Acceleration;
		var k = this._Resistance;
		var dl = this._Length / (this._Points.length - 1);
		var dt = 1 / this._Frequency;
		
		var u = this._u(x, t - 1);
		var ul = this._u(x - 1, t - 1);
		var ur = this._u(x + 1, t - 1);
		var ub = this._u(x, t - 2);
		
		var ut = a * a * dt * dt / dl / dl * (ul - 2 * u + ur);
		ut += (2 + 2 * k * dt) * u;
		ut -= ub;
		ut /= 1 + 2 * k * dt;
		
		return ut;
	};
	
	stringP._calcHarmonic = function (n, length)
	{
		var harmonic = [];
		harmonic.push(0);
		for (var i = 1; i < length - 1; i++)
		{
			var angle = Math.PI * (n + 1) * i / (length - 1);
			harmonic.push(Math.sin(angle));
		}
		harmonic.push(0);
		return harmonic;
	};
	
	stringP._getHarmonic = function (n, length)
	{
		this._harmonicsHash = this._harmonicsHash || {};
		this._harmonicsHash[length] = this._harmonicsHash[length] || {};
		this._harmonicsHash[length][n] = this._harmonicsHash[length][n] || this._calcHarmonic(n, length);
		return this._harmonicsHash[length][n];
	};
	
	stringP._fft = function (points)
	{
		var sum = 0;
		
		for (var h = 0; h < this._Harmonics; h++)
		{
			var harmonic = this._getHarmonic(h, points.length);
			for (var p = 1; p < points.length - 1; p++)
			{
				sum += points[p] * harmonic[p];
			}
		}
		
		return sum / this._Points.length * 2;
	};
	
	stringP._next = function ()
	{
		var t = this._frames.length;
		var l = this._Points.length;
		var frame = [];
		for (var x = 0; x < l; x ++)
		{
			frame.push(this._u(x, t));
		}
		this._frames.push(frame);
		this._sound.push(this._fft(frame) * 32767);
	};
	
	stringP.setPoints = function (points)
	{
		this._Points = points;
		this._frames = [this._Points];
		this._sound = [this._fft(this._Points) * 32767];
	};
	
	stringP.getFrame = function (index)
	{
		index = Math.max(Math.min(0, index), this._frames.length - 1);
		return this._frames[index];
	};
	
	stringP.run = function (index)
	{
		var i = this._Frequency * 3 - 1; // Max 10 seconds
		while (i--)
		{
			this._next();
		}
	};
	
	stringP.play = function ()
	{
		var audio = new Audio();
		var wave = new RIFFWAVE();
		wave.header.sampleRate = this._Frequency;
		wave.header.numChannels = 1;
		wave.header.bitsPerSample = 16;
		wave.Make(this._sound);
		audio.src = wave.dataURI;
		audio.play();
	};
	
	stringP = null;
	
})();
