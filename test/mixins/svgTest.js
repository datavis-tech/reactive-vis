var ReactiveVis = require("../../build/reactive-vis.js");
var ReactiveModel = require("reactive-model");
var assert = require("assert");

var common = require("../common");
var output = common.output;
var createSVG = common.createSVG;

describe("SVG", function(){
  it("Should set width and height", function(){
    var svg = createSVG();
    var my = new ReactiveModel()
      .call(ReactiveVis.SVG)
      .svg(svg)

    ReactiveModel.digest();
    assert(svg.getAttribute("width", 960));
    assert(svg.getAttribute("height", 500));

    my.width(100).height(200);

    ReactiveModel.digest();
    assert(svg.getAttribute("width", 100));
    assert(svg.getAttribute("height", 200));
    
    output("svg");
    my.destroy();
  });
});
