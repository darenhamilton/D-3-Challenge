// @TODO: YOUR CODE HERE!

// function createHealthViz (){

//read in data
// d3.csv('assets/data/data.csv', data => {overallHealthViz(data)})

// }
let svgWidth = 960;
let svgHeight = 500;

let margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
let svg = d3
    .select("scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
let chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
let chosenXAxis = "poverty";

// function used for updating x-scale let upon click on axis label
function xScale(healthData, chosenXAxis) {
    // create scales
    let xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
            d3.max(healthData, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);

    return xLinearScale;

}

// function used for updating xAxis let upon click on axis label
function renderAxes(newXScale, xAxis) {
    let bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));

    return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

    let label;

    if (chosenXAxis === "poverty") {
        label = "In Poverty:";
    } else {
        label = "Age (Median):";
    }

    let toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(d => `${d.rockband}<br>${label} ${d[chosenXAxis]}`);

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function (data) {
            toolTip.show(data);
        })
        // onmouseout event
        .on("mouseout", function (data) {
            toolTip.hide(data);
        });

    return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv('./assets/data/data.csv').then(healthData => {

    // parse data
    healthData.forEach(data => {
        data.poverty = +data.poverty;
        data.povertyMoe = +data.povertyMoe;
        data.age = +data.age;
        data.ageMoe = +data.ageMoe;
        data.income = +data.income;
        data.incomeMoe = +data.incomeMoe;
        data.healthcare = +data.healthcare;
        data.healthcareLow = +data.healthcareLow;
        data.healthcareHigh = +data.healthcareHigh;
        data.obesity = +data.obesity;
        data.obesityLow = +data.obesityLow;
        data.obesityHigh = +data.obesityHigh;
        data.smokes = +data.smokes;
        data.smokesLow = +data.smokesLow;
        data.smokesHigh = +data.smokesHigh;
    });

    // xLinearScale function above csv import
    let xLinearScale = xScale(healthData, chosenXAxis);

    // Create y scale function
    let yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(healthData, d => d.num_hits)])
        .range([height, 0]);

    // Create initial axis functions
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    let xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    chartGroup.append("g")
        .call(leftAxis);

    // append initial circles
    let circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .join("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d.num_hits))
        .attr("r", 20)
        .attr("fill", "pink")
        .attr("opacity", 0.5)
        .attr("stroke", "black");

    // Create group for two x-axis labels
    let labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    let hairLengthLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "hair_length") // value to grab for event listener
        .classed("active", true)
        .text("Hair Metal Ban Hair Length (inches)");

    let albumsLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "num_albums") // value to grab for event listener
        .classed("inactive", true)
        .text("# of Albums Released");

    // append y axis
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Number of Billboard 500 Hits");

    // updateToolTip function above csv import
    let circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    // x axis labels event listener
    labelsGroup.selectAll("text")
        .on("click", function () {
            // get value of selection
            let value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {

                // replaces chosenXAxis with value
                chosenXAxis = value;

                // console.log(chosenXAxis)

                // functions here found above csv import
                // updates x scale for new data
                xLinearScale = xScale(hairData, chosenXAxis);

                // updates x axis with transition
                xAxis = renderAxes(xLinearScale, xAxis);

                // updates circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

                // changes classes to change bold text
                if (chosenXAxis === "num_albums") {
                    albumsLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    hairLengthLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else {
                    albumsLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    hairLengthLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });
}).catch(error => console.log(error));
