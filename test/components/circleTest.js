var ReactiveVis = require("../../build/reactive-vis.js");
var assert = require("assert");

var common = require("../common");
var output = common.output;
var createSVG = common.createSVG;

describe("Circle", function (){

  var exampleData = [{
    "sepal_length": 5.1,
    "sepal_width": 3.5,
    "petal_length": 1.4,
    "petal_width": 0.2,
    "species": "setosa"
  }];

  it("Should use SVG mixin.", function (){
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

  it("Should use Data mixin.", function (){
    var circle = ReactiveVis.Circle()
      .data(exampleData);
    assert.deepEqual(circle.data(), exampleData);
  });

  it("Should append a circle element", function (){
    var svg = createSVG();
    var circle = ReactiveVis.Circle()
      .svg(svg)
      .data(exampleData);

    ReactiveVis.digest();

    assert.equal(svg.children.length, 1);
    assert.equal(svg.children[0].tagName, "circle");
  });

});
