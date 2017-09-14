var getContext = function() {
  var ac = null;
  if ( !window.AudioContext && !window.webkitAudioContext ) {
    console.warn('Web Audio API not supported in this browser');
  } else {
    ac = new ( window.AudioContext || window.webkitAudioContext )();
  }
  return function() {
    return ac;
  };
}();


function Sound(source){

	audioContext = getContext();


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
		audioContext.decodeAudioData(getSound.response, function(buffer){
			that.buffer = buffer;
			that.isLoaded = true;
		});
	}
	getSound.send();
}

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
