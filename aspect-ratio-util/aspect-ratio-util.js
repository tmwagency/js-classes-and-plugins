function AspectRatioUtil (portraitCallback, landscapeCallback, useResizeInsteadOfOrientationchange)
{
	// ------------------------------------------------------------
	// PRIVATE MEMBER VARIABLES
	// ------------------------------------------------------------
	var _self = this,
		_updateEventType = useResizeInsteadOfOrientationchange === true ? "resize" : "orientationchange",
		_isMobile = "onorientationchange" in window && "ontouchstart" in window ? true : false,
		_isPortrait = false,
		_isLandscape = false,
		_isRunning = false;

	// ------------------------------------------------------------
	// PUBLIC MEMBER VARIABLES
	// ------------------------------------------------------------
	_self.portraitCallback = portraitCallback;
	_self.landscapeCallback = landscapeCallback;

	// ------------------------------------------------------------
	// PRIVATE METHODS
	// ------------------------------------------------------------
	function checkAspectRatio (event)
	{
		// return immediately if callbacks are not set.
		if (typeof _self.landscapeCallback !== "function" || typeof _self.portraitCallback !== "function") return;

		var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
			height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

		if (width > height)
		{
			// only continue if aspect ratio is not already landscape.
			if (!_isLandscape)
			{
				_isPortrait = false;
				_isLandscape = true;

				// only run callback when on mobile.
				if (_isMobile) _self.landscapeCallback ();
			}
		}
		else if (height > width)
		{
			// only continue if aspect ratio is not already portrait.
			if (!_isPortrait)
			{
				_isLandscape = false;
				_isPortrait = true;

				// only run callback when on mobile.
				if (_isMobile) _self.portraitCallback ();
			}
		}
	}


	// ------------------------------------------------------------
	// PUBLIC API
	// ------------------------------------------------------------
	_self.checkIfMobile = function ()
	{
		return _isMobile;
	};

	_self.checkIfPortrait = function ()
	{
		return _isPortrait;
	};

	_self.checkIfLandscape = function ()
	{
		return _isLandscape;
	};

	_self.start = function ()
	{
		if (_isRunning) return;

		// immediately check aspect ratio in order to set accurate initial values.
		checkAspectRatio ();

		window.addEventListener (_updateEventType, checkAspectRatio);

		_isRunning = true;
	};

	_self.stop = function ()
	{
		if (!_isRunning) return;

		window.removeEventListener (_updateEventType, checkAspectRatio);

		_isRunning = false;
	};
}

window.AspectRatioUtil = AspectRatioUtil;


// ------------------------------------------------------------------------------------------- //
// AddEventListener shim for older browsers from Mozilla:
// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget.removeEventListener
// ------------------------------------------------------------------------------------------- //
if (!Element.prototype.addEventListener) {
  var oListeners = {};
  function runListeners(oEvent) {
    if (!oEvent) { oEvent = window.event; }
    for (var iLstId = 0, iElId = 0, oEvtListeners = oListeners[oEvent.type]; iElId < oEvtListeners.aEls.length; iElId++) {
      if (oEvtListeners.aEls[iElId] === this) {
        for (iLstId; iLstId < oEvtListeners.aEvts[iElId].length; iLstId++) { oEvtListeners.aEvts[iElId][iLstId].call(this, oEvent); }
        break;
      }
    }
  }
  Element.prototype.addEventListener = function (sEventType, fListener /*, useCapture (will be ignored!) */) {
    if (oListeners.hasOwnProperty(sEventType)) {
      var oEvtListeners = oListeners[sEventType];
      for (var nElIdx = -1, iElId = 0; iElId < oEvtListeners.aEls.length; iElId++) {
        if (oEvtListeners.aEls[iElId] === this) { nElIdx = iElId; break; }
      }
      if (nElIdx === -1) {
        oEvtListeners.aEls.push(this);
        oEvtListeners.aEvts.push([fListener]);
        this["on" + sEventType] = runListeners;
      } else {
        var aElListeners = oEvtListeners.aEvts[nElIdx];
        if (this["on" + sEventType] !== runListeners) {
          aElListeners.splice(0);
          this["on" + sEventType] = runListeners;
        }
        for (var iLstId = 0; iLstId < aElListeners.length; iLstId++) {
          if (aElListeners[iLstId] === fListener) { return; }
        }     
        aElListeners.push(fListener);
      }
    } else {
      oListeners[sEventType] = { aEls: [this], aEvts: [ [fListener] ] };
      this["on" + sEventType] = runListeners;
    }
  };
  Element.prototype.removeEventListener = function (sEventType, fListener /*, useCapture (will be ignored!) */) {
    if (!oListeners.hasOwnProperty(sEventType)) { return; }
    var oEvtListeners = oListeners[sEventType];
    for (var nElIdx = -1, iElId = 0; iElId < oEvtListeners.aEls.length; iElId++) {
      if (oEvtListeners.aEls[iElId] === this) { nElIdx = iElId; break; }
    }
    if (nElIdx === -1) { return; }
    for (var iLstId = 0, aElListeners = oEvtListeners.aEvts[nElIdx]; iLstId < aElListeners.length; iLstId++) {
      if (aElListeners[iLstId] === fListener) { aElListeners.splice(iLstId, 1); }
    }
  };
}