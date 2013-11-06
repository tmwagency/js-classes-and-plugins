var TMW = window.TWW || {};

/*	Adaptive Image method
:	-------------------------
:	Borrows heavily from Scott Jehls picturefill.js
:	https://github.com/scottjehl/picturefill
:
:	but is structured differently in HTML and slight tweaks to work a bit 'tidier'
:	with respect to drupal and the adaptive image module
:
:
:	Function List
:	1. init
:	2. adaptiveChecker
********************************************************/
TMW.AdaptiveImage = {

	init : function(w) {

		// Run on resize and domready (w.load as a fallback)
		if( w.addEventListener ) {
			w.addEventListener( "DOMContentLoaded", function(){
				TMW.AdaptiveImage.adaptiveChecker();
				// Run once only
				w.removeEventListener( "load", TMW.AdaptiveImage.adaptiveChecker, false );
			}, false );
			w.addEventListener( "load", TMW.AdaptiveImage.adaptiveChecker, false );
		}
		else if( document.attachEvent ){
			w.attachEvent( "onload", function () {
				TMW.AdaptiveImage.adaptiveChecker();
			} );
		}

	},


	adaptiveChecker : function (elements) {

		var ps = elements || window.document.getElementsByTagName( "div" );
		// Loop the pictures
		for( var i = 0, il = ps.length; i < il; i++ ) {
			if( ps[ i ].getAttribute( "data-adaptive" ) !== null &&
				ps[ i ].style.display !== 'none' ) {
				var selected_breakpoint = 'max',
					breakpoints = ps[ i ].getAttribute("data-adaptive-image-breakpoints");

				if (breakpoints) {
					breakpoints = breakpoints.split(' ');

					for( var j = 0, br = breakpoints.length; j < br; j++ ){
						if (document.documentElement.clientWidth <= Number(breakpoints[j]) &&
							(selected_breakpoint == 'max' || Number(breakpoints[j]) < Number(selected_breakpoint))) {
							selected_breakpoint = breakpoints[j];
						}
					}
				}


				//get the image path for the right breakpoint
				imgPath = ps[ i ].getAttribute('data-img-' + selected_breakpoint);

				// Find any existing img element in the adaptive element
				var picImg = ps[ i ].getElementsByTagName( "img" )[ 0 ];

				if( imgPath ){
					if( !picImg ){
						picImg = document.createElement( "img" );
						picImg.alt = ps[ i ].getAttribute( "data-alt" );
						ps[ i ].appendChild( picImg );
					}

					picImg.src =  imgPath;
				}
				else if( picImg ){
					ps[ i ].removeChild( picImg );
				}
			}
		}
	}
}

TMW.AdaptiveImage.init(window);