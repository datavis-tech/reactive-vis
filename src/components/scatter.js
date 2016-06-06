import ReactiveModel from "reactive-model";
import SVG from "../mixins/svg";
import Data from "../mixins/data";
import Margin from "../mixins/margin";
import Column from "../mixins/column";
import Scale from "../mixins/scale";

import { extent } from "d3-array";

export default function Circle(){
  return ReactiveModel()
    .call(SVG)
    .call(Margin)
    .call(Data)

    .call(Column, "x")
    .call(Column, "y")
    .call(Column, "size")

    ("xDomain", function (data, accessor){
      return extent(data, accessor);
    }, "data, xAccessor")
    ("xRange", function (innerWidth){
      return [0, innerWidth];
    }, "innerWidth")
    .call(Scale, "x")

    ("yDomain", function (data, accessor){
      return extent(data, accessor);
    }, "data, yAccessor")
    ("yRange", function (innerHeight){
      return [innerHeight, 0];
    }, "innerHeight")
    .call(Scale, "y")

    // This is the single SVG group for the scatter layer.
    ("scatterG", function (g){

      var scatterG = g.selectAll(".reactive-vis-scatter-g")
        .data([1]);

      return scatterG.enter().append("g")
          .attr("class", "reactive-vis-scatter-g")
        .merge(scatterG);

    }, "g")

    // This is the selection of many g elements, corresponding to the data.
    ("scatter", function (scatterG, data, xScaled, yScaled){

      var scatter = scatterG.selectAll(".reactive-vis-scatter")
        .data(data);

      scatter.exit().remove();

      return scatter.enter().append("g")
          .attr("class", "reactive-vis-scatter")
        .merge(scatter)
          .attr("transform", function (d){
            return "translate(" + xScaled(d) + "," + yScaled(d) + ")";
          });

    }, "scatterG, data, xScaled, yScaled");
}
