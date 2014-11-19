var context = new (AudioContext || webkitAudioContext)();
var oscillator;
var timeout;

function play(frequency) {
  oscillator && oscillator.stop(0)
  oscillator = context.createOscillator(); // Create sound source

  var gain = context.createGain();
  gain.gain.value = 0.2; // Set gain node 2 to 30 percent

  oscillator.type = 1; // Sine wave
  oscillator.frequency.value = parseInt(frequency, 10); // Frequency in hertz

  oscillator.connect(gain); // Connect sound to output
  gain.connect(context.destination); // Connect gain node 2 to output 
  oscillator.start(0); // Play instantly
  clearTimeout(timeout);
  timeout = setTimeout(function(){
    oscillator.stop(0);
  }, 2000)
}

document.addEventListener("click", function(e){
  if (!e.target.classList.contains("tone")) { return; }
  play(e.target.getAttribute("data-frequency"));
}, false);

