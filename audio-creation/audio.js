TMW.Audio = {
	audioSupport : false,

	init : function () {
		if (document.createElement('audio').canPlayType) {
			//set var to say we support audio
			TMW.Audio.audioSupport = true;
			this.loadAudio();

			$('#audio-play').on('click', function (e) {
				e.preventDefault();
				TMW.Audio.playAudio(TMW.Audio.baciSound)
			});
		}
	},

	playAudio : function (sound) {

		sound.play();

	},

	loadAudio : function () {

		//  =============================
		//  === AUDIO BITS AND PIECES ===
		//  =============================

		var audio = new Audio(); //generic audio object for testing

		this.canPlayMP3 = !!audio.canPlayType && audio.canPlayType('audio/mp3') !== "";
		this.canPlayOgg = !!audio.canPlayType && audio.canPlayType('audio/ogg; codecs="vorbis"') !== "";

		//create and assign our audio files
		TMW.Audio.baciSound = this.createAudio("/audio/baci", false);

	},

	//generic function to create all new audio elements equal, with preload
	createAudio : function (audioFile, loopSet) {
		var tempAudio = new Audio(),
			audioExt;

		if (this.canPlayMP3) {
			audioExt = '.mp3';
		} else if (this.canPlayOgg) {
			audioExt = '.ogg';
		}

		tempAudio.setAttribute('src', audioFile + audioExt);
		tempAudio.preload = 'auto';
		tempAudio.loop = (loopSet === true ? true : false);

		return tempAudio;
	}
}