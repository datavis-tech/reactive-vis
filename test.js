var ReactiveVis = require("./reactive-vis.js");
var ReactiveModel = require("reactive-model");
var jsdom = require("jsdom");
var d3 = require("d3-selection");
var assert = require("assert");

function createSVG(){
  var document = jsdom.jsdom();
  return d3.select(document.body).append("svg");
}

describe("ReactiveVis", function(){
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
    });
  });
});
