Facebook = function (appID, canvasURL, permissions, channelURL, status, cookie, xfbml)
{    
    this.APP_ID = appID;
    this.CANVAS_URL = canvasURL;
    channelURL ? this.CHANNEL_URL = channelURL : this.CHANNEL_URL = "";
    status ? this.STATUS = status : this.STATUS = true;
    cookie ? this.COOKIE = cookie : this.COOKIE = true;
    xfbml ? this.XFBML = xfbml : this.XFBML = false;
    permissions ? this.PERMISSIONS = permissions : this.PERMISSIONS = [];
    
    this.facebookAuthenticatedSignal = new signals.Signal ();
    this.postToFeedErrorSignal = new signals.Signal ();
    this.postToFeedSuccessSignal = new signals.Signal ();
    
    this.userID = undefined;
    this.authenticated = false;
    
    console.log ("Facebook:: [cconstructor] this.APP_ID = " + this.APP_ID);
}

Facebook.constructor = Facebook;

Facebook.prototype.init = function ()
{    
    console.log ("Facebook:: [init]");
    
    var self = this;
    
    window.fbAsyncInit = function ()
    {        
        console.log ("Facebook:: [init - fbAsyncInit] this.APP_ID = " + self.APP_ID);
        
        var initParams = {};
        initParams.appId = self.APP_ID;
        if (self.CHANNEL_URL != "") initParams.channelUrl = self.CHANNEL_URL;
        initParams.status = self.STATUS;
        initParams.cookie = self.COOKIE;
        initParams.xfbml = self.XFBML;
        
        FB.init (initParams);
        
        FB.getLoginStatus (function (response)
        {
            console.log ("Facebook:: [init - FB.getLoginStatus]");
            //this is useful if you want to avoid the infinite loop bug, as it only reloads the page when you log in
            if (response.status != "connected")
            {
                var oauth_url = "https://www.facebook.com/dialog/oauth/";
                oauth_url += "?client_id=" + self.APP_ID;
                oauth_url += "&redirect_uri=" + encodeURIComponent (self.CANVAS_URL); // live address
                
                // additional permissions
                var i = 0;
                var length = self.PERMISSIONS.length;
                if (length > 0)
                {
                    oauth_url += "&scope=";
                    
                    for (i; i < length; i++)
                    {
                        oauth_url += self.PERMISSIONS[i];
                        if (i != length) oauth_url += ",";
                    }
                }                
                
                window.top.location = oauth_url;
            }
        });
      
        // listen for and handle auth.statusChange events
        FB.Event.subscribe ("auth.statusChange", function (response)
        {
            if (response.authResponse)
            {
                self.userID = response.id;
                self.authenticated = true;
                
                console.log ("Facebook:: user has auth'd app and is logged into Facebook... dispatching 'facebookAuthenticatedSignal'");
                
                self.facebookAuthenticatedSignal.dispatch ();
            }
        });
    };
    
    // Load the SDK Asynchronously
    (function(d){
     var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement('script'); js.id = id; js.async = true;
     js.src = "https://connect.facebook.net/en_US/all.js";
     ref.parentNode.insertBefore(js, ref);
    }(document));
}
    
Facebook.prototype.postToFeed = function (postObject, useAPI)
{
    console.log ("Facebook:: [postToFeed]");
    
    var self = this;
    
    if (useAPI)
    {
        console.log ("using API");
        FB.api ("/me/feed", "post", postObject, feedPostResponseHandler);
    }
    else
    {
        FB.ui (postObject, feedPostResponseHandler);
    }    
    
    function feedPostResponseHandler (response)
    {
        if (!response || response.error)
        {
                console.log ("Facebook:: [feedPostResponseHandler] Error posting to user's Facebook feed");
                
                self.postToFeedErrorSignal.dispatch ();
        }
        else
        {
                console.log ("Facebook:: [feedPostResponseHandler] successfully posted to user's Facebook feed");
                
                self.postToFeedSuccessSignal.dispatch ();
        }
    }
}