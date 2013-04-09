/*
	MultitouchTracker
	------------------------
	
	author	: Ivan Hayes
	contact	: @munkychop


	DEPENDANCIES
	------------------------
	jQuery		: http://jquery.com/
	js-signals	: millermedeiros.github.com/js-signals/
*/


// ------------------------------------------------------------------------
// CONSTRUCTOR
// ------------------------------------------------------------------------
function MultitouchTracker ($touchPointContainerEl, maxTouchesToTrack)
{
	// A reference to the Signal class constructor so we don't have to
	// type 'signals.Signal' all the time.
	var Signal = signals.Signal;

	// ------------------------------------------------------------------------
	// PUBLIC PROPERTIES
	// ------------------------------------------------------------------------
	this.$el = $touchPointContainerEl;
	this.maxTouchesToTrack = maxTouchesToTrack;

	this.initialised = false;
	this.isTracking = false;
	this.totalTouches = 0;

	// Public signals.
	// Add callbacks within your main app to respond to these signals being dispatched.
	this.touchAddedSignal = new Signal ();
	this.touchMovedSignal = new Signal ();
	this.touchRemovedSignal = new Signal ();


	// ------------------------------------------------------------------------
	// PRIVATE PROPERTIES
	// ------------------------------------------------------------------------
	// Private signals (not for public use).
	// These signals are dispatched to the encapsulated private scope for internal
	// one-way communication from the public API.
	this._startSignal = new Signal ();
	this._stopSignal = new Signal ();
	this._resetSignal = new Signal ();
}


// ------------------------------------------------------------------------
// PUBLIC API
// ------------------------------------------------------------------------

// start tracking touches. This also calls the public 'init' method, if
// it hasn't been called explicitly.
MultitouchTracker.prototype.start = function ()
{
	if (this.isTracking) return;
	if (!this.initialised) this.init ();

	this._startSignal.dispatch ();
};

// stop tracking touches.
MultitouchTracker.prototype.stop = function ()
{
	if (!this.isTracking) return;

	this._stopSignal.dispatch ();
};

// reset the tracker. This empties the array of touches and
// also sets 'totalTouches' to 0.
MultitouchTracker.prototype.reset = function ()
{
	if (this.isTracking) return;

	this._resetSignal.dispatch ();
};

// initialise the tracker. This creates the private scope.
MultitouchTracker.prototype.init = function ()
{
	if (this.initialised) return;

	this.initialised = true;

	// ------------------------------------------------------------------------
	// ENCAPSULATED PRIVATE SCOPE
	// ------------------------------------------------------------------------

	var _self = this,
		_$document = $(document),
		_$touchPointContainer = this.$el,
		_touchPointArray = [],
		_touchPointPool = [];

	_self._startSignal.add (startSignalHandler);

	function startSignalHandler ()
	{
		if (_self.isTracking) return;

		_self._startSignal.remove (startSignalHandler);
		_self._stopSignal.add (stopSignalHandler);

		_$document.on ("touchstart", touchstartHandler);
		_$document.on ("touchmove", touchmoveHandler);
		_$document.on ("touchend", touchendHandler);

		_self.isTracking = true;
	}

	function stopSignalHandler ()
	{
		if (!_self.isTracking) return;

		_self._stopSignal.remove (stopSignalHandler);
		_self._startSignal.add (startSignalHandler);
		_self._resetSignal.add (resetSignalHandler);

		_$document.off ("touchstart", touchstartHandler);
		_$document.off ("touchmove", touchmoveHandler);
		_$document.off ("touchend", touchendHandler);

		_self.isTracking = false;
	}

	function resetSignalHandler ()
	{
		_self._resetSignal.remove (resetSignalHandler);

		var i = 0;
		var length = _touchPointArray.length;

		for (i; i < length; i++)
		{
			currentTouchPoint = _touchPointArray[i];
			currentTouchPoint.hide ();

			_touchPointPool.push (currentTouchPoint);
		}

		_touchPointArray = [];
		_self.totalTouches = 0;
	}

	function touchstartHandler (event)
	{
		event.preventDefault ();

		if (event.originalEvent.touches.length > _self.maxTouchesToTrack) return;

		var i = 0,
			changedTouchesArray = event.originalEvent.changedTouches,
			totalChangedTouches = changedTouchesArray.length,
			currentTouch,
			currentTouchPoint,
			posX,
			posY;

		// log ("MultitouchTracker:: [startHandler] totalChangedTouches: " + totalChangedTouches);

		for (i; i < totalChangedTouches; i++)
		{
			currentTouch = changedTouchesArray[i];

			// reuse touchpoint objects from the pool array if possible.
			if (_touchPointPool.length > 0)
			{
				currentTouchPoint = _touchPointPool[0];
				_touchPointPool.splice (0, 1);
			}
			else
			{
				currentTouchPoint = new TouchPoint (_$touchPointContainer);
			}

			// push the current touch into the touchpoint object.
			currentTouchPoint.touch = currentTouch;

			posX = currentTouch.pageX !== undefined ? currentTouch.pageX : currentTouch.clientX;
			posY = currentTouch.pageY !== undefined ? currentTouch.pageY : currentTouch.clientY;

			currentTouchPoint.position (posX, posY);
			currentTouchPoint.show ();

			_touchPointArray.push (currentTouchPoint);

			_self.totalTouches = _touchPointArray.length;

			_self.touchAddedSignal.dispatch (_touchPointArray);
		}
	}

	function touchmoveHandler (event)
	{
		event.preventDefault ();

		var i = 0,
			touchesArray = event.originalEvent.touches,
			totalTouches = _self.maxTouchesToTrack > touchesArray.length ? touchesArray.length : _self.maxTouchesToTrack,
			currentTouch,
			currentTouchID,
			currentTouchPoint,
			posX,
			posY;

		for (i; i < totalTouches; i++)
		{
			currentTouch = touchesArray[i];
			currentTouchID = currentTouch.identifier;

			posX = currentTouch.pageX !== undefined ? currentTouch.pageX : currentTouch.clientX;
			posY = currentTouch.pageY !== undefined ? currentTouch.pageY : currentTouch.clientY;

			currentTouchPoint = _touchPointArray[i];
			currentTouchPoint.touch = currentTouch;
			currentTouchPoint.position (posX, posY);
		}

		// send _touchPointArray during dispatch.
		_self.touchMovedSignal.dispatch (_touchPointArray);
	}

	function touchendHandler (event)
	{
		event.preventDefault ();

		var i = 0,
			changedTouchesArray = event.originalEvent.changedTouches,
			totalChangedTouches = changedTouchesArray.length,
			currentTouch,
			currentTouchID,
			currentTouchPoint,
			j,
			touchPointArrayLength;

		// log ("MultitouchTracker:: [stopHandler] totalChangedTouches: " + totalChangedTouches);

		for (i; i < totalChangedTouches; i++)
		{
			currentTouch = changedTouchesArray[i];
			currentTouchID = currentTouch.identifier;

			// log ("currentTouchID: " + currentTouchID + "\n");

			j = 0;
			touchPointArrayLength = _touchPointArray.length;

			for (j; j < touchPointArrayLength; j++)
			{
				currentTouchPoint = _touchPointArray[j];

				if (currentTouchPoint.touch.identifier === currentTouchID)
				{
					currentTouchPoint.hide ();

					_touchPointArray.splice (j, 1);
					_touchPointPool.push (currentTouchPoint);

					_self.totalTouches = _touchPointArray.length;

					// log ("found matching ID: " + currentTouchPoint.touch.identifier);

					_self.touchRemovedSignal.dispatch ();

					break;
				}
			}
		}
	}
};


// ------------------------------------------------------------------------
/* TouchPoint Class
	
	This class is used to store a touch object and show/hide
	a DOM element at the centre position of the touch. 
*/
// ------------------------------------------------------------------------

function TouchPoint ($elementContainer)
{
	this.$el = $(document.createElement ("div"));
	this.$el.addClass ("touch-point").css ("position", "absolute");
	this.$el.hide ();
	this.touch = undefined;

	$elementContainer.append (this.$el);
}

TouchPoint.constructor = TouchPoint;

TouchPoint.prototype.show = function ()
{
	this.$el.show ();
};

TouchPoint.prototype.hide = function ()
{
	this.$el.hide ();
};

TouchPoint.prototype.position = function (x, y)
{
	var offsetWidth = this.$el.width () * 0.5;
	var offsetHeight = this.$el.height () * 0.5;

	if (typeof (x) !== "undefined" && typeof (y) !== "undefined")
	{
		this.$el.css ({left:x - offsetWidth, top:y - offsetHeight});
	}

	return {x:this.$el.position().left + offsetWidth, y:this.$el.position().top + offsetHeight};
};