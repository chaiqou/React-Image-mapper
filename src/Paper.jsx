import React, { useState, useRef, useEffect } from "react";
import paper, { Color, Path } from "paper";
import ImageMapper from "react-img-mapper";
import "./app.css";

const Paper = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [areas, setAreas] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(-1);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [selectedPointCoords, setSelectedPointCoords] = useState({
    x: 0,
    y: 0,
  });

  const currentPathRef = useRef(null);
  const draggablePointsRef = useRef([]);

  const handleImageCoordinants = (image) => {
    setImageDimensions({ width: image.width, height: image.height });
  };

  const calculateSelectedPointCoordinants = (event) => {
    if (isEditMode) {
      const hitOptions = {
        segments: true,
        tolerance: 50,
      };

      // Detect which point is clicked (selected)
      const hitResult = paper.project.hitTest(event.point, hitOptions);

      if (hitResult && hitResult.type === "segment") {
        setSelectedPoint(hitResult.segment);
        setSelectedPointCoords(hitResult.segment.point);
      }
    }
  };

  const handleDragPoint = (event) => {
    if (isEditMode && selectedPointCoords) {
      selectedPointCoords.x = event.point.x;
      selectedPointCoords.y = event.point.y;
    }
  };

  const handleStartDrawing = (event) => {
    if (isEditMode) {
      return;
    }

    if (!currentPathRef.current) {
      currentPathRef.current = new Path({
        closed: true,
        fullySelected: true,
        strokeColor: "#ff0000",
        fillColor: new Color("#5da0d02e"),
      });
    }
    currentPathRef.current.add(event.point);
    draggablePointsRef.current.push(event.point);
  };

  const startDrawing = () => {
    paper.setup("canvas");
    setIsDrawing(true);

    if (!isEditMode) {
      paper.view.onClick = handleStartDrawing;
    }
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

  const removeLastSegment = () => {
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

  const toggleEditMode = () => {
    setIsEditMode((prevEditMode) => {
      if (!prevEditMode && !isDrawing) {
        paper.view.onClick = handleStartDrawing;
      } else {
        paper.view.onClick = null;
      }
      return !prevEditMode;
    });
    setIsDrawing(false);
  };

  useEffect(() => {
    if (paper.project) {
      if (isEditMode) {
        paper.view.onClick = calculateSelectedPointCoordinants;
      } else {
        paper.view.onClick = null;
      }
    }
  }, [isEditMode]);

  useEffect(() => {
    if (paper.project) {
      if (isEditMode && selectedPoint) {
        paper.view.onMouseMove = handleDragPoint;
      } else {
        paper.view.onMouseMove = null;
      }

      paper.view.onMouseUp = () => {
        if (isEditMode) {
          paper.view.onMouseMove = null;
        }
      };
    }
  }, [isEditMode, selectedPoint]);

  return (
    <div className="image-mapper-wrapper">
      <div className="image-mapper-container">
        <ImageMapper
          src="/src/assets/apartment.png"
          map={{
            name: "Redberry",
            areas: [...areas],
          }}
          onLoad={handleImageCoordinants}
        />

        <canvas
          id="canvas"
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
          resize="true"
        />
      </div>

      <div className="buttons-container">
        {!isDrawing && !isEditMode && (
          <button onClick={startDrawing}>Start Drawing</button>
        )}
        {isDrawing || isEditMode ? (
          <>
            <button onClick={handleStopDrawing}>Stop Drawing</button>{" "}
            <button onClick={removeLastSegment}>Remove last segment</button>{" "}
            <button onClick={toggleEditMode}>
              {isEditMode ? "Exit edit mode" : "Start edit mode"}
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Paper;
