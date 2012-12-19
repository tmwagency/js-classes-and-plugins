function App ()
{
    this.uiPostButton = document.getElementById ("uiPostButton");
    this.apiPostButton = document.getElementById ("apiPostButton");
    this.postObjectForUI;
    this.postObjectForAPI;
}

App.constructor = App;

App.prototype.init = function ()
{
    console.log ("App:: [init]");
    
    var self = this;
    
    // construct an object to pass to the Facebook UI post.
    this.postObjectForUI = {
		method: "feed",
		name: "Facebook App Example",
		link: "http://25.media.tumblr.com/tumblr_m8c7ii3PDu1rwf6mzo1_500.gif",
		caption: "Amazingly Easy!",
		description: "Cowabonga dudes...",
		picture: "http://cdn.firearmstalk.com/forums/attachments/f12/15073d1275433474-random-creepy-things-thread-catdog.jpg"
    };
    
    // construct an object to pass to the Facebook API post.
    this.postObjectForAPI = {
            name: "Facebook App Example",
            link: "http://25.media.tumblr.com/tumblr_m8c7ii3PDu1rwf6mzo1_500.gif",
            description: "Now that was easy, right?",
            picture: "http://cdn.firearmstalk.com/forums/attachments/f12/15073d1275433474-random-creepy-things-thread-catdog.jpg"
    };
    
    TMW.Facebook.postToFeedErrorSignal.add (this.postToFeedErrorSignalHandler);
    TMW.Facebook.postToFeedSuccessSignal.add (this.postToFeedSuccessSignalHandler);
    
    this.uiPostButton.onclick = function () {self.postUsingUI ();};
    this.apiPostButton.onclick = function () {self.postUsingAPI ();};
    
    /*
        -- NOTE --
        If you want to use the Facebook graph API to post without user intervention the 'publish_stream' permission is required,
        which should be passed as a param when initialising the Facebook instance.
        
        this can be done with the method:
        TMW.App.postUsingAPI ();
    */
}

App.prototype.postUsingUI = function ()
{
    // promt the user to post the 'postObjectForUI' data to their feed.
    TMW.Facebook.postToFeed (this.postObjectForUI);
}

App.prototype.postUsingAPI = function ()
{
    // post the 'postObjectForAPI' data to the user's feed without intervention. Requires the 'publish_stream' permission.
    TMW.Facebook.postToFeed (this.postObjectForAPI, true);
}

App.prototype.postToFeedErrorSignalHandler = function ()
{
    alert ("Facebook post failed, or was canceled by user.");
}

App.prototype.postToFeedSuccessSignalHandler = function ()
{
    alert ("Facebook post successful.");
}