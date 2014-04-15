function SwipeGestureTracker ()
{
	var _self = this,
		_initialised = false;
		_swipeStartPoint = null,
		_horizontalSwipeDriftedTooMuch = false,
		_verticalSwipeDriftedTooMuch = false;

	
	_self.swipeDistance = null;
	_self.swipeMaxDrift = null;
	_self.callbacks = {
		up : null,
		down : null,
		left : null,
		right : null
	};

	_self.init = function (swipeDistance, swipeMaxDrift)
	{
		if (_initialised) return;

		_initialised = true;
		_swipeStartPoint = {x:0, y:0};
		
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
		_horizontalSwipeDriftedTooMuch = false;
		_verticalSwipeDriftedTooMuch = false;

		_self.swipeDistance = null;
		_self.swipeMaxDrift = null;
		_self.callbacks = {
			up : null,
			down : null,
			left : null,
			right : null
		};
	};

	function touchStartHandler (event)
	{
		window.removeEventListener("touchstart", touchStartHandler, false);

		// uncomment this line to stop mobile browser elastic bounce effect.
		// just bear in mind that this will stop event propogation
		// event.preventDefault();

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
			posY = touch.pageY !== undefined ? touch.pageY : touch.clientY,
			vertical = {didSwipe : false, direction : null},
			horizontal = {didSwipe : false, direction : null, fn : null};


		// stop processing a horizontal gesture if the swipe has drifted too much vertically.
		// TODO : if we want to cater for diagonal swipes then this block will have to be removed.
		if (!_horizontalSwipeDriftedTooMuch && Math.abs(_swipeStartPoint.y - posY) > _self.swipeMaxDrift)
		{
			_horizontalSwipeDriftedTooMuch = true;
		}

		// stop processing a vertical gesture if the swipe has drifted too much horizontally.
		// TODO : if we want to cater for diagonal swipes then this block will have to be removed.
		if (!_verticalSwipeDriftedTooMuch && Math.abs(_swipeStartPoint.x - posX) > _self.swipeMaxDrift)
		{
			_verticalSwipeDriftedTooMuch = true;
		}

		// both swipes have drifted too much, so stop tracking and return.
		if (_horizontalSwipeDriftedTooMuch && _verticalSwipeDriftedTooMuch)
		{
			reset();
			return;
		}

		// check if the horizontal swipe moved enough from its start point to be considered a gesture.
		if (!_horizontalSwipeDriftedTooMuch && Math.abs(_swipeStartPoint.x - posX) >= _self.swipeDistance)
		{
			// console.log ("swipe occurred. pixels swiped:", Math.abs(_swipeStartPoint.x - posX));

			horizontal.didSwipe = true;

			if (posX > _swipeStartPoint.x) // right swipe occurred
			{
				horizontal.fn = _self.callbacks.right;
				horizontal.direction = "right";
			}
			else // left swipe occurred
			{
				horizontal.fn = _self.callbacks.left;
				horizontal.direction = "left";
			}
		}

		// check if the swipe moved enough from its start point to be considered a gesture.
		if (!_verticalSwipeDriftedTooMuch && Math.abs(_swipeStartPoint.y - posY) >= _self.swipeDistance)
		{
			// console.log ("swipe occurred. pixels swiped:", Math.abs(_swipeStartPoint.y - posY));

			vertical.didSwipe = true;

			if (posY > _swipeStartPoint.y) // down swipe occurred
			{
				vertical.fn = _self.callbacks.down;
				vertical.direction = "down";
			}
			else // up swipe occurred
			{
				vertical.fn = _self.callbacks.up;
				vertical.direction = "up";
			}
		}

		/*
		// should we check for diagonal swipes??

		if (horizontal.didSwipe && vertical.didSwipe)
		{

			if (vertical.direction === "up" && horizontal.direction === "left")
			{
				// diagonal-up-left swipe...
			}
			else if (vertical.direction === "up" && horizontal.direction === "right")
			{
				// diagonal-up-right swipe...
			}
			else if (vertical.direction === "down" && horizontal.direction === "left")
			{
				// diagonal-down-left swipe...
			}
			else if (vertical.direction === "down" && horizontal.direction === "right")
			{
				// diagonal-down-right swipe...
			}

			// remove event listeners to stop the potential for multiple swipes occuring.
			reset ();
		}
		else if...

		*/

		if (horizontal.didSwipe)
		{
			if (typeof horizontal.fn === "function") horizontal.fn();

			// remove event listeners to stop the potential for multiple swipes occuring.
			reset ();
		}
		else if (vertical.didSwipe)
		{
			if (typeof vertical.fn === "function") vertical.fn();

			// remove event listeners to stop the potential for multiple swipes occuring.
			reset ();
		}
	}

	function touchEndHandler ()
	{
		console.log ("touchEndHandler");

		// remove event listeners to stop the potential for multiple swipes occuring.
		reset ();
	}

	function reset ()
	{
		// return if the destroy method was called, rather than adding unwanted listeners.
		if (!_initialised) return;

		_horizontalSwipeDriftedTooMuch = false;
		_verticalSwipeDriftedTooMuch = false;

		window.removeEventListener("touchmove", touchMoveHandler, false);
		window.removeEventListener("touchend", touchEndHandler, false);

		window.addEventListener("touchstart", touchStartHandler, false);
	}
}