import React, { useState, useRef } from "react";
import ImageMapper from "react-img-mapper";
import { fabric } from "fabric";
import "./app.css";

const App = () => {
  const [displayMessage, setDisplayMessage] = useState("");
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  const [areas, setAreas] = useState([]);
  const [fabricCanvas, setFabricCanvas] = useState(null);

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
      ...areas,
    ],
  };

  const handleImageLoad = (image) => {
    setImageDimensions({ width: image.width, height: image.height });

    const canvas = new fabric.Canvas("fabric-canvas", {
      width: image.width,
      height: image.height,
    });
    setFabricCanvas(canvas);
  };

  const addStraightLine = () => {
    if (fabricCanvas) {
      const straightLine = new fabric.Line([50, 50, 200, 50], {
        stroke: "blue",
        strokeWidth: 5,
      });

      fabricCanvas.add(straightLine);
      fabricCanvas.renderAll();

      straightLine.on("selected", () => {
        const coords = straightLine.path.map((point) => {
          return { x: point[1], y: point[2] };
        });

        setDisplayMessage(
          `Quadratic line selected with coordinates: ${JSON.stringify(coords)}`
        );
      });
    }
  };

  return (
    <div className="image-mapper-container">
      <ImageMapper
        src="/src/assets/apartment.png"
        map={imageMapperProps}
        onLoad={handleImageLoad}
      />
      <canvas id="fabric-canvas" className="fabric-canvas" />
      <button onClick={addStraightLine}>Add Line</button>
    </div>
  );
};

export default App;
