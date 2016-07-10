import {
  event,
  selection,
  select,
  selectAll
} from "d3-selection";

import "d3-transition";

// Resizes the SVG container.
export default function SVG (my){
  my("svg")
    ("width", 960)
    ("height", 500)

    ("svgSelection", function (svg){
      console.log(selection.prototype);
      return select(svg);
    }, "svg")

    ("svg-width", function (svgSelection, width){
      svgSelection.attr("width", width);
    }, "svgSelection, width")

    ("svg-height", function (svgSelection, height){
      svgSelection.attr("height", height);
    }, "svgSelection, height");
}
