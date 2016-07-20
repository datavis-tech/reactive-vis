import ReactiveModel from "reactive-model";
export { svg } from "./mixins/svg";
export { data } from "./mixins/data";

export default function Circle(){

  return ReactiveModel()
    .call(svg)
    .call(data)

    ("circle", function (svg, data){

      var circle = svg
        .selectAll(".reactive-vis-circle")
          .data(data);

      return circle
        .enter()
          .append("circle")
          .attr("class", "reactive-vis-circle")
        .merge(circle);

    }, "svg, data");
}
