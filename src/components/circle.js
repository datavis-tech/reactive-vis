import ReactiveModel from "reactive-model";
import SVG from "../mixins/svg";
import Data from "../mixins/data";

export default function Circle(){
  return ReactiveModel()
    .call(SVG)
    .call(Data)

    ("circle", function (svgSelection, data){

      var circle = svgSelection.selectAll(".reactive-vis-circle")
        .data(data);

      return circle.enter().append("circle")
          .attr("class", "reactive-vis-circle")
        .merge(circle);

    }, "svgSelection, data");
}
