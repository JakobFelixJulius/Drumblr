//BPM
var tempo = 120;

//Variablen für mute
var stopStart = false;
var masterVol = 1.0;
var tempBeats = 1;

//millisekunden für jede 16. Note
var loopDuration = 60000 / tempo / 4;

//16 Beats mit 8 Stimmen
var numInstruments = 8;
var numBeats = 16;

var currentBeatIdx = 0;

//Ordnernamen der Drumkits
var kitnames = ["tr909", "tr808", "tr707", "beatbox", "acoustic"];

//Sounds
var instruments = ['Kick', 'Snare', 'Clap',  'HiHatop', 'HiHatcl', 'Tom1', 'Tom2', 'Tom3'];

//Array zum speichern der Kits
var Kits = [];

//Aktuell ausgewähltes Kit
var currKit = 0;

//Verschiedene Kits in Array speichern
for (i = 0; i < kitnames.length; i++) {
	Kits[i] = new drumkit(kitnames[i], instruments);
	Kits[i].loadKit();
}

/*
Funktion, zum setzen der BPM
@param bpm: String, mit eingegebener BPM (kann alle Zeichen enthalten)
*/
function setbpm(bpm) {

	//Nicht erlaubte Zeichen finden und durch nichts ersetzen
	bpm = bpm.replace(/[^0-9]+/,"");
	//BPM in Textfeld plazieren
	document.getElementById('bpm').value=bpm;

	//Grenzen pruefen
	if(bpm<50){
		bpm = 50;
	}else if(bpm>999){
		bpm = 999;
	}else if(bpm == ""){
		bpm = 120;
	}
	document.getElementById('bpm').value=bpm;
	tempo = bpm
	loopDuration = 60000 / tempo / 4;
}

/*
Funktion, zum erhöhen der BPM
*/
function increasebpm(){
	if(tempo >=50 && tempo<999){
		tempo++;
		loopDuration = 60000 / tempo / 4;
		document.getElementById('bpm').value=tempo;
	}
}

/*
Funktion, zum verringern der BPM
*/
function decreasebpm(){
	if(tempo > 50 && tempo <= 999){
		tempo--;
		loopDuration = 60000 / tempo / 4;
		document.getElementById('bpm').value=tempo;
	}
}

/*
Funktion, die beim Verringern der Beats die restlichen Lauflichter der UI abschaltet.
Die Div-Klassennahmen werden entsprechend neugesetzt.
@para number: Nummer, ab der alle Lauflichter abgeschaltet werden sollen
*/
function switchOffLamps(number){
	for(var i = number; i < 16; i ++){
		var indicator = document.getElementById("indicator" + i);
		var element = document.getElementById(1 + "_" + i);
		indicator.className= "";

		if(element.isPattern_felem){
				indicator.className = " indicator_felem";
			}else{
				indicator.className = " indicator_elem";
			}

	}
}

/*
Funktion, zum setzen der Beats
@param bpm: String, mit eingegebenen Beats (kann alle Zeichen enthalten)
*/
function setBeats(bts){
	bts = bts.replace(/[^0-9]+/,"");
	document.getElementById('beats').value=bts;


	if(bts<=0){
		bts = 1;
	}else if(bts>16){
		bts = 16;
	}else if(bts == ""){
		bts = 16;
	}
	document.getElementById('beats').value=bts;
	numBeats = bts;
	switchOffLamps(numBeats);
}

/*
Funktion, zum erhöhen der Beats
*/
function increaseBeats(){
	if(numBeats >=0 && numBeats<16){
		numBeats++;
		document.getElementById('beats').value=numBeats;
	}
}

/*
Funktion, zum verringern der Beats
*/
function decreaseBeats(){
	if(numBeats>1 && numBeats<=16){
		numBeats--;
		document.getElementById('beats').value=numBeats;
		switchOffLamps(numBeats);
	}
}


/*
Hauptschleife der Drummachine
*/
function loop(){
	//Wenn der aktuelle BeatIndex >= Der Anzahl der Beats ist
	if(currentBeatIdx >= numBeats){
		currentBeatIdx = 0;
	}

	//Doppelte For-Schleife über die Anzahl der Instrumente und Anzhal der Beats
	for (var i = 0; i < numInstruments; i ++){
		for(var j = 0; j < numBeats; j ++){

			var element = document.getElementById(i + "_" + j);
			var indicator = document.getElementById("indicator" + j);
			element.className = "";
			indicator.className= "";

			if(element.isPattern_felem){
				element.className += " pattern_felem";
				indicator.className += " indicator_felem";
			}else{
				indicator.className += " indicator_elem";
				element.className += " pattern_elem";
			}

			if(element.pattern_active){
				element.className += " pattern_active";
			}else{
				element.className += " pattern_inactive";
			}
			if (j == currentBeatIdx){
			//Lauflicht an der stelle aktivieren
				indicator.className += " indicatorHighlighted";
			}

		}
	}

	//Sounds abspielen
	for(var i = 0; i < numInstruments; i++){
		if (document.getElementById(i + "_" + currentBeatIdx).pattern_active)
	        {
	        	Kits[currKit].getKitSound(i).play();
	        }

	}

		//Timeout
		ctime = setTimeout("loop();", loopDuration);

        currentBeatIdx ++;
}

/* Panning */
function setSoundPanning(id, kitSound){
	document.getElementById(id).addEventListener('change', function() {
		Kits[currKit].getKitSound(kitSound).setPan(this.value);
	});
}

/* Lautstärke */
function setSoundVolume(id, kitSound){
	document.getElementById(id).addEventListener('change', function() {
		Kits[currKit].getKitSound(kitSound).setVolume(this.value * masterVol);
	});
}

/*MasterVolume*/
function setMasterVolume(){
	document.getElementById("masterVolume").addEventListener('change', function() {
		masterVol = this.value;
		for(var i = 0; i < instruments.length; i++) {
			Kits[currKit].getKitSound(i).setVolumeMaster(masterVol);
		}
		});
}
/*PAUSE*/
function holdPlay(){
	if (!stopStart){
        masterVol = Kits[currKit].getKitSound(0).getVolumeMaster();
		for(var i = 0; i < instruments.length; i++) {
				Kits[currKit].getKitSound(i).setVolumeMaster(0);
		}

		tempBeats = numBeats;
		numBeats = 1;
		switchOffLamps(numBeats);

	}else{
		for(var i = 0; i < instruments.length; i++) {
				Kits[currKit].getKitSound(i).setVolumeMaster(masterVol);
		}

		numBeats = tempBeats;
		tempBeats = 1;
		switchOffLamps(numBeats);
	}

	stopStart = !stopStart;

}

/*
Funktion, die bei onLoad ausgefuehrt wird
*/
function initAudio(){

	for (var i = 0; i < numInstruments; i ++){
		setSoundVolume('volume_0' + (i+1).toString(), i);
		setSoundPanning('pan_0' + (i+1).toString(), i);
	}
	setMasterVolume();
}

/*
Initialisierungsfunktion der Drum-Machine welche bei onload ausgeführt wird
Generiert unter anderem das Pattern
*/
function onStartUp(){

	initAudio();

	//Pattern Element aus dem DOM holen
	var pattern = document.getElementById("pattern");

	//div Element für indicator row erstellen
	var indicator_row = document.createElement("div");
	indicator_row.id = "indicator_row";

	//Div-Elemente fuer die Indikator-Lichter generieren
	for (var k = 0; k < numBeats; k ++){

		var inputRef = document.createElement("div");
        inputRef.setAttribute("id", "indicator" + k);
        inputRef.indicator_active = false;

		//Bei dem 1. und jedem 4. Element handelt es sich um ein FElement
		//Benötigt, um per css größere Abstände zwischen den elementen zu formatieren
		if (k >= 0 && k % 4 == 0){
        	inputRef.className = " indicator_felem";
     	}else{
         	inputRef.className = " indicator_elem";

     	}
		//inputref an indicator row anheften
		indicator_row.appendChild(inputRef);
	}
	//fertig generierte indicator row an das pattern div anhängen
	pattern.appendChild(indicator_row);


	//Div-Elemente fuer die Knoepfe generieren
	for (var i = 0; i < numInstruments; i ++)
        {
            var patternrow = document.createElement("div");
            for (var j = 0; j < numBeats; j ++)
            {
                var inputRef = document.createElement("div");
                inputRef.setAttribute("id", i + "_" + j);
                inputRef.pattern_active = false;

				//Eventlistener handleClick hinzufügen
                inputRef.addEventListener("mousedown", handleClick, "true");
                if (j >= 0 && j % 4 == 0)
                {
                    inputRef.isPattern_felem = true;
                    inputRef.className = " pattern_inactive pattern_felem";
                }
                else
                {
                    inputRef.className = " pattern_inactive pattern_elem";
                }
                patternrow.appendChild(inputRef);
                patternrow.className = "pattern_row";
            }
            pattern.appendChild(patternrow);
        }

		//BPM setzen
		document.getElementById('bpm').value=tempo;
		//BEATS setzen
		document.getElementById('beats').value=numBeats;

		//Kitliste dynamisch füllen (dropdown)
		var kitlist = document.getElementById("kitlist");
		for(var i = 0; i < kitnames.length; i++) {
		    var opt = document.createElement('option');
		    opt.innerHTML = kitnames[i];
		    opt.value = i;
		    kitlist.appendChild(opt);
		}

		//ActionListener für Kistlisten-Combobox
		kitlist.onchange = function() {
			prevKit= currKit;
		    currKit= this.value;
		    for(var i = 0; i < instruments.length; i++) {
				Kits[currKit].getKitSound(i).setVolume(Kits[prevKit].getKitSound(i).getVolume()) ;
			}
		}

		//Eintritt in Hauptschleife
		loop();
}

/*
Funktion, für das Eventhandling der einzelnen Pads
@param event
*/
function handleClick(event){
	event.target.pattern_active = !event.target.pattern_active;

	if (event.target.pattern_active)
	{
		event.target.className = " pattern_active";
	}else
	{
		event.target.className = " pattern_inactive";
	}

	if (event.target.isPattern_felem)
	{
		event.target.className += " pattern_felem";
	}else
	{
			event.target.className += " pattern_elem";
	}

}
