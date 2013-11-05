function ImagePreloader (allImagesLoadedCallback)
{
	//---------------------------------------------------------------------------------------
	// PUBLIC PROPERTIES
	//---------------------------------------------------------------------------------------
	this.allImagesLoadedCallback = allImagesLoadedCallback;


	//---------------------------------------------------------------------------------------
	// PRIVATE PROPERTIES
	//---------------------------------------------------------------------------------------
	var _self					= this,
		_totalImagesLoading		= 0;


	//---------------------------------------------------------------------------------------
	// PRIVATE METHODS
	//---------------------------------------------------------------------------------------
	function imageLoaded (event)
	{
		// console.log ("ImagePreloader:: imageLoaded... src: " + this.src);

		_totalImagesLoading--;

		// console.log ("ImagePreloader:: [imageLoaded] _totalImagesLoading: " + _totalImagesLoading);

		if (_totalImagesLoading === 0)
		{
			_self.allImagesLoadedCallback ();
		}
	}

	function preloadImage (imageURL)
	{
		if (typeof (imageURL) === "undefined" || imageURL === "")
		{
			// console.log ("ImagePreloader:: [preloadImage] imageURL is not defined, or is an empty string... forcing 'imageLoaded' method and returning.");
			imageLoaded ();
			return;
		}

		// console.log ("ImagePreloader:: [preloadImage]... url:" + imageURL);

		var image = new Image ();
		image.onload = imageLoaded;
		image.src = imageURL;
	}

	//---------------------------------------------------------------------------------------
	// PUBLIC API
	//---------------------------------------------------------------------------------------
	_self.load = function (imageURL)
	{
		_totalImagesLoading++;
		preloadImage (imageURL);
	};

	_self.loadMultiple = function (imageURLArray)
	{
		var i = 0,
			length = imageURLArray.length;

		_totalImagesLoading += length;

		for (i; i < length; i++)
		{
			preloadImage (imageURLArray[i]);
		}
	};
}