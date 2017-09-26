(function(){
  // Input --> Effects --> Destination

  // Creamos un audioContext, donde vamos a rutear los nodos de manera modular
  var contextClass = (window.AudioContext ||
  window.webkitAudioContext || window.mozAudioContext);

  //for sound to be passed into
  var audioBuffer;

  //for analyser node
  var analyzer;

    // Creamos un array vacío con la mitad de items
  var frequencyData = new Uint8Array(1024);

  // Chequeamos que la api de webaudio esté disponible
  if (contextClass) {
    // Web audio api disponible
    var audioContext = new contextClass();
    console.warn('yes!');
  } else {
    // Web audio api no disponible
    alert("Your browser does not support the Web Audio API, please upgrade or use a different browser");
    console.warn('Doesn´t support webapi');
  }

  // Creamos la(s) fuentes/sources
  function loadSound() {
    // URL del archivo de audio
    var audioFileUrl = 'Kodak74.mp3';
    // nuevo xml request
    var xhr = new XMLHttpRequest();
    // lo asociamos al archivo
    xhr.open("GET", audioFileUrl, true);
    // seteamos como vamos a usar el audio para poder procesarlo
    xhr.responseType = 'arraybuffer';

    xhr.onload = function() {
      // tomamos la respuesta y la decodificamos en un buffer on load
      context.decodeAudioData(xhr.response, function(buffer) {
        audioBuffer = buffer;
      });
      xhr.send();
    }
  }

  function createAnalyser(source) {
    // Creamos un nodo analyser
    analyzer = audioContext.createAnalyser();
    // seteamos el tamaño de la FFT (Fast Fourier transform)
    analyzer.fftSize = 2048;
    // Lo conectamos a una fuente/source
    source.connect(analyzer);
    // Lo conectamos a la salida de la compu
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

  // Para poder analizar la frecuencia debemos usar el nodo que nos brinda el analyser usando 'getFrequencyByteData', pasarlo a un array (un array typed es ideal). Para saber cuantos items va a tener el array podemos usar el atributo sampleRate del audioContext, lo que nos va a dar la "resolución" del sonido.
  // var sampleRate = audioContext.sampleRate;

  console.log(audioContext.sampleRate);



  // Necesitamos que el array se actualize constantemente, para no penalizar la performance en lugar de setInterval o setTimeOut podemos usar rAF
  function update() {
    requestAnimationFrame(update);
    // Traemos datos de manera constante del feedback
    analyzer.getByteFrequencyData(frequencyData);

  // Usamos 4 divs y jugamos con la opacidad de c/u como si se trataran de luces
  var lights = document.getElementsByTagName('i');
  var totalLights = lights.length;

  var keys = [12,14,15,16,18,20,22,24];

  for (var i=0; i<totalLights; i++) {
    // buscamos la frecuencia
    var freqDataKey = keys[i];
    // Usamos el gain, si está por encima del umbral animamos la luz
    if (frequencyData[freqDataKey] > 160) {
      // comenzamos la animación del elemento
      lights[i].style.opacity = "1";
    } else {
      lights[i].style.opacity = "0.2";
    }
  }
};



// function to check for audio
// if no audio, keep checking..
function waitForAudio(){
  if(typeof audioBuffer !== "undefined"){
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

});
