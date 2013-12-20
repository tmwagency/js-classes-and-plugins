function AudioUtil ()
{
	var _self = this,
		_audioSupported = document.createElement("audio").canPlayType ? true : false,
		_testAudio = "undefined",
		_canPlayMP3 = "undefined",
		_canPlayOgg = "undefined",
		_soundPool = {};

	if (_audioSupported)
	{
		_testAudio = new Audio(); //generic audio object for testing

		_canPlayMP3 = !!_testAudio.canPlayType && _testAudio.canPlayType('audio/mp3') !== "";
		_canPlayOgg = !!_testAudio.canPlayType && _testAudio.canPlayType('audio/ogg; codecs="vorbis"') !== "";
	}


	_self.createSound = function (audioFileName, loop)
	{
		// fail silently if audio is not supported.
		if (!_audioSupported) return;

		// if we have already created this sound then return it from the object pool.
		if (typeof _soundPool[audioFileName] !== "undefined")
		{
			return _soundPool[audioFileName];
		}

		var audio = new Audio(),
			fileExtension;

		if (_canPlayMP3)
		{
			fileExtension = ".mp3";
		}
		else if (_canPlayOgg)
		{
			fileExtension = ".ogg";
		}

		audio.setAttribute("src", audioFile + fileExtension);
		audio.preload = "auto";
		audio.loop = loop === true ? true : false;

		_soundPool[audioFileName] = audio;

		return audio;
	};

	_self.play = function (sound)
	{
		// fail silently if audio is not supported.
		if (!_audioSupported) return;

		sound.play ();
	};
}