function Sound(source){
	if(!window.audioContext){
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		audioContext = new AudioContext();
	}

	var that = this;
	that.source = source;
	that.buffer = null;
	that.isLoaded = false;

	that.panner = audioContext.createPanner();
	that.volume = audioContext.createGain();
	that.volume.gain.value = 1;

    that.volumeMaster = audioContext.createGain();
	that.volumeMaster.gain.value = 1;

	var getSound = new XMLHttpRequest();
	getSound.open("GET", source, true);
	getSound.responseType = "arraybuffer";
	getSound.onload = function(){

		var audioData = getSound.response;
		var dv = new DataView(audioData);
		var junk = 0;
      	var position = 12;

		do {
          var header = String.fromCharCode.apply(null, new Uint8Array(audioData, position, 4));
          var length = dv.getUint32(position + 4, true);
          if (header.trim() === 'fmt') {
              junk = junk + length - 16;
          }
          position = position + 8 + length;
      	}while(position < audioData.byteLength);

		var productArray = new Uint8Array(audioData.byteLength - junk);
      	productArray.set(new Uint8Array(audioData, 0, 12));
      	var newPosition = 12;
      	position = 12;
      	var fmt_length_spot;


		do {
          var header = String.fromCharCode.apply(null, new Uint8Array(audioData, position, 4));
          var length = dv.getUint32(position + 4, true);
          if (header.trim() === 'fmt')
		  {
              productArray.set(new Uint8Array(audioData, position, 24), newPosition);
              fmt_length_spot = newPosition + 4;
              newPosition = newPosition + 24;
          }else {
              productArray.set(new Uint8Array(audioData, position, length + 8), newPosition);
              newPosition = newPosition + 8 + length;
          }
          position = position + 8 + length;
      	}while(position < audioData.byteLength);


		audioData = productArray.buffer;
      	dv = new DataView(audioData);
		dv.setUint32(4, audioData.byteLength - 8, true);
      	dv.setUint32(fmt_length_spot, 16, true);

		audioContext.decodeAudioData(audioData, function(buffer) {
        	source.buffer = buffer;
			that.isLoaded = true;

        },
        function(e){"Error with decoding audio data" + e.err});

	}
	getSound.send();
}


/*

*/
Sound.prototype.play = function(){
	if(this.isLoaded === true){
		var playSound = audioContext.createBufferSource();
		playSound.buffer = this.buffer;
		playSound.connect(this.panner);
		this.panner.connect(this.volume);
        this.volume.connect(this.volumeMaster);
		this.volumeMaster.connect(audioContext.destination);
		playSound.start(0);
	}
}


/*
	Getter und Setter
*/
Sound.prototype.setVolume = function(level){
	this.volume.gain.value = level;
}

Sound.prototype.setPan = function(xVal){
	this.panner.setPosition(xVal,0,0);
}

Sound.prototype.getVolume = function(){
	return this.volume.gain.value;
}

Sound.prototype.setVolumeMaster = function(level){
	this.volumeMaster.gain.value = level;
}

Sound.prototype.getVolumeMaster = function(){
	return this.volumeMaster.gain.value;
}
