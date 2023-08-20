import React, { useState, useRef } from "react";
import ImageMapper from "react-img-mapper";
import "./app.css";

const App = () => {
  const [displayMessage, setDisplayMessage] = useState("");
  const [coordinatesMessage, setCoordinatesMessage] = useState("");
  const canvasRef = useRef(null);

  const [drawingPolygon, setDrawingPolygon] = useState(false);
  const [polygonPoints, setPolygonPoints] = useState([]);

  const canvasClick = (e) => {
    if (drawingPolygon) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setPolygonPoints([...polygonPoints, { x, y }]);
      drawPolygonOnCanvas([...polygonPoints, { x, y }]);
    }
  };

  const drawPolygonOnCanvas = (points) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (points.length < 2) return;

    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      context.lineTo(points[i].x, points[i].y);
    }
    context.closePath();
    context.stroke();
  };

  const togglePolygonDrawing = () => {
    if (drawingPolygon) {
      setPolygonPoints([]);
    }
    setDrawingPolygon(!drawingPolygon);
  };

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
        onLoad={onImageLoadEventHandler}
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
          width={800}
          height={600}
          onMouseDown={(e) => canvasClick(e)}
        />
      ) : null}

      <button onClick={togglePolygonDrawing}>
        {drawingPolygon ? "Finish Drawing Polygon" : "Start Drawing Polygon"}
      </button>

      <h1>{displayMessage ? displayMessage : null}</h1>
      <h2>{coordinatesMessage ? coordinatesMessage : null}</h2>
    </div>
  );
};

export default App;
