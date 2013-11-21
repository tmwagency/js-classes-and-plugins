(function ()
{
	/*
		// Approach 1

		Attach SwiftClick to any element you want to use as a context for tracking click events.
		document.body is easiest if you only need a single instance of SwiftClick.
	*/
	SwiftClick.attach (document.body);

	
	/*
		------------- OR -------------
		// Approach 2

		Create a reference to a new instance of SwiftClick using the 'attach' helper method and attach it to a context element.
		This approach allows you to create multiple instances of SwiftClick on, for example, specific container elements such as navigation,
		and also exposes the public API.
		
		var swiftclick = SwiftClick.attach (some-element);
	*/


	/*
		------------- OR -------------
		// Approach 3

		This approach is the same as approach 2, but just uses the 'new' keyword instead of the 'attach' method.

		var swiftclick = new SwiftClick (some-element);
	*/


	/* 
		------------- AND -------------
		If necessary you can make SwiftClick track additional element types by adding an array of node names.
		this requires a reference to an instance of SwiftClick.

		swiftclick.addNodeNamesToTrack (["p", "h1", "nav"]);
	*/


	// add normal click listeners to all elements with class 'test-element'.
	var testElements = document.getElementsByClassName("test-element"),
		i = 0,
		length = testElements.length;
	
	for (i; i < length; i++)
	{
		testElements[i].addEventListener ("click", elementClicked, false);
	}


	// normal click handler which simply toggles a CSS class on clicked elements.
	function elementClicked (event)
	{
		var currentElement = event.target,
			className = currentElement.className;

		if (className.indexOf ("bg-colour-change") !== -1)
		{
			className = className.replace ("bg-colour-change", "");
		}
		else
		{
			className = className + " bg-colour-change";
		}

		currentElement.className = className;
	}

})();