import React, { useState, useRef } from "react";
import paper, { Color } from "paper";
import ImageMapper from "react-img-mapper";
import "./app.css";

const Paper = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [areas, setAreas] = useState([]);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [editMode, setEditMode] = useState(false);

  const currentPathRef = useRef(null);
  const draggablePointsRef = useRef([]);
  const selectedPointIndexRef = useRef(-1);

  const handleImageLoad = (image) => {
    setImageDimensions({ width: image.width, height: image.height });
  };

  const handleStartDrawing = (event) => {
    if (!currentPathRef.current) {
      currentPathRef.current = new paper.Path({
        closed: true,
        fullySelected: true,
        strokeColor: "#ff0000",
        fillColor: new Color("#5da0d02e"),
        strokeWidth: 5,
        strokeCap: "round",
        strokeJoin: "round",
      });
    }
    currentPathRef.current.add(event.point);
    draggablePointsRef.current.push(event.point);
  };

  const startDrawing = () => {
    paper.setup("canvas");

    setIsDrawing(true);
    paper.view.onClick = handleStartDrawing;
  };

  const handleStopDrawing = () => {
    setIsDrawing(false);
    paper.view.onClick = null;

    if (draggablePointsRef.current.length > 2) {
      addPolygon(draggablePointsRef.current);
    }

    currentPathRef.current.remove();
    currentPathRef.current = null;
    draggablePointsRef.current = [];
  };

  const handleRemoveLastSegment = () => {
    if (currentPathRef.current && currentPathRef.current.segments.length > 0) {
      currentPathRef.current.removeSegment(
        currentPathRef.current.segments.length - 1
      );
      draggablePointsRef.current.pop();
    }
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

  const handleToggleEditMode = () => {
    setEditMode(!editMode);
    setIsDrawing(false);
  };

  const handleMouseDownOnCanvas = (event) => {
    if (!isDrawing && editMode) {
    }
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
          onMouseDown={handleMouseDownOnCanvas}
          width={imageDimensions.width}
          height={imageDimensions.height}
          style={{
            cursor: isDrawing ? "pointer" : "",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
          }}
        />
      </div>

      <div className="buttons-container">
        {!isDrawing && !editMode && (
          <button onClick={startDrawing}>Start Drawing</button>
        )}
        {isDrawing || editMode ? (
          <>
            <button onClick={handleStopDrawing}>Stop Drawing</button>{" "}
            <button onClick={handleRemoveLastSegment}>
              Remove last segment
            </button>{" "}
            <button onClick={handleToggleEditMode}>
              {editMode ? "Exit edit mode" : "Start edit mode"}
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Paper;
