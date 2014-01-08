function ImagePreloader ()
{
	//---------------------------------------------------------------------------------------
	// PRIVATE PROPERTIES
	//---------------------------------------------------------------------------------------
	var _self						= this,
		_totalImagesLoading			= 0,
		_allImagesLoadedCallback;


	//---------------------------------------------------------------------------------------
	// PRIVATE METHODS
	//---------------------------------------------------------------------------------------
	function imageLoaded (event)
	{
		// console.log ("ImagePreloader:: imageLoaded... src: " + this.src);

		_totalImagesLoading--;

		if (typeof this.cb !== "undefined") this.cb ();

		// console.log ("ImagePreloader:: [imageLoaded] _totalImagesLoading: " + _totalImagesLoading);

		if (_totalImagesLoading === 0)
		{
			if (typeof _allImagesLoadedCallback !== "undefined") _allImagesLoadedCallback ();

			_allImagesLoadedCallback = undefined;
		}
	}

	function preloadImage (imageURL, cb)
	{
		if (typeof (imageURL) === "undefined" || imageURL === "")
		{
			// console.log ("ImagePreloader:: [preloadImage] imageURL is not defined, or is an empty string... forcing 'imageLoaded' method and returning.");
			
			imageLoaded ();
			if (typeof cb !== "undefined") cb ();
			return;
		}

		// console.log ("ImagePreloader:: [preloadImage]... url:" + imageURL);

		var image = new Image ();
		image.onload = imageLoaded;
		image.cb = typeof cb !== "undefined" ? cb : undefined;
		image.src = imageURL;
	}

	//---------------------------------------------------------------------------------------
	// PUBLIC API
	//---------------------------------------------------------------------------------------
	_self.load = function (imageURL, cb)
	{
		_totalImagesLoading++;
		preloadImage (imageURL, cb);
	};

	_self.loadMultiple = function (imageURLArray, cb)
	{
		_allImagesLoadedCallback = cb;

		var i = 0,
			length = imageURLArray.length;

		_totalImagesLoading += length;

		for (i; i < length; i++)
		{
			preloadImage (imageURLArray[i]);
		}
	};
}