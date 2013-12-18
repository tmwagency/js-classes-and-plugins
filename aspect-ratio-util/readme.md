
AspectRatioUtil
---------------

------------------------------------------------

### Usage:
Create a new instance of the util and pass true for the last param if you want to use the 'resize' instead of 'orientationchange' for the event listened to by the util:

    var aspectRatioUtil = new AspectRatioUtil (480, changeToPortraitCallback, changeToLandscapeCallback, true);

start listening for orientationchange/resize events:

    aspectRatioUtil.start ();

- Callbacks only get fired a single time per switch between ratios.
- Callbacks won't get fired immedietly when the 'start' method is called.


------------------------------------------------
#### Available properties

Change the function that gets fired when we switch to portrait:

    aspectRatioUtil.portraitCallback = someFunction;

Change the function that gets fired when we switch to landscape:
    
    aspectRatioUtil.landscapeCallback = someFunction;


------------------------------------------------
#### Available methods

    aspectRatioUtil.checkIfMobile (); // true/false
    
    aspectRatioUtil.checkIfPortrait (); // true/false
    
    aspectRatioUtil.checkIfLandscape (); // true/false
    
    aspectRatioUtil.start (); // starts listening for orientationchange/resize events
    
    aspectRatioUtil.stop (); // stops listening for orientationchange/resize events