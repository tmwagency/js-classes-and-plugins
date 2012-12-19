Facebook = function (appID, permissions, channelURL, status, cookie, xfbml)
{    
    this.APP_ID = appID;
    channelURL ? this.CHANNEL_URL = channelURL : this.CHANNEL_URL = "";
    status ? this.STATUS = status : this.STATUS = true;
    cookie ? this.COOKIE = cookie : this.COOKIE = true;
    xfbml ? this.XFBML = xfbml : this.XFBML = false;
    permissions ? this.PERMISSIONS = permissions : this.PERMISSIONS = [];
    
    // shorten signals namespace so that instantiating signals is simpler.
    var Signal = signals.Signal;
    
    this.facebookInitialisedSignal = new Signal ();
    this.facebookAuthenticatedSignal = new Signal ();
    this.facebookAuthenticationCancelledSignal = new Signal ();
    this.postToFeedErrorSignal = new Signal ();
    this.postToFeedSuccessSignal = new Signal ();
    this.checkPermissionsSignal = new Signal ();
    
    this.initialised;
    this.userID = undefined;
    this.authenticated = false;
    
    // console.log ("Facebook:: [cconstructor] this.APP_ID = " + this.APP_ID);
}

Facebook.constructor = Facebook;

Facebook.prototype.init = function ()
{    
    // console.log ("Facebook:: [init]");
    
    var self = this;
    
    window.fbAsyncInit = function ()
    {        
        // console.log ("Facebook:: [init - fbAsyncInit] this.APP_ID = " + self.APP_ID);
        
        var initParams = {};
        initParams.appId = self.APP_ID;
        if (self.CHANNEL_URL != "") initParams.channelUrl = self.CHANNEL_URL;
        initParams.status = self.STATUS;
        initParams.cookie = self.COOKIE;
        initParams.xfbml = self.XFBML;
        
        FB.init (initParams);
        self.facebookInitialisedSignal.dispatch ();
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

Facebook.prototype.login = function (useRedirect, redirectURI)
{
    var self = this;
    
    FB.getLoginStatus (getLoginStatusHandler)
    
    function getLoginStatusHandler (response)
    {
        if (response.status != "connected")
        {
            var i = 0;
            var length = self.PERMISSIONS.length;
                
            if (useRedirect)
            {
                var oauth_url = "https://www.facebook.com/dialog/oauth/";
                oauth_url += "?client_id=" + self.APP_ID;
                oauth_url += "&redirect_uri=" + encodeURIComponent (redirectURI);
                
                // additional permissions 
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
            else
            {
                var permissionsString = "";
                
                // additional permissions
                if (length > 0)
                {
                    for (i; i < length; i++)
                    {
                        permissionsString += self.PERMISSIONS[i];
                        if (i != length) permissionsString += ",";
                    }
                }          
                
                FB.login (loginResponseHandler, {scope: permissionsString});
                
                function loginResponseHandler (response)
                {
                    if (response.authResponse)
                    {                    
                        // console.log ("Facebook:: user has auth'd app and is logged into Facebook... dispatching 'facebookAuthenticatedSignal'");
                        
                        self.userID = response.id;
                        self.authenticated = true;        
                        self.facebookAuthenticatedSignal.dispatch ();
                    }
                    else
                    {
                        // console.log ("Facebook:: [login] user cancelled login.");
                        self.facebookAuthenticationCancelledSignal.dispatch ();
                    }
                }
            }
        }
        else
        {
            self.facebookAuthenticatedSignal.dispatch ();
        }
    }
}

Facebook.prototype.checkPermissions = function (permissionsArray)
{
    var self = this;
    var match = false;
    
    FB.api ('/me/permissions', userPermissionsReceived);
         
    function userPermissionsReceived (response)
    {
        // console.log ("Facebook:: [checkPermissions] response:\n\n"  + response);
        
        // loop through data and create permissions string.
        // check if the created string has all permissions necessary.
        
        var i = 0;
        var length = permissionsArray.length;
        
        
        var j;
        var responseDataLength = response.data.length;
        
        if (responseDataLength > 0)
        {
            for (i; i < length; ++i)
            {
                currentPermissionString = permissionsArray[i];
                j = 0;
                match = false;
                
                for (j; j < responseDataLength; ++j)
                {
                    if (response.data[j][currentPermissionString] === 1)
                    {
                        // console.log ("Facebook:: [checkPermissions] found permission: " + currentPermissionString);
                        match = true;
                        break;
                    }
                }
                
                if (!match)
                {
                    self.checkPermissionsSignal.dispatch (false);
                    return;
                }
            }
            
            // this will only be dispatched if all permisions match, as we would otherwise be 'returned' based on the above consitional.
            self.checkPermissionsSignal.dispatch (true);
        }
        else
        {
            self.checkPermissionsSignal.dispatch (false);
        }
    }
}

Facebook.prototype.postToFeed = function (postObject, useAPI)
{
    // console.log ("Facebook:: [postToFeed]");
    
    var self = this;
    
    if (useAPI)
    {
        // console.log ("using API");
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
                // console.log ("Facebook:: [feedPostResponseHandler] Error posting to user's Facebook feed");
                
                self.postToFeedErrorSignal.dispatch ();
        }
        else
        {
                // console.log ("Facebook:: [feedPostResponseHandler] successfully posted to user's Facebook feed");
                
                self.postToFeedSuccessSignal.dispatch ();
        }
    }
}

Facebook.prototype.setIframeSize = function (canvasWidth, canvasHeight)
{
    // FB.Canvas.setAutoGrow (false);
    FB.Canvas.setSize ({width: canvasWidth, height: canvasHeight});
}