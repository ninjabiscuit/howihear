var d3 = require("d3");
var hearingTestData = require("./data");

var WIDTH = 500;
var HEIGHT = 500;
var MARGINS = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 50
};

var Chart = function(id, data, color) {
  this.vis = d3.select(id);

  this.xRange = d3.scale.ordinal()
                .domain([125, 300, 250, 400, 500, 750, 1000, 1500, 2000, 3000, 4000, 6000, 8000])
                .rangePoints([MARGINS.left, WIDTH - MARGINS.right]);

  this.yRange = d3.scale.linear()
                .range([HEIGHT - MARGINS.top, MARGINS.bottom])
                .domain([120, -10]);

  this.xAxis = d3.svg.axis()
                .scale(this.xRange)
                .tickSize(5)
                .innerTickSize(-WIDTH)
                .outerTickSize(0)
                .tickValues([125, 250, 500, 1000, 2000, 4000, 8000])
                .orient('top')
                .tickSubdivide(true);

  this.yAxis = d3.svg.axis()
                .scale(this.yRange)
                .tickSize(5)
                .innerTickSize(-HEIGHT)
                .outerTickSize(0)
                .orient('left')
                .tickSubdivide(true);

  // Normal
  drawRect(this.vis, 0, 107, "#c4e3ff");

  // Mild
  drawRect(this.vis, 107, 70, "#88c1f8");

  //Moderate
  drawRect(this.vis, 107 + 70, 107, "#358ee0");

  //Severe
  drawRect(this.vis, (107*2) + 70, 70, "#136fc4");

  //Profound
  drawRect(this.vis, (107*2) + (70*2), 107, "#03519b");

  drawAxis(this.vis, 'x axis', '0,' + MARGINS.top, this.xAxis);
  drawAxis(this.vis, 'y axis', MARGINS.left + ', 0', this.yAxis);

  this.vis.append('svg:path')
    .attr('d', this.lineFunc(data))
    .attr('stroke', color)
    .attr('stroke-width', 2)
    .attr('fill', 'none');

  this.point = this.vis.append("g")
    .attr("class", "line-point");
}

Chart.prototype.lineFunc = function(data){
  var fn = this;
  return d3.svg.line()
    .x(function(d) {
      return fn.xRange(d.hz);
    })
    .y(function(d) {
      return fn.yRange(d.db);
    })
    .interpolate('linear')(data);
};


function drawRect(vis, topOffset, h, color) {
  return vis.append("rect")
    .attr("x", MARGINS.left)
    .attr("y", MARGINS.top + (topOffset || 0))
    .attr("fill", color)
    .attr("width", WIDTH)
    .attr("height", h);
}

function drawAxis(vis, klass, coords, axis) {
  return vis.append('svg:g')
    .attr('class', klass)
    .attr('transform', 'translate(' + coords + ')')
    .call(axis);
}

function createPoints(point, data, shape, color) {
  return point.selectAll('circle')
    .data(data)
    .enter()
    .append(shape)
    .attr("stroke", color)
    .attr("stroke-width", 2)
}

var left = new Chart("#leftChart", hearingTestData.left, 'red');
var right = new Chart("#rightChart", hearingTestData.right, 'blue');


createPoints(right.point, hearingTestData.right, "line", "#00007f")
  .attr("x1", function(d, i) {
    return right.xRange(d.hz) - 5;
  })
  .attr("y1", function(d, i) { 
    return right.yRange(d.db) - 5;
  })
  .attr("x2", function(d, i) {
    return right.xRange(d.hz) + 5;
  })
  .attr("y2", function(d, i) { 
    return right.yRange(d.db) + 5;
  });

createPoints(right.point, hearingTestData.right, "line", "#00007f")
  .attr("x1", function(d, i) {
    return right.xRange(d.hz) - 5;
  })
  .attr("y1", function(d, i) { 
    return right.yRange(d.db) + 5;
  })
  .attr("x2", function(d, i) {
    return right.xRange(d.hz) + 5;
  })
  .attr("y2", function(d, i) { 
    return right.yRange(d.db) - 5;
  });

createPoints(left.point, hearingTestData.left, "circle", "#b20000")
  .attr("fill", "none")
  .attr("cx", function(d, i) {
    return left.xRange(d.hz);
  })
  .attr("cy", function(d, i) { 
    return left.yRange(d.db) 
  })
  .attr("r", 5);
