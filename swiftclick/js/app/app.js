(function ()
{
	// Create a reference to a new instance of SwiftClick and attach it to a context element.
	var swiftclick = new SwiftClick (document.body);

	// if necessary you can make SwiftClick track additional element types by adding an array of the node names.
	// (this is just an example of how to add elements, but isn't really needed within this app.)
	swiftclick.addNodeNamesToTrack (["p", "h1", "nav"]);

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