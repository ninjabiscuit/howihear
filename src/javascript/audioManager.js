var BufferLoader = require("./bufferLoader");

var left = [
  {
    hz: 250,
    db: -30
  },
  {
    hz: 500,
    db: -45
  },
  {
    hz: 1000,
    db: -60
  },
  {
    hz: 2000,
    db: -80
  },
  {
    hz: 3000,
    db: -80
  },
  {
    hz: 4000,
    db: -95
  },
  {
    hz: 6000,
    db: -105
  },
  {
    hz: 8000,
    db: -100
  }
];

var right = [
  {
    hz: 250,
    db: -35
  },
  {
    hz: 500,
    db: -35
  },
  {
    hz: 1000,
    db: -40
  },
  {
    hz: 2000,
    db: -55
  },
  {
    hz: 3000,
    db: -60
  },
  {
    hz: 4000,
    db: -65
  },
  {
    hz: 6000,
    db: -75
  },
  {
    hz: 8000,
    db: -75
  }
];

var AUDIO_PATHS = [
  'picard.mp3',
  'speech.mp3'
];

var context = new (AudioContext || webkitAudioContext)();
var sources = {}, filtered = false;
var bufferLoader = bufferLoader(context, AUDIO_PATHS).then(audioReady);

function audioReady(bufferList) {
  bufferList.reduce(function(memo, buffer, i){
    var key = AUDIO_PATHS[i];
    memo[key] = createBufferSource(buffer);
    return memo;
  }, sources);
}

function createBufferSource(buffer) {
  var source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  return source;
}

function playSource() {
  sources[0].start(0);
}

function applyFilters(source, data, channel) {
  return data.slice(1)
    .reduce(applyFilter, applyfilter(source, data[0], channel));
}

function applyFilter(source, data, channel) {
  var filter = context.createBiquadFilter();
  filter.type = "peaking";
  filter.frequency.value = o.hz;
  filter.Q.value = 40;
  filter.gain.value = o.db;

  source.connect(filter, channel);

  return filter;
}

function filterOff() {
  sources[0].disconnect();
  sources[0].connect(context.destination);
  filtered = false;
}

function filterOn() {
  var splitter = context.createChannelSplitter(2);
  var merger = context.createChannelMerger(2);

  filtered = true;

  sources[0].disconnect();
  sources[0].connect(splitter);

  applyFilters(splitter, left, 0).connect(merger, 0, 0);
  applyFilters(splitter, right, 1).connect(merger, 0, 1);

  merger.connect(context.destination);
}

var playButton = document.getElementById("play");
var toggleButton = document.getElementById("toggle");

playButton.addEventListener("click", function(){
  playSource();
}, false);

toggleButton.addEventListener("click", function(){
  if (filtered) {
    filterOff();
    return;
  }
  filterOn();
}, false);

