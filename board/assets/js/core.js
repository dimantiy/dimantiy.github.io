/*
 * Core functions
 * 
 * (c) Dmitriy Pankov 2015
 */

(function ()
{
	"use strict";

	// Main namespace
	var DP = window.DP = {};

	DP.ERROR_METHOD_NOT_IMPLEMENTED = "Method \"{0}\" not implemented";

	// Inherience function
	DP.initClass = function (child, parent)
	{
		var f = new Function();
		f.prototype = parent.prototype;
		child.prototype = new f();
		child.prototype.constructor = child;
		child.base = parent.prototype;
	};

	DP.createElement = function (className, elementName)
	{
		elementName = elementName || "div";
		var element = document.createElement(elementName);
		if (className)
		{
			element.className = className;
		}
		return element;
	};

	DP.clone = function (obj)
	{
		return JSON.parse(JSON.stringify(obj));
	};

	DP.Error = {};

	DP.Error.NotImplemented = function (method)
	{
		return new Error(DP.ERROR_METHOD_NOT_IMPLEMENTED.replace("{0}", "update"));
	};

	// Event

	DP.Event = function ()
	{
		this._handlers = [];
	};

	var eventP = DP.Event.prototype;

	eventP.add = function (handler)
	{
		this._handlers.push(handler);
	};

	eventP.fire = function ()
	{
		var handlers = this._handlers;
		for (var i = 0; i < handlers.length; i++)
		{
			var h = handlers[i];
			h.apply(this, arguments);
		}
	};

	eventP = null;

})();

(function ()
{

	"use strict";

	// Base object
	DP.Object = function (settings)
	{
		for (var s in this)
		{
			if (s[0] === "_" && s[1] === s[1].toUpperCase())
			{
				var name = s.substr(1);
				var getter = "get" + name;
				var setter = "set" + name;
				if (!this[getter])
				{
					this[getter] = this._createGetter(s);
				}
				if (!this[setter])
				{
					this[setter] = this._createSetter(s);
				}
			}
		}
		this.setSettings(settings);
	};

	var objectP = DP.Object.prototype;

	objectP._createGetter = function (name)
	{
		return function ()
		{
			return this[name];
		};
	};

	objectP._createSetter = function (name)
	{
		return function (value)
		{
			this[name] = value;
		};
	};

	objectP.getSettings = function ()
	{
		var settings = {};

		for (var s in this)
		{
			if (s[0] === "_" && s[1] === s[1].toUpperCase())
			{
				var name = s.substr(1);
				settings[name] = this[s];
			}
		}

		return settings;
	};

	objectP.setSettings = function (settings)
	{
		if (settings)
		{
			for (var s in settings)
			{
				this["_" + s] = settings[s];
			}
		}
	};

	objectP = null;

})();

(function ()
{

	"use strict";

	// Base UI-control
	DP.Control = function (settings)
	{
		this._ClassName = "dp-control";
		DP.Control.base.constructor.apply(this, arguments);
	};

	DP.initClass(DP.Control, DP.Object);

	var controlP = DP.Control.prototype;

	controlP._render = function ()
	{
		throw DP.Error.NotImplemented("_render");
	};

	controlP.render = function (parentNode)
	{
		if (this._DomNode && this._DomNode.parentNode)
		{
			this._DomNode.parentNode.removeChild(this._DomNode);
		}
		if (parentNode)
		{
			parentNode.appendChild(this.getDomNode());
			this._render();
		}
	};

	controlP.getDomNode = function ()
	{
		if (!this._DomNode)
		{
			this._DomNode = DP.createElement(this._ClassName);
		}
		return this._DomNode;
	};

	controlP = null;

})();