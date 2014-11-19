var bufferLoader = require("./bufferLoader");
var hearingTestData = require("./data")

var AUDIO_PATHS = [
  'female-radio4.mp3',
  'male-radio4.mp3'
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
  console.log("audio ready")
}

function AudioSource(sound) {
  var fn = this;
  this.source = context.createBufferSource();
  this.source.buffer = sources[sound];
  this.source.connect(context.destination);
  this.source.onended = function(){
    fn.playing = false;
  };
  this.playing = false;
  this.filtered = false;
  return this;
}

AudioSource.prototype.play = function() {
  if (!this.source.start) {
    this.source.start = this.source.noteOff;
  }
  this.source.start(0);
  this.playing = true;
};

AudioSource.prototype.stop = function() {
  this.source.stop(0);
  this.playing = false;
};

AudioSource.prototype.filterOff = function() {
  this.source.disconnect();
  this.source.connect(context.destination);
  this.filtered = false;
}

AudioSource.prototype.filterOn = function() {
  var splitter = context.createChannelSplitter(2);
  var merger = context.createChannelMerger(2);

  this.source.disconnect();
  this.source.connect(splitter);

  this.filtered = true;

  applyFilters(splitter, hearingTestData.left, 0).connect(merger, 0, 0);
  applyFilters(splitter, hearingTestData.right, 1).connect(merger, 0, 1);

  merger.connect(context.destination);
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
  filter.Q.value = 35;
  filter.gain.value = -data.db;

  source.connect(filter, channel);

  return filter;
}

function play(sound) {
  if (!sound) { return; }
  if (currentSound) {
    currentSound.stop();
  }
  currentSound = new AudioSource(sound);
  currentSound.play();
}

function stop() {
  if (!currentSound) { return; }
  currentSound.stop();
  currentSound = null;
};

function togglePlay(sound) {
  isCurrentSound(sound) ? stop() : play(sound);
}

function toggleFilter() {
  currentSound.filtered ? currentSound.filterOff() : currentSound.filterOn();
}

function isCurrentSound(name) {
  return currentSound && (currentSound.source.buffer === sources[name]);
}

var playButtons = document.querySelectorAll(".play");
var toggleButton = document.getElementById("toggle");

document.addEventListener("click", function(e){
  if (!e.target.classList.contains("play")) { return; }
  togglePlay(e.target.getAttribute("data-sound"));
}, false);

toggleButton.addEventListener("click", function(){
  if (!currentSound) {return;}
  toggleFilter();
}, false);

