/*
	TouchTracker
	------------------------
	
	author	: Ivan Hayes
	twitter	: @munkychop
*/


// ------------------------------------------------------------------------
// CONSTRUCTOR
// ------------------------------------------------------------------------
function TouchTracker (context, maxTouchesToTrack)
{
	// return immediately if touch isn't supported.
	if ("ontouchstart" in window !== true)
	{
		return;
	}

	// ------------------------------------------------------------------------
	// PRIVATE PROPERTIES
	// ------------------------------------------------------------------------
	var _self = this,
		_context = context,
		_maxTouchesToTrack = maxTouchesToTrack,
		_isTracking = false,
		_totalTrackedTouches = 0,
		_touchesDictionary = {};


	// ------------------------------------------------------------------------
	// PRIVATE METHODS
	// ------------------------------------------------------------------------
	function touchstartHandler (event)
	{
		event.preventDefault ();

		if (_totalTrackedTouches === _maxTouchesToTrack) return;

		var i = 0,
			changedTouchesArray = event.changedTouches,
			totalChangedTouches = changedTouchesArray.length,
			allTouches = _totalTrackedTouches + totalChangedTouches,
			totalNewTouchesToAdd = allTouches > _maxTouchesToTrack ? totalChangedTouches - (allTouches % _maxTouchesToTrack) : totalChangedTouches,
			currentTouch,
			updatedChangedTouchesArray = [];


		_totalTrackedTouches += totalNewTouchesToAdd;


		for (i; i < totalNewTouchesToAdd; i++)
		{
			currentTouch = changedTouchesArray[i];

			// add normalised x & y properties to the touch object.
			currentTouch.x = currentTouch.pageX || currentTouch.clientX;
			currentTouch.y = currentTouch.pageY || currentTouch.clientY;

			_touchesDictionary[currentTouch.identifier] = currentTouch;
			updatedChangedTouchesArray.push (currentTouch);
		}

		if (typeof _self.onTouch !== "undefined") _self.onTouch (updatedChangedTouchesArray);

		return false;
	}

	function touchmoveHandler (event)
	{
		event.preventDefault ();

		
		var i = 0,
			touchesArray = event.touches,
			touchesArrayLength = touchesArray.length,
			currentTouch,
			currentTrackedTouch,
			totalTouchesUpdated = 0,
			updatedTouchesArray = [];

		for (i; i < touchesArrayLength; i++)
		{
			currentTouch = touchesArray[i];

			if (typeof _touchesDictionary[currentTouch.identifier] !== "undefined")
			{
				currentTrackedTouch = _touchesDictionary[currentTouch.identifier];
				currentTrackedTouch.x = currentTouch.pageX || currentTouch.clientX;
				currentTrackedTouch.y = currentTouch.pageY || currentTouch.clientY;

				totalTouchesUpdated++;

				updatedTouchesArray.push (currentTrackedTouch);

				if (totalTouchesUpdated === _totalTrackedTouches)
				{
					break;
				}
			}
		}

		if (typeof _self.onMove !== "undefined") _self.onMove (updatedTouchesArray);

		return false;
	}

	function touchendHandler (event)
	{
		event.preventDefault ();

		var i = 0,
			changedTouchesArray = event.changedTouches,
			changedTouchesArrayLength = changedTouchesArray.length,
			currentTouch,
			currentTrackedTouch,
			updatedChangedTouchesArray = [];

		for (i; i < changedTouchesArrayLength; i++)
		{
			currentTouch = changedTouchesArray[i];

			if (typeof _touchesDictionary[currentTouch.identifier] !== "undefined")
			{
				currentTrackedTouch = _touchesDictionary[currentTouch.identifier];
				currentTrackedTouch.x = currentTouch.pageX || currentTouch.clientX;
				currentTrackedTouch.y = currentTouch.pageY || currentTouch.clientY;

				delete _touchesDictionary[currentTouch.identifier];
				_totalTrackedTouches--;

				updatedChangedTouchesArray.push (currentTrackedTouch);
			}
		}

		if (updatedChangedTouchesArray.length > 0 && typeof _self.onRelease !== "undefined") _self.onRelease (updatedChangedTouchesArray);

		return false;
	}


	// ------------------------------------------------------------------------
	// PUBLIC API
	// ------------------------------------------------------------------------

	_self.onTouch = undefined;
	_self.onMove = undefined;
	_self.onRelease = undefined;

	// start tracking touches. This also calls the public 'init' method, if
	// it hasn't been called explicitly.
	_self.start = function ()
	{
		if (_isTracking) return;

		context.addEventListener ("touchstart", touchstartHandler, false);
		context.addEventListener ("touchmove", touchmoveHandler, false);
		window.addEventListener ("touchend", touchendHandler, false);

		_self.isTracking = true;
	};

	// stop tracking touches.
	_self.stop = function ()
	{
		if (!_isTracking) return;

		context.removeEventListener ("touchstart", touchstartHandler);
		context.removeEventListener ("touchmove", touchmoveHandler);
		window.removeEventListener ("touchend", touchendHandler);

		_self.isTracking = false;
	};

	// get an array of all touches that are currently being tracked.
	_self.get = function ()
	{
		var currentTouch,
			touchArray = [];

		for (currentTouch in _touchesDictionary)
		{
			touchArray.push (currentTouch);
		}

		return touchArray;
	};

	// reset the tracker. This empties the array of touches and
	// also sets 'totalTouches' to 0.
	_self.reset = function ()
	{
		if (_isTracking) _self.stop ();

		_touchesDictionary = {};
		_totalTrackedTouches = 0;
	};
}