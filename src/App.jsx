import React, { useState, useRef, useEffect } from "react";
import ImageMapper from "react-img-mapper";
import "./app.css";

const App = () => {
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

  const drawDraggablePointsOnCanvas = (points) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    clearCanvas();

    if (drawingMode) {
      if (editMode) {
        context.fillStyle = "red";
        points.forEach((point) => {
          context.beginPath();
          context.arc(point.x, point.y, 7, 0, Math.PI * 2);
          context.fill();
        });

        if (points.length >= 2) {
          context.beginPath();
          context.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < points.length; i++) {
            context.lineTo(points[i].x, points[i].y);
          }
          context.closePath();
          context.stroke();
        }
      } else {
        context.fillStyle = "red";
        points.forEach((point) => {
          context.beginPath();
          context.arc(point.x, point.y, 7, 0, Math.PI * 2);
          context.fill();
        });

        if (points.length >= 2) {
          context.beginPath();
          context.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < points.length; i++) {
            context.lineTo(points[i].x, points[i].y);
          }
          context.closePath();
          context.stroke();
        }
      }
    }
  };

  // Checks akways up to dated dragabble points state
  useEffect(() => {
    if (draggablePoints.length > 0) {
      drawDraggablePointsOnCanvas(draggablePoints);
    }
  }, [draggablePoints]);

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.addEventListener("mousedown", handleCanvasMouseDown);
    }

    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener(
          "mousedown",
          handleCanvasMouseDown
        );
      }
    };
  }, []);

  const handleCanvasMouseDown = (event) => {
    event.preventDefault();
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    let isDragging = false;
    let draggedIndex = -1;

    if (editMode) {
      draggablePoints.forEach((point, index) => {
        const distance = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);
        if (distance < 5 * 2) {
          isDragging = true;
          draggedIndex = index;
        }
      });
    }

    const handleMouseMove = (moveEvent) => {
      if (isDragging && draggedIndex !== -1) {
        const newX = moveEvent.clientX - rect.left;
        const newY = moveEvent.clientY - rect.top;
        updateDraggablePoint(draggedIndex, newX, newY);
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
      draggedIndex = -1;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    if (editMode) {
      if (isDragging) {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
      }
    } else {
      setDraggablePoints((prevPoints) => [...prevPoints, { x, y }]);
      drawDraggablePointsOnCanvas([...draggablePoints, { x, y }]);
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

  return (
    <div className="image-mapper-container">
      <ImageMapper
        src="/src/assets/apartment.png"
        map={{
          name: "Redberry",
          areas: [...areas],
        }}
        onLoad={handleImageLoad}
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
        />
      ) : null}

      {drawingMode &&
        draggablePoints.map((point, index) => (
          <div
            key={index}
            onMouseMove={() => onMouseMoveDraggablePoint(index)}
          />
        ))}

      <button onClick={() => setDrawingMode(!drawingMode)}>
        {drawingMode ? "Exit Drawing Mode" : "Enter Drawing Mode"}
      </button>
      <button onClick={() => setEditMode(!editMode)}>Toggle Edit Mode</button>

      <button onClick={() => setDrawingPolygon(true)}>
        Start Drawing Polygon
      </button>
      <button onClick={stopDrawing}>Stop Drawing</button>

      <h1>{displayMessage ? displayMessage : null}</h1>
      <h2>{coordinatesMessage ? coordinatesMessage : null}</h2>
    </div>
  );
};

export default App;
