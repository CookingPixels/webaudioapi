//Audio stuff---------------------------------------------
var contextClass = (window.AudioContext ||
  window.webkitAudioContext || window.mozAudioContext);
//for sound to be passed into
var audioBuffer;
//for analyser node
var analyzer;
//set empty array half of fft size or equal to frequencybincount (you could put frequencybincount here if created)
var frequencyData = new Uint8Array(1024);

if (contextClass) {
  // Web Audio API is available.
  var audioContext = new contextClass();
  console.warn('yes!');
} else {
  // Web Audio API is not available. Ask the user to use a supported browser.
  alert("Oh nos! It appears your browser does not support the Web Audio API, please upgrade or use a different browser");
  console.warn('poobags');
}

//load audio file from server
function loadSound() {
	var audioFileUrl = 'https://fourthof5assets.s3-eu-west-1.amazonaws.com/heng-feeling-good.mp3';
	var request = new XMLHttpRequest();
	request.open("GET", audioFileUrl, true);
	request.responseType = "arraybuffer";

	request.onload = function() {
		//take from http request and decode into buffer
		audioContext.decodeAudioData(request.response, function(buffer) {
	    	audioBuffer = buffer;
	     });
		}
	request.send();
}

function createAnalyser(source) {
	//create analyser node
	analyzer = audioContext.createAnalyser();
	//set size of how many bits we analyse on
	analyzer.fftSize = 2048;
	//connect to source
	source.connect(analyzer);
	//pipe to speakers
	analyzer.connect(audioContext.destination);
}

function playSound(buffer) {
	//creating source node
	var source = audioContext.createBufferSource();
	//passing in file
	source.buffer = audioBuffer;
	createAnalyser(source);
	//start playing
	source.start(0);
}

function update() {
  	requestAnimationFrame(update);
  	//constantly getting feedback from data
  	analyzer.getByteFrequencyData(frequencyData);

// Animation stuff--------------------------------
var lights = document.getElementsByTagName('i');
var totalLights = lights.length;

//every item in frequencyData array is about 23.44hz apart
//(48000/1024 or sample rate over total array items)
//Assuming the octave starts on middle C we should be able to work out the frequency of each note... divide the frequency by 23.44 and we'll get the index of that frequency
//Yay! Wikipedia tells us http://en.wikipedia.org/wiki/Piano_key_frequencies
// C = 261.6 | [11]
// D = 293.6 | [12.5]
// E = 329.6 | [14]
// F = 349.2 | [15]
// G = 392   | [16.7]
// A = 440   | [18.7]
// B = 493.9 | [21]
// C = 523.3 | [22.3]

var keys = [12,14,15,16,18,20,22,24];

for (var i=0; i<totalLights; i++) {
	var freqDataKey = keys[i];
	//if gain is over threshold
	if (frequencyData[freqDataKey] > 140){
		//start animation on element
    lights[i].style.opacity = "1";
    lights[i].style.transform = "translateY(-20px)";
	} else {
    lights[i].style.opacity = "0.2";
    lights[i].style.transform = "translateY(0)";
	}
  if (frequencyData[freqDataKey] > 165){
    lights[i].style.borderColor = "red";
    lights[i].style.transform = "translateY(-40px)";
  } else {
    lights[i].style.borderColor = "blue";
    lights[i].style.transform = "translateY(0)";
  }

}
};

// function to check for audio
// if no audio, keep checking..
function waitForAudio(){
  if(typeof audioBuffer !== "undefined"){
    console.warn('Audio Ready!');
		playSound(audioBuffer);
		update();
  }
  else{
      setTimeout(function(){
      	console.log("waiting for audio");
      		loadSound();
          waitForAudio();
      },25);
  }
}

// load audio file here
waitForAudio();
// left here just for example
console.log(audioContext.sampleRate);
