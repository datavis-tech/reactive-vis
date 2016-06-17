// Respond to resize by setting width and height from DOM element.
export default function Resize(my, el){

  function resize(){
    my.width(el.clientWidth)
      .height(el.clientHeight);
  }

  // Set initial size.
  resize();

  // Guard so unit tests don't break in NodeJS environment.
  if(typeof window !== "undefined"){

    // Update size when the browser window is resized.
    window.addEventListener("resize", resize);
  }
}
