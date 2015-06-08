# reactive-vis
An experiment for building data visualizations.

In this project, it is assumed that a data visualization is represented as an instance of [ReactiveModel](https://github.com/curran/reactive-model). Given this assumption, this library provides reusable data dependency graphs visualizations based on [D3](d3js.org).

Here is a list of property names that have a specific interpretation within this library:

| Property| Description | Type | Default Value |
|---------|-------------|------|---------------|
| width         | The outer width of the visualization.  | Integer (in pixels) | 960 |
| height        | The outer height of the visualization. | Integer (in pixels) | 500 |
| marginTop     | The top margin.                        | Integer (in pixels) | 20  |
| marginBottom  | The bottom margin.                     | Integer (in pixels) | 20  |
| marginRight   | The right margin.                      | Integer (in pixels) | 10  |
| marginLeft    | The left margin.                       | Integer (in pixels) | 10  |
