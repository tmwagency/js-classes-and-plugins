var TMW = window.TMW || {};

(function($)
{
	function init ()
	{
		// ----------------------------------------------------------------------------
		// GLOBAL CONSTANTS
		// ----------------------------------------------------------------------------
		TMW.TOUCH_SUPPORTED = "ontouchstart" in window ? true : false,
		TMW.MAX_TOUCHES_TO_TRACK = 3;


		// ----------------------------------------------------------------------------
		// GLOBAL VARIABLES
		// ----------------------------------------------------------------------------

		// create a new Instance of the multitouch tracker. Only one instance is needed per application,
		// so it's useful to define this instance as a part of a global namespace.
		TMW.multitouchTracker = new MultitouchTracker ($("#touch-point-container"), TMW.MAX_TOUCHES_TO_TRACK);


		// ----------------------------------------------------------------------------
		// PRIVATE METHODS
		// ----------------------------------------------------------------------------
		function setup ()
		{
			// add callback functions to respond to the signals that get dispatched by the tracker.
			TMW.multitouchTracker.touchAddedSignal.add (touchAddedSignalHandler);
			TMW.multitouchTracker.touchMovedSignal.add (touchMovedSignalHandler);
			TMW.multitouchTracker.touchRemovedSignal.add (touchRemovedSignalHandler);
			TMW.multitouchTracker.start ();
		}

		function touchAddedSignalHandler (touchPointArray)
		{
			// When a touchstart is detected the multitouch tracker sends us the updated array of touch points.
			log ("App:: [touchAddedSignalHandler] touchPointArray:");
			log (touchPointArray);
			log ("\n");

			// the 'totalTouches' property is equivalent to 'touchPointArray.length'.
			log ("App:: [touchAddedSignalHandler] _multitouchTracker.totalTouches: " + TMW.multitouchTracker.totalTouches);
		}

		function touchMovedSignalHandler (touchPointArray)
		{
			// When a touchmove is detected the multitouch tracker sends us the updated array of touch points.

			log ("App:: [touchMovedSignalHandler] touchPointArray:");
			log (touchPointArray);
			log ("\n");
		}

		function touchRemovedSignalHandler ()
		{
			// When a touchend is detected. This time we don't really need the array of touch points.

			log ("App:: [touchRemovedSignalHandler]" + "\n");
		}


		// call the 'setup' method to kickoff the app.
		setup ();
	}

	$(init);

})(jQuery);