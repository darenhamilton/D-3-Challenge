
//set canvas and margins
let svgWidth = 960;
let svgHeight = 500;

let margin = {
    top: 20,
    right: 80,
    bottom: 80,
    left: 60
};

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins
let svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

let chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//read in data
d3.csv('./assets/data/data.csv').then(healthData => {

         // parse data/cast as numbers
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

        //create scale function
        let xLinearScale = d3.scaleLinear()
            .domain([8, d3.max(healthData, d => d.poverty)+2])
            .range([0,width])
            .nice();

        let yLinearScale = d3.scaleLinear()
            .domain([4, d3.max(healthData, d => d.healthcare)+2])
            .range([height, 0])
            .nice();

        //create axis function
        let bottomAxis = d3.axisBottom(xLinearScale);
        let leftAxis = d3.axisLeft(yLinearScale);
        
        //append axis to chart
        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        chartGroup.append("g")
            .call(leftAxis)

        //create cicles
        let circlesGroup = chartGroup.selectAll("circle")
            .data(healthData)
            .join("circle")
            .attr("cx", d => xLinearScale(d.poverty))
            .attr("cy", d => yLinearScale(d.healthcare))
            .attr("r", "9")
            .attr("class", "stateCircle")

        // Initialize tool tip
        let toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([80, -60])
            .html(d => `${d.state}<br>Poverty: ${d.poverty} %<br>Health Care: ${d.healthcare} %`);

        //Create tooltip in the chart
        chartGroup.call(toolTip);

            //Create event listeners to display and hide the tooltip
        circlesGroup.on("click", function (data) {
                toolTip.show(data, this);
            })
        // onmouseout event
            .on("mouseout", function (data) {
                toolTip.hide(data);
            });
        
        //label circles
        let circleLabel = chartGroup.selectAll()
            .data(healthData)
            .enter()
            .append("text")
            .attr("x", d => xLinearScale(d.poverty))
            .attr("y", d => yLinearScale(d.healthcare))
            .text(d => d.abbr)
            .attr("class", "stateText")
            .attr("font-size", 7)          
           
        //label y axis    
         chartGroup.append("text")
             .attr("transform", "rotate(-90)")
             .attr("y", 0 - margin.left )
             .attr("x", 0 - (height / 2))
             .attr("dy", "1em")
             .attr("class", "aText")
             .text("Lacks Healthcare (%)");
       
        //label x axis
         chartGroup.append("text")
             .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
             .attr("class", "aText")
             .text("In Poverty (%)");
        

}).catch(error => console.log(error));
