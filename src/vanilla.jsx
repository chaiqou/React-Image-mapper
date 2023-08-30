import React, { useState, useRef, useEffect } from "react";
import ImageMapper from "react-img-mapper";
import "./app.css";

const Vanilla = () => {
  const [displayMessage, setDisplayMessage] = useState("");
  const [coordinatesMessage, setCoordinatesMessage] = useState("");
  const [drawingPolygon, setDrawingPolygon] = useState(false);
  const [drawingMode, setDrawingMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [areas, setAreas] = useState([]);
  const [draggablePoints, setDraggablePoints] = useState([]);
  const [hoveredPointIndex, setHoveredPointIndex] = useState(-1);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const canvasRef = useRef(null);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const drawAndConnectRedCircles = (context, points) => {
    context.fillStyle = "red";
    points.forEach((point) => {
      context.beginPath();
      context.arc(point.x, point.y, 3.5, 0, 3 * 2);
      context.fill();

      // draw lines connecting the points if there are at least 2 points
      if (points.length >= 2) {
        context.beginPath();
        context.moveTo(points[0].x, points[0].y); // move to the first point
        for (let i = 1; i < points.length; i++) {
          context.lineTo(points[i].x, points[i].y); // draw lines to other points
        }
        context.closePath();
        context.stroke();
      }
    });
  };

  const handleCanvasMouseDown = (event) => {
    event.preventDefault();

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left; // Calculate the x of the mouse click relative to the canvas
    const y = event.clientY - rect.top; // Calculate the y of the mouse click relative to the canvas

    // If we're in edit mode, check if the mouse click is near an existing point
    if (editMode) {
      // Find the index of a point that is close to the mouse click
      const draggedIndex = draggablePoints.findIndex(
        (point) => Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2) < 5 * 2
      );

      // If we found a nearby point, set up mouse move and up event listeners for dragging
      if (draggedIndex !== -1) {
        const handleMouseMove = (moveEvent) => {
          const newX = moveEvent.clientX - rect.left;
          const newY = moveEvent.clientY - rect.top;
          updateDraggablePoint(draggedIndex, newX, newY);
        };

        const handleMouseUp = () => {
          // When the mouse button is released, remove the event listeners
          window.removeEventListener("mousemove", handleMouseMove);
          window.removeEventListener("mouseup", handleMouseUp);
        };

        // When the mouse is moved while clicking, call handleMouseMove
        window.addEventListener("mousemove", handleMouseMove);
        // When the mouse button is released, call handleMouseUp
        window.addEventListener("mouseup", handleMouseUp);
      }
    } else {
      // If we're not in edit mode, add a new point to the draggablePoints list
      const newPoint = { x, y };
      setDraggablePoints((prevPoints) => [...prevPoints, newPoint]);

      // Redraw all the draggable points on the canvas, including the new one
      drawDraggablePointsOnCanvas([...draggablePoints, newPoint]);
    }
  };

  const updateDraggablePoint = (index, x, y) => {
    const updatedPoints = [...draggablePoints];
    updatedPoints[index] = { x, y };
    setDraggablePoints(updatedPoints);
    drawDraggablePointsOnCanvas(updatedPoints);
  };

  const stopDrawing = () => {
    if (draggablePoints.length > 2) {
      console.log(draggablePoints.flatMap((point) => [point.x, point.y]));
      const newPolygon = {
        name: `Polygon ${areas.length + 1}`,
        shape: "poly",
        coords: draggablePoints.flatMap((point) => [point.x, point.y]),
        fillColor: "rgba(229, 0, 0, 0.3)",
        strokeColor: "rgba(0, 0, 0, 0, 0)",
        lineWidth: 0,
        preFillColor: "#5da0d02e",
        center: [30, 35, 35, 53],
      };

      setAreas([...areas, newPolygon]);
    }

    setDrawingPolygon(false);
    setDraggablePoints([]);
    clearCanvas();
  };

  const onMouseMoveDraggablePoint = (e, index) => {
    if (editMode && e.buttons === 1) {
      setHoveredPointIndex(index);
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      updateDraggablePoint(index, x, y);
    }
  };

  const handleImageLoad = (image) => {
    setImageDimensions({ width: image.width, height: image.height });
  };

  const drawDraggablePointsOnCanvas = (points) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    clearCanvas();
    if (drawingMode) {
      drawAndConnectRedCircles(context, points);
    }
  };

  useEffect(() => {
    if (draggablePoints.length > 0) {
      drawDraggablePointsOnCanvas(draggablePoints);
    }
  }, [draggablePoints]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("mousedown", handleCanvasMouseDown);
      return () => {
        canvas.removeEventListener("mousedown", handleCanvasMouseDown);
      };
    }
  }, []);

  const onMouseMoveEventHandler = (area, _, event) => {
    const coords = { x: event.nativeEvent.layerX, y: event.nativeEvent.layerY };
    setCoordinatesMessage(
      `You moved on ${area.shape} ${coords.x} - ${coords.y}`
    );
  };

  const onImageMouseMoveEventHandler = (event) => {
    const coords = { x: event.nativeEvent.layerX, y: event.nativeEvent.layerY };
    setDisplayMessage(
      `You moved on the image outside zone at coords ${JSON.stringify(
        coords
      )} !`
    );
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
          onMouseMove={onMouseMoveEventHandler}
          onImageMouseMove={onImageMouseMoveEventHandler}
        />

        {drawingPolygon ? (
          <canvas
            ref={canvasRef}
            className="canvas"
            width={imageDimensions.width}
            height={imageDimensions.height}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={(e) => {
              if (editMode && e.buttons === 1) {
                onMouseMoveDraggablePoint(e, hoveredPointIndex);
              }
            }}
            onMouseUp={() => {
              setHoveredPointIndex(-1);
            }}
            style={{
              cursor: editMode ? "pointer" : "crosshair",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 2,
            }}
          />
        ) : null}
      </div>

      <div className="buttons-container">
        <button onClick={() => setDrawingMode(!drawingMode)}>
          {drawingMode ? "Exit Drawing Mode" : "Enter Drawing Mode"}
        </button>
        <button onClick={() => setEditMode(!editMode)}>Toggle Edit Mode</button>
        <button onClick={() => setDrawingPolygon(true)}>
          Start Drawing Polygon
        </button>
        <button onClick={stopDrawing}>Stop Drawing</button>
      </div>
    </div>
  );
};

export default Vanilla;
