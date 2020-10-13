// @TODO: YOUR CODE HERE!

function createHealthViz (){

//read in data
d3.csv('assets/data/data.csv', data => {overallHealthViz(data)})

}