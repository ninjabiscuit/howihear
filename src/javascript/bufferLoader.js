var AUDIO_BASE_PATH = '../audio/';
var context;

function bufferLoader(ctxt, urlList) {
  context = ctxt;
  return load(urlList);
}

function requestFile(url) {

  return new Promise(function(resolve, reject) {

    var req = new XMLHttpRequest();

    req.open("GET", AUDIO_BASE_PATH + url, true);
    req.responseType = "arraybuffer";

    req.onload = function() {
      resolve(req.response);
    };

    req.onerror = function() {
      reject(req.response);
    };

    req.send();
  });
}

function decode(buffer) {
  return new Promise(function(resolve, reject){
    context.decodeAudioData(buffer, resolve, reject);
  });
}

function load() {
  if (!Array.isArray(urlList)) {
    throw "Error: must provide array of audio paths";
  }
  var fileList = urlList.map(function(url){
    return requestFile(url).then(decode);
  }, this);


  return Promise.all(fileList);
}

module.exports = bufferLoader;
