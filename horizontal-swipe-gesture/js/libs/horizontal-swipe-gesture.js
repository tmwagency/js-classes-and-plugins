function HorizontalSwipeGesture ()
{
	var _self = this,
		_initialised = false;
		_swipeStartPoint = null,

	_self.swipeLeftCallback = null;
	_self.swipeRightCallback = null;
	_self.swipeDistance = null;
	_self.swipeMaxDrift = null;

	_self.init = function (swipeLeftCallback, swipeRightCallback, swipeDistance, swipeMaxDrift)
	{
		if (_initialised) return;

		_initialised = true;
		_swipeStartPoint = {x:0, y:0};

		_self.swipeLeftCallback = swipeLeftCallback;
		_self.swipeRightCallback = swipeRightCallback;
		_self.swipeDistance = swipeDistance;
		_self.swipeMaxDrift = swipeMaxDrift;

		window.addEventListener("touchstart", touchStartHandler, false);
	};

	_self.destroy = function ()
	{
		window.removeEventListener("touchstart", touchStartHandler, false);
		window.removeEventListener("touchmove", touchMoveHandler, false);
		window.removeEventListener("touchend", touchEndHandler, false);

		_initialised = false;
		_swipeStartPoint = {x:0, y:0};

		_self.swipeLeftCallback = null;
		_self.swipeRightCallback = null;
		_self.swipeDistance = null;
	};

	function touchStartHandler (event)
	{
		window.removeEventListener("touchstart", touchStartHandler, false);

		var touch = event.changedTouches[0];

		// store the start point of the touch.
		_swipeStartPoint.x = touch.pageX !== undefined ? touch.pageX : touch.clientX;
		_swipeStartPoint.y = touch.pageY !== undefined ? touch.pageY : touch.clientY;

		window.addEventListener("touchmove", touchMoveHandler, false);
		window.addEventListener("touchend", touchEndHandler, false);
	}

	function touchMoveHandler (event)
	{
		var touch = event.touches[0],
			posX = touch.pageX !== undefined ? touch.pageX : touch.clientX,
			posY = touch.pageY !== undefined ? touch.pageY : touch.clientY;

		// stop processing the gesture if the swipe has drifted too much vertically.
		if (Math.abs(_swipeStartPoint.y - posY) > _self.swipeMaxDrift)
		{
			// remove event listeners to stop the potential for multiple swipes occuring.
			reset ();

			// return to stop processing the swipe.
			return;
		}

		// check if the swipe moved enough from its start point to be considered a gesture.
		if (Math.abs(_swipeStartPoint.x - posX) >= _self.swipeDistance)
		{
			// console.log ("swipe occurred. pixels swiped:", Math.abs(_swipeStartPoint.x - posX));

			if (posX > _swipeStartPoint.x) // right swipe occurred
			{
				if (typeof _self.swipeRightCallback === 'function') _self.swipeRightCallback ();
			}
			else // left swipe occurred
			{
				if (typeof _self.swipeLeftCallback === 'function') _self.swipeLeftCallback ();
			}

			// remove event listeners to stop the potential for multiple swipes occuring.
			reset ();
		}
	}

	function touchEndHandler ()
	{
		// remove event listeners to stop the potential for multiple swipes occuring.
		reset ();
	}

	function reset ()
	{
		// return if the destroy method was called, rather than adding unwanted listeners.
		if (!_initialised) return;

		window.removeEventListener("touchmove", touchMoveHandler, false);
		window.removeEventListener("touchend", touchEndHandler, false);

		window.addEventListener("touchstart", touchStartHandler, false);
	}
}