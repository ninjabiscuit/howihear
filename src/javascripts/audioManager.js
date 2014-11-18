var bufferLoader = require("./bufferLoader");
var hearingTestData = require("./data")

var AUDIO_PATHS = [
  'picard.mp3',
  'speech.mp3'
];

var context = new (AudioContext || webkitAudioContext)();
var sources = {}, currentSound = "", filtered = false, playing = false;
var bufferLoader = bufferLoader(context, AUDIO_PATHS).then(audioReady);

function audioReady(bufferList) {
  bufferList.reduce(function(memo, buffer, i){
    var key = AUDIO_PATHS[i];
    memo[key] = buffer;
    return memo;
  }, sources);
}

function createBufferSource(buffer) {
  var source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source.onended = function(){
    playing = false;
    filtered = false;
  };
  return source;
}

function play(sound) {
  if (!sound) { return; }
  currentSound = createBufferSource(sources[sound]);
  if (!currentSound.start) {
    currentSound.start = currentSound.noteOff;
  }
  currentSound.start(0);
  playing = true;
}

function stop() {
  //console.log(!currentSound, "boom")
  if (!currentSound) { return; }
  currentSound.stop(0);
  playing = false;
  filtered = false;
};

function togglePlay(sound) {
  //console.log(playing ? "stop" : "play");
  playing ? stop(sound) : play(sound);
  //console.log(playing)
}

function applyFilters(source, data, channel) {
  return data.slice(1).reduce(function(){
    return applyFilter.apply(null, [].slice.call(arguments, 0, 2));
  }, applyFilter(source, data[0], channel));
}

function applyFilter(source, data, channel) {
  var filter = context.createBiquadFilter();
  filter.type = "peaking";
  filter.frequency.value = data.hz;
  filter.Q.value = 30;
  filter.gain.value = -data.db;

  source.connect(filter, channel);

  return filter;
}

function filterOff() {
  currentSound.disconnect();
  currentSound.connect(context.destination);
  filtered = false;
}

function filterOn() {
  var splitter = context.createChannelSplitter(2);
  var merger = context.createChannelMerger(2);

  filtered = true;

  currentSound.disconnect();
  currentSound.connect(splitter);

  applyFilters(splitter, hearingTestData.left, 0).connect(merger, 0, 0);
  applyFilters(splitter, hearingTestData.right, 1).connect(merger, 0, 1);

  merger.connect(context.destination);
}

function isCurrentSound(name) {
  console.log(playing, "playing")
  console.log(currentSound.buffer === sources[name], "buffer")
  return currentSound.buffer === sources[name]
}

var playButtons = document.querySelectorAll(".play");
var toggleButton = document.getElementById("toggle");

document.addEventListener("click", function(e){
  if (e.target.classList.contains("play")) {
    if (!isCurrentSound(e.target.getAttribute("data-sound"))) { stop(); }
    togglePlay(e.target.getAttribute("data-sound"));
  }
}, false);

toggleButton.addEventListener("click", function(){
  if (!playing) {return;}
  if (filtered) {
    filterOff();
    return;
  }
  filterOn();
}, false);

