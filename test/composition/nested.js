var ReactiveVis = require("../../build/reactive-vis.js");
var assert = require("assert");

module.exports = function (common){
  var output = common.output;
  var createSVG = common.createSVG;

  describe("Nested", function (){

    var exampleData = [
      { "sepal_length": 5.1, "sepal_width": 3.5, "petal_length": 1.4, "petal_width": 0.2, "species": "setosa" },
      { "sepal_length": 5.2, "sepal_width": 2.7, "petal_length": 3.9, "petal_width": 1.4, "species": "versicolor" },
      { "sepal_length": 6.3, "sepal_width": 3.4, "petal_length": 5.6, "petal_width": 2.4, "species": "virginica" },
      { "sepal_length": 6.4, "sepal_width": 3.1, "petal_length": 5.5, "petal_width": 1.8, "species": "virginica" }
    ];

    it("Should nest Circle in Scatter.", function (){

      var svg = createSVG();

      var circle = ReactiveVis.Circle();

      var scatter = ReactiveVis.Scatter()
        .svg(svg)
        .data(exampleData);

      scatter
        .xColumn("sepal_length")
        .yColumn("sepal_width")
        .sizeColumn("petal_length");

      scatter(function (marks){
        marks.each(function (d){
          var size = marks.sizeLocal.get(this);
          circle
            .data([d])
            .width(size)
            .height(size)
            .svg(this)
            .digest();
        });
      }, "marks");

      ReactiveVis.digest();

      assert.equal(svg.children.length, 1);
      assert.equal(svg.children[0].tagName, "g");
      assert.equal(svg.children[0].getAttribute("class"), "reactive-vis-margin-g");

      var g = svg.children[0];
      assert.equal(g.children.length, 1);
      assert.equal(g.children[0].tagName, "g");
      assert.equal(g.children[0].getAttribute("class"), "reactive-vis-scatter-layer");

      var scatterLayer = g.children[0];
      assert.equal(scatterLayer.children.length, 4);
      assert.equal(scatterLayer.children[0].tagName, "g");
      assert.equal(scatterLayer.children[0].getAttribute("class"), "reactive-vis-scatter-mark");
      assert.equal(scatterLayer.children[0].getAttribute("transform"), "translate(0,0)");

      assert.equal(scatterLayer.children[1].tagName, "g");
      assert.equal(scatterLayer.children[1].getAttribute("class"), "reactive-vis-scatter-mark");
      assert.equal(scatterLayer.children[1].getAttribute("transform"), "translate(66.15384615384647,400)");

      var mark0 = scatterLayer.children[0];
      assert.equal(mark0.children.length, 1);
      assert.equal(mark0.children[0].tagName, "circle");
      assert.equal(mark0.children[0].getAttribute("class"), "reactive-vis-circle");

      // This can be used to output the SVG.
      //console.log(svg.outerHTML);


    });
  });
};
