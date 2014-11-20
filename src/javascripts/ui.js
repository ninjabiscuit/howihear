var eventEmitter = require("./eventEmitter");

var playButtons = document.querySelectorAll(".play");
var toggleButton = document.getElementById("toggle");

document.addEventListener("click", function(e){
  if (!e.target.classList.contains("play")) { return; }
  eventEmitter.emit("audio:togglePlay", e.target.getAttribute("data-sound"));
  //togglePlay(e.target.getAttribute("data-sound"));
}, false);

toggleButton.addEventListener("click", function(){
  if (!currentSound) {return;}
  eventEmitter.emit("audio:toggleFilter");
  //toggleFilter();
}, false);

function getData(cells, frequencies) {
  return [].map.call([].slice.call(cells, 1), function(cell, i) {
    return {
      hz: parseInt(frequencies[i].getAttribute("data-frequency"), 10),
      db: parseInt(cell.firstElementChild.value, 10)
    };
  });
}

document.addEventListener("change", function(e){
  if (!e.target.classList.contains("input")) { return; }
  var table = document.querySelector(".data__table");
  var frequencies = [].slice.call(table.rows[0].cells, 1);

  hearingTestData.left = getData(table.rows[1].cells, frequencies);
  hearingTestData.right = getData(table.rows[2].cells, frequencies);

  // rerender grpahs
  eventEmitter.emit("data:update");

}, false);
