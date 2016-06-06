import ReactiveModel from "reactive-model";
import SVG from "../mixins/svg";
import Data from "../mixins/data";
import Margin from "../mixins/margin";
import Column from "../mixins/column";

export default function Circle(){
  return ReactiveModel()
    .call(SVG)
    .call(Margin)
    .call(Data)
    .call(Column, "x")
    .call(Column, "y")
    .call(Column, "size")

    // This is the single SVG group for the scatter layer.
    ("scatterG", function (g){

      var scatterG = g.selectAll(".reactive-vis-scatter-g")
        .data([1]);

      return scatterG.enter().append("g")
          .attr("class", "reactive-vis-scatter-g")
        .merge(scatterG);

    }, "g")

    // This is the selection of many g elements, corresponding to the data.
    ("scatter", function (scatterG, data){

      var scatter = scatterG.selectAll(".reactive-vis-scatter")
        .data(data);

      scatter.exit().remove();

      return scatter.enter().append("g")
          .attr("class", "reactive-vis-scatter")
        .merge(scatter)

        // TODO use X and Y scales
        .attr("transform", "translate(50,50)");

    }, "scatterG, data")
}
