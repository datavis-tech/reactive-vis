var ReactiveVis = require("../../build/reactive-vis.js");
var assert = require("assert");

var common = require("../common");
var output = common.output;
var createSVG = common.createSVG;

describe("Circle", function(){

  it("Should use SVG mixin.", function(){
    var svg = createSVG();
    var circle = ReactiveVis.Circle()
      .svg(svg);

    circle
      .width(100)
      .height(200);

    ReactiveVis.digest();

    assert.equal(svg.getAttribute("width"), 100);
    assert.equal(svg.getAttribute("height"), 200);

    circle.destroy();
  });
});
