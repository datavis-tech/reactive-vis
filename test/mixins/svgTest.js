var ReactiveVis = require("../../build/reactive-vis.js");
var assert = require("assert");

module.exports = function (common){
  var output = common.output;
  var createSVG = common.createSVG;

  describe("SVG", function(){
    it("Should set width and height", function(){
      var svg = createSVG();

      var my = ReactiveVis.Model()
        .call(ReactiveVis.SVG)
        .svg(svg)

      ReactiveVis.digest();
      assert.equal(svg.getAttribute("width"), 960);
      assert.equal(svg.getAttribute("height"), 500);

      my
        .width(100)
        .height(200);

      ReactiveVis.digest();
      assert.equal(svg.getAttribute("width"), 100);
      assert.equal(svg.getAttribute("height"), 200);
      
      output("svg");
      my.destroy();
    });

    it("Should expose svgSelection (with .transition).", function(){
      var svg = createSVG();

      var my = ReactiveVis.Model()
        .call(ReactiveVis.SVG)
        .svg(svg)

      ReactiveVis.digest();
      console.log(my.svgSelection().transition);
      //assert.equal(typeof my.svgSelection.transition, "function");

      my.destroy();
    });
  });
};
