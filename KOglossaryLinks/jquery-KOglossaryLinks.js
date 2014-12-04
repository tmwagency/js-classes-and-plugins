/**
 *   KOglossaryLinks by @mrmartineau *
 *   Loop through elements with .glossaryLink class and use the value to lookup data in a json feed.
 *
 *   Example HTML usage:
		<a href="" class="glossaryLink" data-koglossarylink='Glossary term'>Glossary term</a>
 *
 *   Example JS usage:
	 $(document.body).KOglossaryLinks({
		 sourceURL    : '/js/dist/glossary.json',
		 element      : '.glossaryLink',
		 tooltipwidth : 260,
		 debug        : true
	 });

 *   Default option:
		 sourceURL    : ''               [string]  - URL of the JSON file with format {"term": "", "description": ""}
		 tooltipwidth : 260,             [integer] - Width of tooltip. This should correspond to the CSS you are using for the tooltip
		 debug        : false            [boolean] - Show debug messages in the console
 */

;(function ($, f) {
	var KOglossaryLinks = function () {

		var _ = this;
		_.tooltipClass = 'KOglossaryLinkTooltip';
		_.element      = '[data-koglossarylink]';

		// Set some default options
		_.options = {
			sourceURL: '',
			tooltipwidth: 260,
			debug: false
		};

		_.init = function (el, options) {
			_.options = $.extend(_.options, options);
			_.el = el;
			_.overEvent = _.supportsTouch() ? "click" : "mouseover";
			_.terms = {};

			if (_.options.debug) { console.log('_.options', _.options); }

			$.getJSON(_.options.sourceURL).then(function (data) {
				var jsonData = data;

				for (var i = 0; i < jsonData.length; i++) {
					_.terms[jsonData[i].term.toLowerCase()] = jsonData[i]; // FIXME: toLowerCase
					// Usage: _.terms[data whatever];
				}
				if (_.options.debug) { console.log('All the terms:', _.terms); }
			});

			_.el.on(_.overEvent, _.element, function (event) {
				event.preventDefault();
				event.stopPropagation();

				// Close all other tooltips before opening this one
				_.el.find(_.element).children('.' + _.tooltipClass).removeClass('is-visible');

				var tooltipState       = $(this).parent('.tooltipWrapper').length ? true : false; // Check if the toolip has been created already
				var data               = $(this).data('koglossarylink') !== undefined ? $(this).data('koglossarylink').toLowerCase() : '';
				var tooltipCloseMarkup = _.supportsTouch() ? '<div class="' + _.tooltipClass + '-close icon-close"></div>' : '';
				var toolTipTitleClass  = _.supportsTouch() ? _.tooltipClass + '-title ' + _.tooltipClass + '-title--touch' : _.tooltipClass + '-title';

				if ( $(this).parent('.' + _.tooltipClass).hasClass('is-visible') ) {
					$(this).parent('.' + _.tooltipClass).removeClass('is-visible');
				} else {
					// Only create markup if the tooltip hasn't been created
					if (tooltipState) {
						$(this).find('.' + _.tooltipClass).addClass('is-visible');
						_.positionTooltip($(this));
						return;
					} else {
						if (_.terms[data] !== undefined) {
							var tooltip = '<div class="' + _.tooltipClass + '"><h3 class="' + toolTipTitleClass + '">' + _.terms[data].term + '</h3><div class="' + _.tooltipClass + '-description">' + _.terms[data].description + '</div>' + tooltipCloseMarkup + '<span class="' + _.tooltipClass + '-triangle"></span></div>';
							$(this).wrap("<span class='tooltipWrapper'></span>").append(tooltip);
							$(this).find('.' + _.tooltipClass).addClass('is-visible');
							_.positionTooltip($(this));
						} else {
							if (_.options.debug) { console.log('No term found'); }
						}
					}
				}
			});

			_.el.on('mouseout', _.element, function () {
				$(this).find('.' + _.tooltipClass).removeClass('is-visible');
			});

			_.el.on('click', _.element + ' .' + _.tooltipClass + '-close', function (event) {
				event.preventDefault();
				event.stopPropagation();
				$(this).parent('.' + _.tooltipClass).removeClass('is-visible');
			});

			$(window).resize(_.positionTooltip(_.el.find(_.element)));

			return _;
		};

		_.positionTooltip = function ($el) {
			if ($el.offset() === undefined) { return; }

			var $pos = parseInt($el.offset().left, 10);
			var $elWidth = $el.width();
			var $elCenterPoint = parseInt($pos + ($elWidth / 2), 10);
			var $windowWidth = $(window).width();
			var halfTooltipWidth = _.options.tooltipwidth / 2;
			var $tooltip = $el.find('.' + _.tooltipClass);
			var $tooltipTriangle = $el.find('.' + _.tooltipClass + '-triangle');
			var difference;
			var newTooltipCentre;
			var newArrowCentre;

			if ($elCenterPoint + halfTooltipWidth > $windowWidth) {
				// El is floating off right side
				difference       = parseInt( (($elCenterPoint + halfTooltipWidth) - $windowWidth) + 20 , 10);
				newTooltipCentre = parseInt(halfTooltipWidth + (difference / 2) + 20, 10);
				newArrowCentre   = parseInt(10 + (difference / 2), 10);

				if (_.options.debug) {
					console.log('El is floating off right side:', '\nwindow width', $windowWidth, '\nelcentrepoint', $elCenterPoint, '\ndifference', difference, '\nnewtooltipcentre', newTooltipCentre, '\nnewarrowcentre', newArrowCentre);
				}

				$tooltip.css({
					marginLeft: '-' + newTooltipCentre + 'px'
				});
				$tooltipTriangle.css({
					marginLeft: newArrowCentre + 'px'
				});

			} else if ($elCenterPoint - halfTooltipWidth < 0) {
				// El is floating off left side
				difference       = parseInt($elCenterPoint, 10);
				newTooltipCentre = difference - 20;
				newArrowCentre   = (halfTooltipWidth - 10) - (difference - 40);

				if (_.options.debug) {
					console.log('El is floating off left side:', '\nwindow width', $windowWidth, '\nelcentrepoint', $elCenterPoint, '\ndifference', difference, '\nnewtooltipcentre', newTooltipCentre, '\nnewarrowcentre', newArrowCentre);
				}

				$tooltip.css({
					marginLeft: '-' + newTooltipCentre + 'px'
				});
				$tooltipTriangle.css({
					marginLeft: '-' + newArrowCentre + 'px'
				});

			} else {
				// Reset position back to normal
				$tooltip.css({
					marginLeft: '-' + halfTooltipWidth + 'px'
				});
				$tooltipTriangle.css({
					marginLeft: '-10px'
				});
			}
		};

		_.supportsTouch = function() {
			return ('ontouchstart' in document.documentElement) || (window.DocumentTouch && document instanceof DocumentTouch || navigator.msMaxTouchPoints ? true : false);
		};

	};


	//  Create a jQuery plugin
	$.fn.KOglossaryLinks = function (options) {
		var len = this.length;

		return this.each(function (index) {
			var me = $(this),
				key = 'KOglossaryLinks' + (len > 1 ? '-' + ++index : ''),
				instance = (new KOglossaryLinks).init(me, options)
			;

			//  Invoke an KOglossaryLinks instance
			me.data(key, instance).data('key', key);
		});
	};

	KOglossaryLinks.version = "0.3.0";
})(jQuery, false);
