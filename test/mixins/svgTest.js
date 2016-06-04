var ReactiveVis = require("../../build/reactive-vis.js");
var ReactiveModel = require("reactive-model");
var assert = require("assert");

var common = require("../common");
var output = common.output;
var createSVG = common.createSVG;

describe("SVG", function(){
  it("Should set width and height", function(){
    var my = new ReactiveModel()
      .call(ReactiveVis.SVG)
      .svg(createSVG());

    ReactiveModel.digest();
    assert(my.svg().attr("width", 960));
    assert(my.svg().attr("height", 500));

    my.width(100).height(200);

    ReactiveModel.digest();
    assert(my.svg().attr("width", 100));
    assert(my.svg().attr("height", 200));
    
    output("svg");
    my.destroy();
  });
});
