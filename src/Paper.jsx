import React, { useState, useRef } from "react";
import paper, { Color } from "paper";
import ImageMapper from "react-img-mapper";
import "./app.css";

const Paper = () => {
  const [drawing, setDrawing] = useState(false);
  const [areas, setAreas] = useState([]);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const currentPathRef = useRef(null);
  const draggablePoints = useRef([]);

  const handleImageLoad = (image) => {
    setImageDimensions({ width: image.width, height: image.height });
  };

  const handleStartDrawing = (event) => {
    if (!currentPathRef.current) {
      currentPathRef.current = new paper.Path({
        closed: true,
        fullySelected: true,
        strokeColor: new Color(0, 0, 0),
        strokeWidth: 4,
        dashArray: [10, 4],
        fillColor: new Color("#5da0d02e"),
      });
    }
    currentPathRef.current.add(event.point);
    draggablePoints.current.push(event.point);
  };

  const startDrawing = () => {
    paper.setup("canvas");

    setDrawing(true);
    paper.view.onClick = handleStartDrawing;
  };

  const stopDrawing = () => {
    setDrawing(false);
    paper.view.onClick = null;

    if (draggablePoints.current.length > 2) {
      addPolygon(draggablePoints.current);
    }

    currentPathRef.current.remove();
    currentPathRef.current = null;
    draggablePoints.current = [];
  };

  const addPolygon = (points) => {
    const newPolygon = {
      name: `Polygon ${areas.length + 1}`,
      shape: "poly",
      coords: points.flatMap((point) => [point.x, point.y]),
      fillColor: "rgba(229, 0, 0, 0.3)",
      strokeColor: "rgba(0, 0, 0, 0, 0)",
      lineWidth: 0,
      preFillColor: "#5da0d02e",
      center: [30, 35, 35, 53],
    };

    setAreas((prevAreas) => [...prevAreas, newPolygon]);
  };

  return (
    <div className="image-mapper-wrapper">
      <div className="image-mapper-container">
        <ImageMapper
          src="/src/assets/apartment.png"
          map={{
            name: "Redberry",
            areas: [...areas],
          }}
          onLoad={handleImageLoad}
        />

        <canvas
          id="canvas"
          width={imageDimensions.width}
          height={imageDimensions.height}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
          }}
        />
      </div>

      <div className="buttons-container">
        <button onClick={startDrawing}>Start Drawing</button>
        <button onClick={stopDrawing}>Stop Drawing</button>
      </div>
    </div>
  );
};

export default Paper;
