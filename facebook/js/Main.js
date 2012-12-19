var TMW = window.TMW || {};

(function ($)
{
    $(function ()
    {
        // there are better ways to detect mobile, this is just a quickie ;)
        var mobile = "ontouchstart" in window ? true : false;
        
        alert ("mobile browser? " + mobile);
        
        var loginButton = document.getElementById ("loginButton");
        loginButton.style.visibility = "hidden";
        
        var uiPostButton = document.getElementById ("uiPostButton");
        uiPostButton.style.visibility = "hidden";
        
        var apiPostButton = document.getElementById ("apiPostButton");
        apiPostButton.style.visibility = "hidden";
        
        var FACEBOOK_APP_ID = "286454504808442"; // String - required
        var PERMISSIONS = ["publish_stream", "user_photos"]; // Array.<String> - optional
        
        // create an instance of the Facebook class with the appropriate settings        
        TMW.Facebook = new Facebook (FACEBOOK_APP_ID, PERMISSIONS);
        
        /*
            you can also instantiate the Facebook instance with further optional params:
            
            var CHANNEL_URL = "some channel URL"; // String - optional
            var STATUS = true; // Boolean - optional
            var COOKIE = true; // Boolean - optional
            var XFBML = false; // Boolean - optional
         
            TMW.Facebook = new Facebook (FACEBOOK_APP_ID, PERMISSIONS, CHANNEL_URL, STATUS, COOKIE, XFBML);
        */
        
        // add an event handler for the 'facebookInitialisedSignal' which is dispatched from the Facebook class when the API is initialised.        
        TMW.Facebook.facebookInitialisedSignal.add (facebookInitialisedSignalHandler);
        
        // initialise the Facebook API.
        TMW.Facebook.init ();
        
        function facebookInitialisedSignalHandler ()
        {
            // remove listener.
            TMW.Facebook.facebookInitialisedSignal.remove (facebookInitialisedSignalHandler);
            
            // add an event handler for the 'facebookAuthenticatedSignal' which is dispatched from the Facebook class when authenticated.        
            TMW.Facebook.facebookAuthenticatedSignal.add (facebookAuthenticatedSignalHandler);
            
            // add an event handler for the 'facebookAuthenticationCancelledSignal' which is dispatched from the Facebook class if authentication is cancelled by the user.
            TMW.Facebook.facebookAuthenticationCancelledSignal.add (facebookAuthenticationCancelledSignalHandler);
            
            if (mobile)
            {
                // use the redirect method of logging into Facebook, since the modal popup doesn't work on mobile.
                var redirectURI = "https://mayfly.tmwtest.co.uk/labs/js-classes-and-plugins/facebook/";
                TMW.Facebook.login (true, redirectURI);
            }
            else
            {
                // show login button
                loginButton.style.visibility = "visible";
                // login using a modal popup when login button is clicked
                loginButton.onclick = loginButtonClickHandler;    
            }
        }
        
        function loginButtonClickHandler ()
        {
             // login using a modal popup to authenticate the app.
            TMW.Facebook.login ();
        }
        
        function facebookAuthenticatedSignalHandler ()
        {
            // remove listeners.
            TMW.Facebook.facebookAuthenticatedSignal.remove (facebookAuthenticatedSignalHandler);
            TMW.Facebook.facebookAuthenticationCancelledSignal.remove (facebookAuthenticationCancelledSignalHandler);
            loginButton.onclick = function (){return false;};
            
             // remove login button from the DOM.
            loginButton.style.display = "none";
            
            alert ("facebook app authenticated.");
            
            // the user is now logged into Facebook and has authenticated the app, but may have rejected some permissions,
            // so we now check if we have all the permissions we requested.
            TMW.Facebook.checkPermissionsSignal.add (checkPermissionsSignalHandler);
            TMW.Facebook.checkPermissions (["publish_stream", "user_photos"]);
        }
        
        function facebookAuthenticationCancelledSignalHandler ()
        {
            alert ("facebook authentication cancelled.");
        }
        
        function checkPermissionsSignalHandler (allPermissionsAuthenticated)
        {
            // remove listener.
            TMW.Facebook.checkPermissionsSignal.remove (checkPermissionsSignalHandler);
            
            if (allPermissionsAuthenticated)
            {
                alert ("all extended permissions were successfully authenticated.");
                
                // show buttons to allow posting to feed.
                uiPostButton.style.visibility = "visible";
                apiPostButton.style.visibility = "visible";
                
                // now we can do whatever else we need to, for example, let's create an instance of our App class, within which button
                // clicks either prompt the user to post to their feed via the Facebook UI, or we post without the UI using the Facebook API...
                TMW.App = new App ();
                TMW.App.init ();
            }
            else
            {
                alert ("user denied some or all extended permissions.");
            }
        }
    });
})(jQuery);