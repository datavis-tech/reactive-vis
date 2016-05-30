import ReactiveModel from "reactive-model";

// Resizes the SVG container.
export function SVG (my){
  my("svg")
    ("width", 960)
    ("height", 500)
    ("svg-width", function (svg, width){
      svg.attr("width", width);
    }, "svg, width")
    ("svg-height", function (svg, height){
      svg.attr("height", height);
    }, "svg, height");
}
