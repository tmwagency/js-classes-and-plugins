# KOslider [beta]
## Simple jQuery carousel plugin using CSS3 transitions

###Example usage on an HTML element:

```html
data-koslider='{"dots":"true","arrows":"true","keys":"true","uiPosition":"above","debug":"true"}'
```

Can also be called using standard jQuery syntax, for example:
```js
$('.slider').KOslider({
	keys : true,
	uiPosition : "below",
	customPrevClass : "icon-arrow-previous",
	customNextClass : "icon-arrow-next",
	debug : true,
	itemWidth : "200px"
});
```

#### Default options:
```
"keys"            : false,                 [boolean] keyboard shortcuts (boolean)
"dots"            : true,                  [boolean] display ••••o• pagination (boolean)
"dotsClick"       : false                  [boolean] enable clickable dots
"arrows"          : true,                  [boolean] display prev/next arrows (boolean)
"sliderEl"        : ".slider",             [string]  slides container selector
"slide"           : ".slide",              [string]  slidable items selector
"uiPosition"      : "above",               [string]  Options: above or below
"customPrevClass" : "icon-arrow-previous", [string]  Classname for prev button icon
"customNextClass" : "icon-arrow-next"      [string]  Classname for next button icon
"debug"           : false                  [boolean] Show debug info
"setHeight"       : "auto"                 [string]  "auto" = Change height of slides according to content; "equal" = equalise height of all slides; "none" = don't adjust height at all
"debug"           : false                  [boolean] Show debug info
"autoplay"        : false                  [boolean] autoplay the slider
"autoplayInterval": 4000                   [integer] Change the autoplay speed
"swipe"           : false                  [boolean] enable swipe for touch
"itemWidth"       : undefined              [string]  define an element width instead of calculating it
"inactiveClass"   : "slider--inactive"     [string]
"activeClass"     : "slider--active"       [string]
"callbacks"       : undefined              [object]  Add custom callbacks
"equaliseEl"      : undefined              [string]  Selector used to calculate equalised heights
```