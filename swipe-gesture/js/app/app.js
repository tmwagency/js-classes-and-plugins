function swipeUpHandler ()
{
	alert ("swipe up gesture occured.");
}

function swipeDownHandler ()
{
	alert ("swipe down gesture occured.");
}

function swipeLeftHandler ()
{
	alert ("swipe left gesture occured.");
}

function swipeRightHandler ()
{
	alert ("swipe right gesture occured.");
}


// distance before a swipe is seen as a gesture.
var gestureDistance = 80;

// when a swipe has drifted along the opposite axis (x/y), this is the distance before it is determined as NOT a gesture.
// for example, if a user is swiping from left to right and the y position of the swipe drifts up or down by the specified
// drift distance, then the swipe is no longer seen as a gesture, even if the gestureDistance is reached along the x axis.
var driftDistance = 44;

// Create new instance of SwipeGestureTracker class.
var swipeGestureTracker = new SwipeGestureTracker ();

// set callbacks for when specific swipe gestures occur.
swipeGestureTracker.callbacks.up = swipeUpHandler;
swipeGestureTracker.callbacks.down = swipeDownHandler;
swipeGestureTracker.callbacks.left = swipeLeftHandler;
swipeGestureTracker.callbacks.right = swipeRightHandler;

/*
// setting callbacks can also be done all in one step instead, if necessary:
swipeGestureTracker.callbacks = {
	up : swipeUpHandler,
	down : swipeDownHandler,
	left : swipeLeftHandler,
	right : swipeRightHandler
};
*/

// Initialise the instance, passing the required gesture and drift distances.
swipeGestureTracker.init (gestureDistance, driftDistance);