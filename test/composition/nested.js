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

      console.log("This test is a work in progress");

      var circle = ReactiveVis.Circle();

      var scatter = ReactiveVis.Scatter()
        .svg(createSVG())
        .data(exampleData);

      scatter
        .xColumn("sepal_length")
        .yColumn("sepal_width")
        .sizeColumn("petal_length");

      //ReactiveVis.nest(scatter, circle);
      scatter(function (marks){
        marks.each(function (d){
          var size = marks.sizeLocal.get(this);
          console.log(size);
          circle
            .data([d])
            .width(size)
            .height(size)
            .svg(this);

          // Depends on nested digests
          // See https://github.com/datavis-tech/reactive-function/issues/18
          //ReactiveVis.digest();
        });
        console.log(marks);
      }, "marks");

      ReactiveVis.digest();

    });
  });
};
