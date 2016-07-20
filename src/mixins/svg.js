import { select } from "d3";

export function svg (my){

  my("container")
    ("width", 960)
    ("height", 500)

    ("svg", function (container){

      var svg = select(container)
        .selectAll(".reactive-vis-svg")
          .data([1]);

      return svg
        .enter()
          .append("svg")
          .attr("class", "reactive-vis-svg")
        .merge(svg);

    }, "container")

    ("svg-width", function (svg, width){
      svg.attr("width", width);
    }, "svg, width")

    ("svg-height", function (svg, height){
      svg.attr("height", height);
    }, "svg, height");
}
