------------------------------------------------
#AspectRatioUtil

------------------------------------------------


### Usage:
Create a new instance of the util and pass true for the last param if you want to use 'resize' instead of 'orientationchange' for the event listened to by the util:

    var aspectRatioUtil = new AspectRatioUtil (480, changeToPortraitCallback, changeToLandscapeCallback, true);

Start listening for orientationchange/resize events:

    aspectRatioUtil.start ();

- Callbacks only get fired a single time per switch between ratios.
- Callbacks won't get fired immedietly when the 'start' method is called.
- The until includes a [shim][1] for addEventListener.


------------------------------------------------
#### Available properties

Change the function that gets fired when switching to portrait:

    aspectRatioUtil.portraitCallback = someFunction;

Change the function that gets fired when switching to landscape:
    
    aspectRatioUtil.landscapeCallback = someFunction;


------------------------------------------------
#### Available methods

    aspectRatioUtil.checkIfMobile (); // true/false
    
    aspectRatioUtil.checkIfPortrait (); // true/false
    
    aspectRatioUtil.checkIfLandscape (); // true/false
    
    aspectRatioUtil.start (); // starts listening for orientationchange/resize events
    
    aspectRatioUtil.stop (); // stops listening for orientationchange/resize events



[1]: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget.removeEventListener