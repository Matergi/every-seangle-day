window["canvas-created"] = {};
window["mask-zoomPoint"] = {};
window["mask-canvas"] = {};

window["lib-mask-reset-vars"] = () => {
  window["canvas-created"] = {};
  window["mask-zoomPoint"] = {};
  window["mask-canvas"] = {};
};

window["generate-mask"] = (id, selector, className, draw) => {
  window["waitForEl"](selector, (element) => {
    window["mask"](
      id,
      selector,
      className,
      draw,
      element.offsetWidth,
      element.offsetHeight
    );
  });
};

window["mask"] = (id, selector, className, draw, width, height) => {
  if (!document.getElementById(id) || !window["canvas-created"][id]) {
    window["waitForEl"](selector, (element) => {
      const _canvas = document.createElement("canvas");
      _canvas.setAttribute("id", id);
      _canvas.classList.add("notouch");
      _canvas.classList.add(className);

      const fabricCanvas = new fabric.Canvas(_canvas, {
        width,
        height,
        imageSmoothingEnabled: false,
      });

      element.appendChild(_canvas);

      window["canvas-created"][id] = fabricCanvas;
      window["draw-mask"](id, selector, draw, className, height);
    });
  }
  window["draw-mask"](id, selector, draw, className, width, height);
};

window["draw-mask"] = (id, selector, draw, className, width, height) => {
  if (!document.getElementById(id) || !window["canvas-created"][id]) {
    return;
  }
  window["canvas-created"][id].setDimensions({ width, height });
  window["canvas-created"][id].remove(
    ...window["canvas-created"][id].getObjects()
  );
  const background = new fabric.Rect({
    left: 0,
    top: 0,
    width: width,
    height: height,
    fill: "#fff",
    globalCompositeOperation: "xor",
  });
  window["canvas-created"][id].add(background);
  draw({
    canvas: window["canvas-created"][id],
    width,
    height,
  });
  window["canvas-created"][id].renderAll();
};
