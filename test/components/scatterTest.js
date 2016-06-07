var ReactiveVis = require("../../build/reactive-vis.js");
var assert = require("assert");

module.exports = function (common){
  var output = common.output;
  var createSVG = common.createSVG;

  describe("Scatter", function (){

    var exampleData = [
      { "sepal_length": 5.1, "sepal_width": 3.5, "petal_length": 1.4, "petal_width": 0.2, "species": "setosa" },
      { "sepal_length": 5.2, "sepal_width": 2.7, "petal_length": 3.9, "petal_width": 1.4, "species": "versicolor" },
      { "sepal_length": 6.3, "sepal_width": 3.4, "petal_length": 5.6, "petal_width": 2.4, "species": "virginica" },
      { "sepal_length": 6.4, "sepal_width": 3.1, "petal_length": 5.5, "petal_width": 1.8, "species": "virginica" }
    ];

    it("Should append scatterLayer.", function (){
      var scatter = ReactiveVis.Scatter()
        .svg(createSVG())
        .data(exampleData);

      ReactiveVis.digest();

      var g = scatter.g().node();
      var scatterLayer = scatter.scatterLayer().node();

      assert.equal(g.children.length, 1);
      assert.equal(g.children[0].tagName, "g");
      assert.equal(g.children[0], scatterLayer);

      scatter.destroy();
    });

    it("Should update scatterLayer.", function (){
      var svg = createSVG();
      var scatter = ReactiveVis.Scatter()
        .data(exampleData);

      scatter.svg(svg);
      ReactiveVis.digest();
      var g = scatter.g().node();
      var scatterLayer = scatter.scatterLayer().node();
      assert.equal(g.children.length, 1);
      assert.equal(g.children[0].tagName, "g");
      assert.equal(g.children[0], scatterLayer);

      scatter.svg(svg);
      ReactiveVis.digest();
      assert.equal(g.children.length, 1);
      assert.equal(g.children[0].tagName, "g");
      assert.equal(g.children[0], scatterLayer);

      scatter.destroy();
    });

    it("Should append g elements for each data entry.", function (){
      var scatter = ReactiveVis.Scatter()
        .svg(createSVG())
        .data(exampleData);

      scatter
        .xColumn("sepal_length")
        .yColumn("sepal_width")

        // TODO remove this when it becomes optional.
        .sizeColumn("petal_length");

      ReactiveVis.digest();

      var g = scatter.scatterLayer().node();

      assert.equal(g.children.length, 4);
      assert.equal(g.children[0].tagName, "g");
      scatter.destroy();
    });

    it("Should exit g elements.", function (){
      var scatter = ReactiveVis.Scatter()
        .svg(createSVG())
        .data(exampleData);

      scatter
        .xColumn("sepal_length")
        .yColumn("sepal_width")
        .sizeColumn("petal_length");

      ReactiveVis.digest();

      scatter.data(exampleData.slice(0, 3));
      ReactiveVis.digest();
      var g = scatter.scatterLayer().node();
      assert.equal(g.children.length, 3);
      assert.equal(g.children[0].tagName, "g");
      scatter.destroy();
    });

    it("Should set g transforms for each data entry.", function (){
      var scatter = ReactiveVis.Scatter()
        .svg(createSVG())
        .data(exampleData);

      scatter
        .xColumn("sepal_length")
        .yColumn("sepal_width")
        .sizeColumn("petal_length");

      ReactiveVis.digest();

      var g = scatter.scatterLayer().node();

      assert.equal(g.children[0].getAttribute("transform"), "translate(0,0)");
      assert.equal(g.children[1].getAttribute("transform"), "translate(66.15384615384647,400)");

      scatter.destroy();
    });
    
    it("Should expose size using local.", function (){
      var scatter = ReactiveVis.Scatter()
        .svg(createSVG())
        .data(exampleData);

      scatter
        .xColumn("sepal_length")
        .yColumn("sepal_width")
        .sizeColumn("petal_length");

      ReactiveVis.digest();

      var marks = scatter.marks();
      marks.each(function (d, i){
        var size = marks.sizeLocal.get(this);
        assert.equal(size, scatter.sizeScaled()(d));
      });

      //assert.equal(g.children[1].getAttribute("transform"), "translate(66.15384615384647,400)");

      scatter.destroy();
    });

  });
};
