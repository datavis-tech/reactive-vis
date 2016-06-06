import ReactiveModel from "reactive-model";
import SVG from "../mixins/svg";
import Data from "../mixins/data";
import Margin from "../mixins/margin";

export default function Circle(){
  return ReactiveModel()
    .call(SVG)
    .call(Margin)
    .call(Data)

    ("scatterG", function (g){

      var scatterG = g.selectAll(".reactive-vis-scatter-g")
        .data([1]);

      return scatterG.enter().append("g")
          .attr("class", "reactive-vis-scatter-g")
        .merge(scatterG);

    }, "g");
}
