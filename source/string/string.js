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
		this._Points = settings.Points || this._getTrianglePoints(settings.Harmonics || 3);
		this._Frequency = settings.Frequency || 22050;
		this._Resistance = settings.Resistance || 3;
		this._Acceleration = settings.Acceleration || 1000; // 100 ~ 45Hz
		this._Length = settings.Length || 1;
		this._Harmonics = settings.Harmonics || this._Points.length - 2;
		this._SoundLength = settings.SoundLength || 2;
		
		this._amplitude = [];
		this._freq = [];
		this._frames = [this._Points];
		this._sound = [this._fft(this._Points)];
	};
	
	DP.String._harmonicsHash = {};
	
	var stringP = DP.String.prototype;
	
	stringP._getTrianglePoints = function (n)
	{
		var points = [];
		points.push(0);
		for (var i = 0; i < n; i++)
		{
			var p = (i + 1) / n;
			//var p = i < n / 2 ? (i + 1) / (n + 1) : (n - i) / (n + 1);
			//var p = 1 / Math.sqrt(i + 1);
			points.push(p);
		}
		points.push(0);
		return points;
	};
	
	stringP._getRoyalPoints = function (n)
	{
		var points = [];
		var weight = [
			103,
			66,
			25,
			29,
			10,
			51,
			14,
			26,
			23,
			25,
			24,
			13,
			17,
			8
		];
		weight.length = Math.min(n, weight.length);
		points.push(0);
		for (var i = 0; i < n; i++)
		{
			var p = 0;
			var s = 0;
			for (var j = 0; j < n; j++)
			{
				p += weight[j] * Math.sin(Math.PI * (j + 1) * (i + 1) / (n + 1));
				s += weight[j];
			}
			p /= s;
			points.push(p);
		}
		points.push(0);
		return points;
	};
	
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
		this._harmonicsHash = this._harmonicsHash || DP.String._harmonicsHash;
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
			var amplitude = 0;
			for (var p = 1; p < points.length - 1; p++)
			{
				amplitude += points[p] * harmonic[p];
			}
			amplitude /= points.length;
			sum += amplitude;
			this._amplitude[h] = Math.max(this._amplitude[h] || 0, Math.abs(amplitude));
			this._freqP = this._freqP || [];
			this._freqP[h] = this._freqP[h] || 0; 
			this._freq[h] = this._freq[h] || 0;
			if (this._freqP[h] > 0 && amplitude <= 0)
			{
				this._freq[h] += 1 / this._SoundLength;
			}
			this._freqP[h] = amplitude; 
		}
		
		return sum;
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
		this._sound.push(this._fft(frame));
	};
	
	stringP.getNoteFrequence = function ()
	{
		var f = 0;
		var s = this._sound;
		var i = s.length - 1;
		while (i--)
		{
			if (s[i] < 0 && s[i + 1] >= 0)
			{
				f++;
			}
		}
		return  f / this._SoundLength;
	};
	
	stringP.run = function (index)
	{
		var i = this._Frequency * this._SoundLength - 1;
		while (i--)
		{
			this._next();
		}
	};
	
	stringP.play = function ()
	{
		if (!this._context)
		{
			try
			{
				this._context = DP.String._context =
					DP.String._context || new (window.AudioContext || window.webkitAudioContext)();
			}
			catch (e)
			{
				alert(e);
				return;
			}
		}
		if (!this._buffer)
		{
				this._buffer = this._context.createBuffer(1, this._sound.length, this._Frequency);
				var data = this._buffer.getChannelData(0);
				for (var i = 0; i < this._sound.length; i++)
				{
					data[i] = this._sound[i];
				}
		}
		
		var source = this._context.createBufferSource();
		source.buffer = this._buffer;
		source.connect(this._context.destination);
		source.start();
		// console.log(this._amplitude);
		// console.log(this._freq);
	};
	
	stringP = null;
	
	
	DP.Melody = function (settings)
	{
		settings = settings || {};
		this._Tick = settings.Tick || 100;
		this._Strings = settings.Strings || {};
		this._Melody = settings.Melody || '';
		this._Notes = settings.Notes || this._parseMelody(this._Melody);
		
		this._play = false;
		this._offset = 0;
		
		this._timer = setInterval(this._onTick.bind(this), this._Tick);
	};
	
	var melodyP = DP.Melody.prototype;
	
	melodyP.play = function ()
	{
		this._play = true;
	};
	
	melodyP.pause = function ()
	{
		this._play = false;
	};
	
	melodyP.stop = function ()
	{
		this._play = false;
		this._offset = 0;
	};
	
	melodyP.toggle = function ()
	{
		return this._play ? this.stop() : this.play();
	};
	
	melodyP._parseMelody = function (melody)
	{
		var notes = [];
		var pairs = melody.split(' ');
		for (var i = 0; i < pairs.length; i++)
		{
			var p = pairs[i].split(':');
			notes.push({
				Key: p[0],
				Length: parseInt(p[1])
			});
		}
		return notes;
	};
	
	melodyP._onTick = function ()
	{
		if (this._play)
		{
			var offset = 0;
			for (var i = 0; i < this._Notes.length; i++)
			{
				var n = this._Notes[i];
				if (offset === this._offset)
				{
					var s = this._Strings[n.Key];
					if (s)
					{
						s.play();
					}
				}
				offset += n.Length;
			}
			this._offset++;
			
			if (this._offset > offset)
			{
				this.stop();
			}
		}
		//console.log(this._offset);
	};
	
	melodyP = null;
	
})();
