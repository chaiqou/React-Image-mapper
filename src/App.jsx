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
      stroke: "red",
      strokeWidth: 6,
      selectable: true,
      evented: true,
    });
  };

  const handleAddShapes = () => {
    if (!canvas) return;

    const line = createLine([100, 100, 300, 100]);

    canvas.add(line);
    canvas.setActiveObject(line); // Set the line as the active object

    canvas.renderAll();
  };

  const handleCalculateCoordinates = () => {
    if (!canvas) return;

    const lines = canvas
      .getObjects()
      .filter((obj) => obj instanceof fabric.Line);

    const lineCoordinates = lines.map((line) => line.lineCoords);

    console.log("Line Coordinates:", lineCoordinates);
  };

  return (
    <div className="app-container">
      <div className="image-mapper-container">
        <ImageMapper
          src="/src/assets/apartment.png"
          map={imageMapperProps}
          onLoad={handleImageLoad}
        />
      </div>
      <button onClick={handleAddShapes}>Add Shapes</button>
      <button onClick={handleCalculateCoordinates}>
        Calculate Coordinates
      </button>
      <div className="canvas-container">
        <canvas id="fabric-canvas" />
      </div>
    </div>
  );
};

export default App;
