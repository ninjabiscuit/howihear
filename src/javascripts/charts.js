var d3 = require("d3");
var hearingTestData = require("./data");

makeChart("#leftChart", hearingTestData.left);
makeChart("#rightChart", hearingTestData.right);

function makeChart(id, data) {
  var vis = d3.select(id),
      WIDTH = 500,
      HEIGHT = 500,
      MARGINS = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 50
      },
      xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([0, 8000]),
      yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([120, -10]),
      xAxis = d3.svg.axis()
        .scale(xRange)
        .tickSize(5)
        .innerTickSize(-WIDTH)
        .outerTickSize(0)
        .tickValues([0, 1000, 2000, 3000, 4000, 6000, 8000])
        .orient('top')
        .tickSubdivide(true),
      yAxis = d3.svg.axis()
        .scale(yRange)
        .tickSize(5)
        .innerTickSize(-HEIGHT)
        .outerTickSize(0)
        .orient('left')
        .tickSubdivide(true);


  // Normal
  vis.append("rect")
    .attr("x", MARGINS.left)
    .attr("y", MARGINS.top)
    .attr("fill", "#c4e3ff")
    .attr("width", 500)
    .attr("height", 107);

  // Mild
  vis.append("rect")
    .attr("x", MARGINS.left)
    .attr("y", MARGINS.top + 107)
    .attr("fill", "#88c1f8")
    .attr("width", 500)
    .attr("height", 70);

  //Moderate
  vis.append("rect")
    .attr("x", MARGINS.left)
    .attr("y", MARGINS.top + 107 + 70)
    .attr("fill", "#358ee0")
    .attr("width", 500)
    .attr("height", 107);

  //Severe
  vis.append("rect")
    .attr("x", MARGINS.left)
    .attr("y", MARGINS.top + (107*2) + 70)
    .attr("fill", "#136fc4")
    .attr("width", 500)
    .attr("height", 70);

  //Profound
  vis.append("rect")
    .attr("x", MARGINS.left)
    .attr("y", MARGINS.top + (107*2) + (70*2))
    .attr("fill", "#03519b")
    .attr("width", 500)
    .attr("height", 107);

  vis.append('svg:g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + (MARGINS.top) + ')')
    .call(xAxis);

  vis.append('svg:g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
    .call(yAxis);

    var lineFunc = d3.svg.line()
    .x(function(d) {
      return xRange(d.hz);
    })
    .y(function(d) {
      return yRange(d.db);
    })
    .interpolate('linear');

  vis.append('svg:path')
    .attr('d', lineFunc(data))
    .attr('stroke', 'blue')
    .attr('stroke-width', 2)
    .attr('fill', 'none');

  var point = vis.append("g")
      .attr("class", "line-point");

  point.selectAll('circle')
    .data(data)
    .enter().append('circle')
    .attr("cx", function(d, i) {
      return xRange(d.hz);
    })
    .attr("cy", function(d, i) { return yRange(d.db) })
    .attr("r", 5);

}
