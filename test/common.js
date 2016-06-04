var d3 = require("d3-selection");
var ReactiveModel = require("reactive-model");
var jsdom = require("jsdom");

var graphDiagrams = require("graph-diagrams");
var outputGraph = graphDiagrams({

  // If true, writes graph files to ../graph-diagrams for visualization.
  outputGraphs: false,
  project: "reactive-vis"
});

// Convenience function to output graphs for visualization.
function output(name){
  outputGraph(ReactiveModel.serializeGraph(), name);
}

// Creates and returns an SVG element using jsdom.
function createSVG(){
  return d3.select(jsdom.jsdom().body)
    .append("svg")
    .node();
}

module.exports = {
  output: output,
  createSVG: createSVG
};
