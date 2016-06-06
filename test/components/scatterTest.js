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

    it("Should append scatterG.", function (){
      var scatter = ReactiveVis.Scatter()
        .svg(createSVG())
        .data(exampleData);

      ReactiveVis.digest();

      var g = scatter.g().node();
      var scatterG = scatter.scatterG().node();

      assert.equal(g.children.length, 1);
      assert.equal(g.children[0].tagName, "g");
      assert.equal(g.children[0], scatterG);
    });

    it("Should update scatterG.", function (){
      var svg = createSVG();
      var scatter = ReactiveVis.Scatter()
        .data(exampleData);

      scatter.svg(svg);
      ReactiveVis.digest();
      var g = scatter.g().node();
      var scatterG = scatter.scatterG().node();
      assert.equal(g.children.length, 1);
      assert.equal(g.children[0].tagName, "g");
      assert.equal(g.children[0], scatterG);

      scatter.svg(svg);
      ReactiveVis.digest();
      assert.equal(g.children.length, 1);
      assert.equal(g.children[0].tagName, "g");
      assert.equal(g.children[0], scatterG);
    });

    //it("Should append a <g> elements for each data entry.", function (){
    //  var scatter = ReactiveVis.Scatter()
    //    .svg(createSVG())
    //    .data(exampleData);

    //  ReactiveVis.digest();

    //  var g = scatter.scatterG().node();

    //  assert.equal(g.children.length, 4);
    //  assert.equal(g.children[0].tagName, "g");
    //});

  });
};
