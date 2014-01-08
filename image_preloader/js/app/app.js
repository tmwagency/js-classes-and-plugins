var wrapper,
	allMonkeyImages,
	preloader;

// run the 'init' method after the DOM has fully loaded.
window.onload = init;

function init ()
{
	// get a reference to the wrapper div element.
	wrapper = document.getElementsByClassName("wrapper")[0];

	// get a reference to all div elements that will use background images once
	// all images are preloaded.
	allMonkeyImages = document.getElementsByClassName("monkey-image");

	// create a new instance of the ImagePreloader class.
	preloader = new ImagePreloader ();

	// start preloading images by calling the 'loadMultiple' method and pass in an array
	// of URLs for the images you want to preload and a callback to be fired once all images are loaded.
	preloader.loadMultiple (["img/01.jpg", "img/02.jpg", "img/03.jpg", "img/04.jpg", "img/05.jpg"], allImagesLoaded);
}

// function that runs once all images have been preloaded.
// You can do anything you want within this, I've simply chosen to do some basic CSS class manipulation.
function allImagesLoaded ()
{
	// remove the 'hidden' class from the wrapper now that all images have been loaded.
	wrapper.className = wrapper.className.replace ("hidden", "");


	// loop through all elements with the 'monkey-image' class and add an additional class of 'preloaded'.
	var i = 0,
		length = allMonkeyImages.length,
		currentMonkeyImage;
	
	for (i; i < length; ++i)
	{
		currentMonkeyImage = allMonkeyImages[i];
		currentMonkeyImage.className = currentMonkeyImage.className + " preloaded";
	}
}