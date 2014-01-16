TMW = window.TMW || {};

(function()
{
	TMW.TOUCH_SUPPORTED = "ontouchstart" in window ? true : false;
	TMW.MAX_TOUCHES_TO_TRACK = 3;

	// create a new Instance of the multitouch tracker. Only one instance is needed per application,
	// so it's useful to define this instance as a part of a global namespace.
	TMW.touchTracker = new TouchTracker (document.body, TMW.MAX_TOUCHES_TO_TRACK);
	TMW.touchTracker.onTouch = touchHandler;
	TMW.touchTracker.onMove = moveHandler;
	TMW.touchTracker.onRelease = releaseHandler;
	TMW.touchTracker.start ();

	
	function touchHandler (trackedTouchesArray)
	{
		// When a touchstart is detected the multitouch tracker sends us the updated array of touch points.
		log ("App:: [touchHandler] touchArray: ", trackedTouchesArray);
	}

	function moveHandler (trackedTouchesArray)
	{
		// When a touchmove is detected the multitouch tracker sends us the updated array of touch points.

		//log ("App:: [moveHandler]");
	}

	function releaseHandler (releasedTouchesArray)
	{
		// When a touchend is detected. This time we don't really need the array of touch points.

		log ("App:: [releaseHandler] touches: ", releasedTouchesArray);
	}
})();