# reactive-vis

A library for reactive data visualizations.

[![NPM](https://nodei.co/npm/reactive-vis.png)](https://npmjs.org/package/reactive-vis)
[![NPM](https://nodei.co/npm-dl/reactive-vis.png?months=3)](https://npmjs.org/package/reactive-vis)
[![Build Status](https://travis-ci.org/datavis-tech/reactive-vis.svg?branch=master)](https://travis-ci.org/datavis-tech/reactive-vis)

This project is about encapsulating dynamic behaviors that are common to many data visualization types. It is intended to be the foundation for authoring reusable interactive data visualization components that can easily be extended and composed.

<p align="center">
  <img src="https://cloud.githubusercontent.com/assets/68416/15649745/73d5e1a8-2691-11e6-9a02-6a7cdb4b3b49.png">
  <br>
  The reactive-vis stack for interactive data visualizations.
  <br>
  <a href="https://github.com/datavis-tech/reactive-model">reactive-model</a> |
  <a href="https://github.com/d3/d3">D3</a>
</p>

## API Reference

Each function is a "reactive mixin", meaning that it can be invoked using <a href="https://github.com/datavis-tech/reactive-model/#call"><i>model</i>.<b>call</b></a>. For all functions, the first argument *model* is an instance of [reactive-model](https://github.com/datavis-tech/reactive-model). Each function adds new properties and reactive functions to the specified *model*.

Note that names for nodes in the data flow graph diagrams follow the convention that `camelCase` names are properties with values, and `dash-separated` names reactive functions that have side effects but no returned value (typically these are DOM manipulations). Hyphenated names serve only to document what the reactive function does, they are never actually assigned values.

 * [SVG](#svg)
 * [Margin](#margin)
 * [Data](#data)

### SVG

<a name="svg" href="#svg">#</a> ReactiveVis.<b>SVG</b>(<i>model</i>)

<p align="center">
  <img src="https://cloud.githubusercontent.com/assets/68416/15651271/28c7088a-269c-11e6-99e8-209a735d7314.png">
</p>

Properties added:

 * *model*.**svg** An SVG DOM element. This may be set any number of times. This will be the root of the visualization DOM tree, and will be accessed by other mixins.
 * *model*.**width** An integer representing the width (in pixels) of the SVG element. The default value is 960 (the default width of examples on [bl.ocks.org](http://bl.ocks.org/)).
 * *model*.**height** An integer representing the width (in pixels) of the SVG element. The default value is 500 (the default height of examples on [bl.ocks.org](http://bl.ocks.org/).

Reactive functions:

 * **svg-width** Sets the `width` attribute of the SVG element based on the value of model.*width*.
 * **svg-height** Sets the `height` attribute of the SVG element based on the value of model.*height*.

### Margin

<a name="margin" href="#margin">#</a> ReactiveVis.<b>Margin</b>(<i>model</i>)

Encapsulates margins. Inspired by [D3 Margin Convention](https://bl.ocks.org/mbostock/3019563). Depends on [SVG](#svg).

<p align="center">
  <img src="https://cloud.githubusercontent.com/assets/68416/15652243/74641c0a-26a2-11e6-83ba-05ad6f18f84e.png">
</p>

Properties added:

 * *model*.**marginRight** The right side margin (in pixels).
 * *model*.**marginLeft** The left side margin (in pixels).
 * *model*.**marginTop** The top side margin (in pixels).
 * *model*.**marginBottom** The bottom side margin (in pixels).
 * *model*.**innerWidth** The width of the inner rectangle, after margins have been applied. This is computed and updated based on *model*.**marginRight**, *model*.**marginLeft**, and *model*.**width**.
 * *model*.**innerHeight** The height of the inner rectangle, after margins have been applied. This is computed and updated based on *model*.**marginTop**, *model*.**marginBottom**, and *model*.**height**.
 * *model*.**g** An SVG `<g>` element, appended as a child to *model*.**svg**.

Reactive functions:

 * **g-transform** Computes and updates the `transform` attribute of *model*.**g** based on *model*.**marginTop** and *model*.**marginLeft**.

### Data

<a name="data" href="#data">#</a> ReactiveVis.<b>Data</b>(<i>model</i>)

Properties added:

 * *model*.**data** This property accepts the input data for the component. Typically this is expected to be an array of objects (e.g. the output from parsing a CSV file using [d3-dsv](https://github.com/d3/d3-dsv)).

## Related Work

This project is similar to:

 * [Vega](https://github.com/vega/vega)
 * [C3](http://c3js.org/)
 * [Dimple](http://dimplejs.org/)
 * [NVD3](http://nvd3.org/)

The build tooling for this project draws from:

 * [D3 Custom Bundle II](http://bl.ocks.org/mbostock/97557a39b4bfc8229786c8bccb54074d)
 * [rollup-starter-project](https://github.com/rollup/rollup-starter-project)

Previous initiatives that feed into this work:

 * [chiasm-charts](https://github.com/chiasm-project/chiasm-charts)
 * [Model.js](https://github.com/curran/model)
 * [Reactive Data Visualizations (pdf)](https://github.com/curran/portfolio/raw/gh-pages/2015/reactiveVisualizationsPaper.pdf)
 
<p align="center">
  <a href="https://datavis.tech/">
    <img src="https://cloud.githubusercontent.com/assets/68416/15298394/a7a0a66a-1bbc-11e6-9636-367bed9165fc.png">
  </a>
</p>
