function leftSwipeGestureHandler ()
{
	alert ("leftSwipeGestureHandler");
}

function rightSwipeGestureHandler ()
{
	alert ("rightSwipeGestureHandler");
}


// Create new instance of HorizontalSwipeGesture class.
var swipeGestureDetector = new HorizontalSwipeGesture ();

// Initialise the instance, passing in handlers for left and right swipe
// gestures, the distance neccessary to determine a swipe as a gesture, and
// the max vertical drift amount before the gesture detection stops for a swipe.
swipeGestureDetector.init (leftSwipeGestureHandler, rightSwipeGestureHandler, 600, 100);