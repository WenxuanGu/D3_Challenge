var svgWidth = 900;
var svgHeight = 600;
var margin = {top: 20, right: 40, bottom: 100, left: 120};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper to hold chart
var svg = d3
  .select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  

var chartGroup = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.select("body").append("div").attr("class", "tooltip");

// Import CSV
d3.csv("data.csv", function(err, healthData) {

  if (err) throw err;

  healthData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
});

console.log(healthData)

  // Step 0: Parse Data
  //healthData.forEach(function(data) {
    //data.poverty = +data.poverty;
    //data.healthcare = +data.healthcare;
  //});

  // Step 1: Scale functions
  var xLinearScale = d3.scaleLinear().range([0, width]);
  var yLinearScale = d3.scaleLinear().range([height, 0]);

  // Step 2: Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Step 3: Scale domin 
  var xMin;
  var xMax;
  var yMin;
  var yMax;
  
  xMin = d3.min(healthData, function(data) {
      return data.healthcare;
  });
  
  xMax = d3.max(healthData, function(data) {
      return data.healthcare;
  });
  
  yMin = d3.min(healthData, function(data) {
      return data.poverty;
  });
  
  yMax = d3.max(healthData, function(data) {
      return data.poverty;
  });
  
  xLinearScale.domain([xMin, xMax]);
  yLinearScale.domain([yMin, yMax]);

  console.log(xMin);
  console.log(yMax);

  // Step 4: Append Axes 
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  // Step 5: Initialize tooltip
  var toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([80, -20])
    .html(function(data) {
      data.healthcare
      data.poverty
      return (data.abbr + '%');
      });
  svg.call(toolTip)

   // Step 6: Create Circles
  var circlesGroup = chartGroup.selectAll("circle")

  .data(healthData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.healthcare +1))
  .attr("cy", d => yLinearScale(d.poverty +1))
  .attr("r", "10")
  .attr("fill", "green")
  .attr("opacity", .3)

  .on("mouseover", function(data) {
    toolTip.show(data, this);
})

  .on("mouseout", function(data) {
    toolTip.hide(data);
  });
  
  // Step7: Create labels
  chartGroup.append("text")
  .style("font-size", "10px")
  .selectAll("tspan")
  .data(healthData)
  .enter()
  .append("tspan")
      .attr("x", function(data) {
          return xLinearScale(data.healthcare +1);
      })
      .attr("y", function(data) {
          return yLinearScale(data.poverty +1);
      })
      .text(function(data) {
          return data.abbr
      });

  chartGroup
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 10)
    .attr("x", 0 - (height / 4))
    .text("Lacks Healtcare(%)");

  chartGroup.append("g")
    .append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
    .text("Poverty (%)");
});
