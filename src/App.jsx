import React, { useState, useRef } from "react";
import ImageMapper from "react-img-mapper";
import "./app.css";

const App = () => {
  const [displayMessage, setDisplayMessage] = useState("");
  const [coordinatesMessage, setCoordinatesMessage] = useState("");
  const canvasRef = useRef(null);
  const [shape, setShape] = useState(null);
  const [coordinates, setCoordinates] = useState([]);
  const [addShape, setAddShape] = useState(false);

  const drawShapeOnCanvas = () => {
    if (!shape) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    const { x, y, width, height } = shape;
    context.strokeRect(x, y, width, height);
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setShape({ type: "rectangle", x, y, width: 0, height: 0 });
  };

  const drawShape = (e) => {
    if (!shape) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const width = e.clientX - rect.left - shape.x;
    const height = e.clientY - rect.top - shape.y;

    setShape((prevShape) => ({ ...prevShape, width, height }));
    console.log(shape);
    drawShapeOnCanvas();
  };

  const endDrawing = () => {
    if (shape) {
      const updatedCoordinates = [...coordinates, shape];
      setCoordinates(updatedCoordinates);
      setShape(null);
      drawShapeOnCanvas(); // Clear the canvas after drawing
    }
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
      {
        name: "Second floor",
        shape: "poly",
        coords: [46, 357, 46, 304, 929, 326, 928, 402],
        fillColor: "rgba(229, 0, 0, 0.3)",
        strokeColor: "rgba(0, 0, 0, 0, 0)",
        lineWidth: 0,
        preFillColor: "#5da0d02e",
        center: [30, 35, 35, 53],
      },
      {
        name: "Third floor",
        shape: "poly",
        coords: [46, 304, 44, 251, 931, 251, 929, 326],
        fillColor: "rgba(229, 0, 0, 0.3)",
        strokeColor: "rgba(0, 0, 0, 0, 0)",
        lineWidth: 0,
        preFillColor: "#5da0d02e",
        center: [30, 35, 35, 53],
      },
      {
        name: "Fourth floor",
        shape: "poly",
        coords: [44, 251, 44, 196, 933, 174, 931, 251],
        fillColor: "rgba(229, 0, 0, 0.3)",
        strokeColor: "rgba(0, 0, 0, 0, 0)",
        lineWidth: 0,
        preFillColor: "rgba(93, 160, 208, 0.5)",
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

      {addShape ? (
        <canvas
          ref={canvasRef}
          className="canvas"
          width={800}
          height={600}
          onMouseDown={startDrawing}
          onMouseMove={drawShape}
          onMouseUp={endDrawing}
        />
      ) : null}

      <button onClick={() => setAddShape(!addShape)}>Add Shape</button>

      <h1>{displayMessage ? displayMessage : null}</h1>
      <h2>{coordinatesMessage ? coordinatesMessage : null}</h2>
    </div>
  );
};

export default App;
