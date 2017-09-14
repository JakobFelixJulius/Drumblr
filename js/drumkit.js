/*

*/

// Konstructor fuer eine neues Drumkit Objekt
function drumkit(name, instruments) {
    //instanz variablen
    this.name = name;
    this.numInstruments = instruments.length;
    this.sound = [];
    this.instruments = instruments;
	this.pathName = "mp3/" + name + "/";
}

drumkit.prototype.loadKit = function() {
	for (var i = 0; i < this.numInstruments; i++){
		this.sound[i] = new Sound(this.pathName + this.instruments[i] + ".mp3");
	}
}

drumkit.prototype.getKitSound = function(i){
	return this.sound[i];
}



