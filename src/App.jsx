import React, { useState } from "react";
import ImageMapper from "react-img-mapper";
import { fabric } from "fabric"; // Import Fabric.js
import "./app.css";

const App = () => {
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [canvas, setCanvas] = useState(null); // Store the Fabric.js canvas

  const imageMapperProps = {
    name: "Redberry",
    areas: [
      {
        name: "First floor",
        shape: "poly", // (rect,poly,circ)
        coords: [46, 357, 928, 402, 928, 473, 47, 409], // [x1, y1, x2, y1, x2, y2, x1, y2]
        fillColor: "rgba(229, 0, 0, 0.3)",
        strokeColor: "rgba(0, 0, 0, 0, 0)",
        lineWidth: 0,
        preFillColor: "#5da0d02e",
        center: [30, 35, 35, 53],
      },
    ],
  };

  const handleImageLoad = (image) => {
    setImageDimensions({ width: image.width, height: image.height });

    // Initialize Fabric.js canvas
    const fabricCanvas = new fabric.Canvas("fabric-canvas", {
      width: image.width,
      height: image.height,
    });
    setCanvas(fabricCanvas);
  };

  const createLine = (coords) => {
    return new fabric.Line(coords, {
      fill: "red",
      stroke: "red",
      strokeWidth: 5,
      selectable: true,
      evented: false,
    });
  };

  const createCircle = (left, top, line) => {
    const circle = new fabric.Circle({
      left: left,
      top: top,
      strokeWidth: 5,
      radius: 12,
      fill: "#fff",
      stroke: "#666",
    });
    circle.hasControls = circle.hasBorders = false;
    circle.line = line;

    circle.on("moving", function () {
      const line = this.line;
      if (line) {
        if (circle === line.circleLeft) {
          line.set({ x1: circle.left, y1: circle.top });
        } else if (circle === line.circleRight) {
          line.set({ x2: circle.left, y2: circle.top });
        }
        canvas.renderAll();
      }
    });

    return circle;
  };

  const handleAddShapes = () => {
    if (!canvas) return;

    const line = createLine([100, 100, 300, 100]);

    canvas.add(line);

    const circleLeft = createCircle(80, 90, line);
    const circleRight = createCircle(290, 90, line);

    line.circleLeft = circleLeft;
    line.circleRight = circleRight;

    canvas.add(circleLeft, circleRight);

    canvas.renderAll();
  };

  return (
    <div className="image-mapper-container">
      <ImageMapper
        src="/src/assets/apartment.png"
        map={imageMapperProps}
        onLoad={handleImageLoad}
      />
      <canvas id="fabric-canvas" className="fabric-canvas" />
      <button onClick={handleAddShapes}>Add Shapes</button>
    </div>
  );
};

export default App;
