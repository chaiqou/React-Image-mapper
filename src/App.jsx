import React, { useState } from "react";
import ImageMapper from "react-img-mapper";
import "./app.css";

const App = () => {
  const [displayMessage, setDisplayMessage] = useState("");
  const [coordinatesMessage, setCoordinatesMessage] = useState("");

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

  // Click outside of a zone in image
  const onClickOutsideImageZoneEventHandler = (event) => {
    const coords = { x: event.nativeEvent.layerX, y: event.nativeEvent.layerY };
    setDisplayMessage(
      `You clicked on the image outside zone at coords ${JSON.stringify(
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
        onImageClick={onClickOutsideImageZoneEventHandler}
      />

      <h1>{displayMessage ? displayMessage : null}</h1>
      <h2>{coordinatesMessage ? coordinatesMessage : null}</h2>
    </div>
  );
};

export default App;
