import React, { useState } from "react";
import ImageMapper from "react-img-mapper";
import { fabric } from "fabric";
import "./app.css";

const App = () => {
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [canvas, setCanvas] = useState(null);
  const [updatedAreas, setUpdatedAreas] = useState([]);

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
      ...updatedAreas,
    ],
  };

  const handleImageLoad = (image) => {
    setImageDimensions({ width: image.width, height: image.height });

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

    const lineCoordinates = lines.map((line) => {
      const { bl, br, tl, tr } = line.lineCoords;
      return [bl.x, bl.y, br.x, br.y, tr.x, tr.y, tl.x, tl.y];
    });

    const updatedArea = {
      name: "New Area",
      shape: "poly",
      coords: lineCoordinates.flat(),
      fillColor: "rgba(229, 0, 0, 0.3)",
      strokeColor: "rgba(0, 0, 0, 0, 0)",
      lineWidth: 0,
      preFillColor: "#5da0d02e",
    };

    imageMapperProps.areas.push(updatedAreas);
    setUpdatedAreas([...updatedAreas, updatedArea]);
    console.log(updatedArea);

    console.log("Line Coordinates:", lineCoordinates);
  };

  const handleStopDrawing = () => {
    let element = document.querySelector(".canvas-container");
    element.parentNode.removeChild(element);
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
      <button onClick={handleStopDrawing}>Stop Drawing</button>
      <div className="canvas-container">
        <canvas id="fabric-canvas" />
      </div>
    </div>
  );
};

export default App;
