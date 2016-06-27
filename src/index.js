import ReactiveModel from "reactive-model";

import "d3-transition";

// Mixins
import SVG    from "./mixins/svg";
import Margin from "./mixins/margin";
import Data   from "./mixins/data";
import Column from "./mixins/column";
import Scale  from "./mixins/scale";
import Resize from "./mixins/resize";

// Components
import Circle  from "./components/circle";
import Scatter from "./components/scatter";

// This needs to be used to construct ReactiveModel instances,
// because it is the version that's bundled within ReactiveVis.
// If an externally loaded instance of the ReactiveModel module
// (from NPM) is used, the "digest" function won't work correctly,
// because the two modules have different data flow graphs.
export var Model = ReactiveModel;

// Expose digest at this level for convenience.
export var digest = ReactiveModel.digest;

export {
  SVG,
  Margin,
  Data,
  Column,
  Scale,
  Resize,

  Circle,
  Scatter
};
