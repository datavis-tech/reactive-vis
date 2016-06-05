var ReactiveVis = require("../../build/reactive-vis.js");
var assert = require("assert");

module.exports = function (common){
  var output = common.output;
  var createSVG = common.createSVG;

  describe("Margin", function(){

    it("Should compute innerWidth and innerHeight", function(){
      var my = ReactiveVis.Model()
        .call(ReactiveVis.SVG)
        .call(ReactiveVis.Margin)
        .svg(createSVG());

      ReactiveVis.digest();
      assert(my.innerWidth(), my.width() - my.width() - my.marginLeft() - my.marginRight());
      assert(my.innerHeight(), my.height() - my.marginTop() - my.marginBottom());

      my
        .width(100)
        .height(200)
        .marginTop(10)
        .marginBottom(11)
        .marginLeft(12)
        .marginRight(13)

      ReactiveVis.digest();
      assert(my.innerWidth(), my.width() - my.width() - my.marginLeft() - my.marginRight());
      assert(my.innerHeight(), my.height() - my.marginTop() - my.marginBottom());

      output("margin");
      my.destroy();
    });

    it("Should append g to svg", function(){
      var my = new ReactiveVis.Model()
        .call(ReactiveVis.SVG)
        .call(ReactiveVis.Margin)
        .svg(createSVG());

      ReactiveVis.digest();
      assert.equal(my.g().node().tagName, "g");
      assert(my.innerHeight(), my.height() - my.marginTop() - my.marginBottom());

      my
        .width(100)
        .height(200)
        .marginTop(10)
        .marginBottom(11)
        .marginLeft(12)
        .marginRight(13)

      ReactiveVis.digest();
      assert(my.innerWidth(), my.width() - my.width() - my.marginLeft() - my.marginRight());
      assert(my.innerHeight(), my.height() - my.marginTop() - my.marginBottom());
    });

    it("Should set g transform", function(){
      var my = new ReactiveVis.Model()
        .call(ReactiveVis.SVG)
        .call(ReactiveVis.Margin)
        .svg(createSVG());

      ReactiveVis.digest();
      assert.equal(my.g().attr("transform"), "translate(50,50)");

      my.marginTop(10).marginLeft(12);

      ReactiveVis.digest();
      assert.equal(my.g().attr("transform"), "translate(12,10)");
    });

    it("Should select existing g if already on svg", function(){

      var svg = createSVG();

      var my = new ReactiveVis.Model()
        .call(ReactiveVis.SVG)
        .call(ReactiveVis.Margin);

      my.svg(svg);
      ReactiveVis.digest();
      assert.equal(svg.children.length, 1);

      my.svg(svg);
      ReactiveVis.digest();
      assert.equal(svg.children.length, 1);

      // Covers the .merge line in "g" definition.
      my.marginTop(10).marginLeft(12);
      ReactiveVis.digest();
      assert.equal(my.g().attr("transform"), "translate(12,10)");

    });
  });
};
