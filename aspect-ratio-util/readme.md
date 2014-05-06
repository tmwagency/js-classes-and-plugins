------------------------------------------------
#AspectRatioUtil

------------------------------------------------

This util makes it easy to perform actions when switching between aspect ratios by firing user-defined callbacks.

It sees landscape aspect ratio as width being greater than height, and portrait aspect ratio as the opposite.

### Usage:
Create a new instance of the util, passing in functions to run when the aspect ratio changes:

    var aspectRatioUtil = new AspectRatioUtil (changeToPortraitCallback, changeToLandscapeCallback);

Start listening for orientationchange events:

    aspectRatioUtil.start ();

If you want to use `'resize'` instead of `'orientationchange'` for the event that the util listens for then pass `'true'` as a third parameter within the constructor:

	var aspectRatioUtil = new AspectRatioUtil (changeToPortraitCallback, changeToLandscapeCallback, true);

- Callbacks only get fired a single time per switch between ratios.
- Callbacks **won't** get fired immediately when the `'start'` method is called.
- The util includes a [shim][1] for addEventListener/removeEventListener.


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