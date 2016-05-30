import npm from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";

export default {
  entry: "index.js",
  format: "umd",
  moduleName: "ReactiveVis",
  plugins: [
    npm({ jsnext: true }),
    commonjs()
  ],
  dest: "reactive-vis.js"
};
