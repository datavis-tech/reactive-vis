export default function Resize(my, el){

  function resize(){
    my
      .width(el.clientWidth)
      .height(el.clientHeight);
  }

  resize();

  if(typeof window !== "undefined"){
    window.addEventListener("resize", resize);
  }

}
