import {select} from "../d3";

// Resizes the SVG container.
export default function SVG (my){
  my("svg")
    ("width", 960)
    ("height", 500)

    ("svgSelection", select, "svg")

    ("svg-width", function (svgSelection, width){
      svgSelection.attr("width", width);
    }, "svgSelection, width")

    ("svg-height", function (svgSelection, height){
      svgSelection.attr("height", height);
    }, "svgSelection, height");
}
