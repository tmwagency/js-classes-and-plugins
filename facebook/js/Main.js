var TMW = window.TMW || {};

(function ($)
{
    $(function ()
    {
        var FACEBOOK_APP_ID = "286454504808442"; // String - required
        var CANVAS_URL = "https://apps.facebook.com/tmw-fb-class"; // String - required
        
        // create an instance of the Facebook class with the appropriate settings
        TMW.Facebook = new Facebook (FACEBOOK_APP_ID, CANVAS_URL, ["publish_stream"]);
        
        /*
            you can also instantiate the Facebook instance with further optional params:
         
            var PERMISSIONS = ["publish_stream", "user_photos"]; // Array.<String> - optional
            var CHANNEL_URL = "some channel URL"; // String - optional
            var STATUS = true; // Boolean - optional
            var COOKIE = true; // Boolean - optional
            var XFBML = false; // Boolean - optional
         
            TMW.Facebook = new Facebook (FACEBOOK_APP_ID, CANVAS_URL, CHANNEL_URL, STATUS, COOKIE, XFBML, PERMISSIONS);
        */
        
        // add an event handler for the 'facebookAuthenticatedSignal' which is dispatched from the Facebook class when authenticated.
        TMW.Facebook.facebookAuthenticatedSignal.add (facebookAuthenticatedSignalHandler);
        
        // start the magic ;)
        TMW.Facebook.init ();
        
        function facebookAuthenticatedSignalHandler ()
        {
            // the user is now logged into Facebook and has authenticated your app.
            console.log ("Main:: [facebookAuthenticatedSignalHandler]");
            
            // now we can do whatever else we need to, for example, let's create an instance of our App class, within which button
            // clicks either prompt the user to post to their feed via the Facebook UI, or we post without the UI using the Facebook API...
            TMW.App = new App ();
            TMW.App.init ();
            
            /*
                If you want to use the Facebook graph API to post without user intervention the 'publish_stream' permission is required,
                which should be passed as a param when initialising the Facebook instance.
                
                TMW.App.postUsingAPI ();
            */
        }            
    });
})(jQuery);