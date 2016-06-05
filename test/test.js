var d3 = require("d3-selection");
var ReactiveVis = require("../build/reactive-vis.js");
var jsdom = require("jsdom");
var fs = require("fs");

// This causes correct line numbers to be shown
// when errors from source files occur in tests.
require("source-map-support").install();

// If outputGraph = true, writes graph files to ../graph-diagrams for visualization.
var outputGraph = require("graph-diagrams")({
  outputGraphs: false,
  project: "reactive-vis"
});

// These are utilities available to all tests.
var common = {

  // Convenience function to output graphs for visualization.
  output: function (name){
    outputGraph(ReactiveVis.Model.serializeGraph(), name);
  },

  // Creates and returns an SVG element using jsdom.
  createSVG: function createSVG(){
    return d3.select(jsdom.jsdom().body)
      .append("svg")
      .node();
  }
};

describe("Mixins", function (){
  fs.readdirSync("test/mixins").forEach(function (testFile){
    require("./mixins/" + testFile)(common);
  });
});

describe("Components", function (){
  fs.readdirSync("test/components").forEach(function (testFile){
    require("./components/" + testFile)(common);
  });
});
