import ReactiveModel from "reactive-model";
import SVG from "../mixins/svg";

export default function Circle(){
  return ReactiveModel()
    .call(SVG);
}
