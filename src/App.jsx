import React, { useState, useRef } from "react";
import ImageMapper from "react-img-mapper";
import "./app.css";

const App = () => {
  const [displayMessage, setDisplayMessage] = useState("");
  const [coordinatesMessage, setCoordinatesMessage] = useState("");
  const canvasRef = useRef(null);

  const [drawingPolygon, setDrawingPolygon] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [areas, setAreas] = useState([]);
  const [draggablePoints, setDraggablePoints] = useState([]);

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

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const drawDraggablePointsOnCanvas = (points) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    clearCanvas();

    context.fillStyle = "blue";
    points.forEach((point) => {
      context.beginPath();
      context.arc(point.x, point.y, 5, 0, Math.PI * 2);
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
  };

  const canvasClick = (e) => {
    if (drawingPolygon) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setDraggablePoints([...draggablePoints, { x, y }]);
      drawDraggablePointsOnCanvas(draggablePoints);
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
    if (e.buttons === 1) {
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

  // 	Click on a zone in image
  const onClickEventHandler = (area) => {
    setDisplayMessage(
      `You clicked on ${area.name} at coordinant ${JSON.stringify(area.coords)}`
    );
  };

  // 	Image loading and canvas initialization completed
  const onImageLoadEventHandler = () => {
    setDisplayMessage("Load first!");
  };

  // Moving mouse on a zone in image
  const onMouseMoveEventHandler = (area, _, event) => {
    const coords = { x: event.nativeEvent.layerX, y: event.nativeEvent.layerY };
    setCoordinatesMessage(
      "You moved on " +
        area.shape +
        " " +
        area.name +
        ' at coords {"x":' +
        coords.x +
        ',"y":' +
        coords.y +
        "} !"
    );
  };

  // Hovering a zone in image
  const onMouseEnterEventHandler = (area) => {
    setCoordinatesMessage(
      `You entered ${area.shape} ${area.name} at coordinant ${JSON.stringify(
        area.coords
      )} !`
    );
  };

  // Leaving a zone in image
  const onMouseLeaveEventHandler = (area) => {
    setCoordinatesMessage(
      `You leaved ${area.shape} ${area.name} at coordinant ${JSON.stringify(
        area.coords
      )} !`
    );
  };

  // Click outside of a zone in image
  const onClickOutsideImageZoneEventHandler = (event) => {
    const coords = { x: event.nativeEvent.layerX, y: event.nativeEvent.layerY };
    setDisplayMessage(
      `You clicked on the image outside zone at coords ${JSON.stringify(
        coords
      )} !`
    );
  };

  // Moving mouse on the image itself	outside zone
  const onImageMouseMoveEventHandler = (event) => {
    const coords = { x: event.nativeEvent.layerX, y: event.nativeEvent.layerY };
    setDisplayMessage(
      `You moved on the image outside zone at coords ${JSON.stringify(
        coords
      )} !`
    );
  };

  return (
    <div className="image-mapper-container">
      <ImageMapper
        src="/src/assets/apartment.png"
        map={imageMapperProps}
        onClick={onClickEventHandler}
        onLoad={handleImageLoad}
        onMouseMove={onMouseMoveEventHandler}
        onMouseEnter={onMouseEnterEventHandler}
        onMouseLeave={onMouseLeaveEventHandler}
        onImageClick={onClickOutsideImageZoneEventHandler}
        onImageMouseMove={onImageMouseMoveEventHandler}
        responsive="true"
        parentWidth={920}
        natural
      />

      {drawingPolygon ? (
        <canvas
          ref={canvasRef}
          className="canvas"
          width={imageDimensions.width}
          height={imageDimensions.height}
          onMouseDown={(e) => canvasClick(e)}
        />
      ) : null}

      {draggablePoints.map((point, index) => (
        <div
          key={index}
          className="draggable-point"
          style={{ left: point.x, top: point.y }}
          onMouseMove={(e) => onMouseMoveDraggablePoint(e, index)}
        />
      ))}

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
