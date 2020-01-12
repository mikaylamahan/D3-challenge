// @TODO: YOUR CODE HERE!
var svgWidth = 400;
var svgHeight = 400;

// Define the chart's margins as an object
var chartMargin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Attach to the scatter section of the body of the index.html. Set the dimensions 
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

d3.csv("/assets/data/data.csv").then(function(totaldata) {

    // Print the totaldata to see if it loads correctly
    console.log(totaldata);

    // Convert value to number
    totaldata.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    //create a y scale

    var xLinearScale = d3.scaleLinear()
    .domain([0, d3.min(totaldata, d=>d.poverty),
        d3.max(totaldata, d => d.poverty)])
    .range([chartHeight, 0]);


    //create an x scale
    var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(totaldata, d => d.healthcare)])
    .range([chartHeight, 0])

    //set axes

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    
    //now call the bottom and left axis
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .style("font-size", "16px")
        .call(bottomAxis);

    chartGroup.append("g")
        .style("font-size", "16px")
        .call(leftAxis);
    
    //create blue, opaque circles for the points on the graph
    chartGroup.selectAll("circle")
        .data(totaldata)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 12)
        .attr("fill", "blue")
        .attr("opacity", ".6");

    //include state abbrvs inside the small circles, per instructions
    chartGroup.selectAll("text.text-circles")
    .data(totaldata)
    .enter()
    .append("text")
    .classed("text-circles",true)
    .text(d => d.abbr)
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .attr("dy",5)
    .attr("text-anchor","middle")
    .attr("font-size","14px")
    .attr("fill", "white");

    //create/append y axis
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 30 - chartMargin.left)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .classed("aText", true)
        .text("Lacks Healthcare (%)");
    //create/append x axis
    chartGroup.append("text")
        .attr("y", chartHeight + chartMargin.bottom/2 - 10)
        .attr("x", chartWidth / 2)
        .attr("dy", "1em")
        .classed("aText", true)
        .text("Poverty Rate (%)");
    
});

