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
        shape: "poly", // ფორმა (rect,poly,circ)
        coords: [46, 357, 928, 402, 928, 473, 47, 409], // ფორმის კოორდინატები [x1, y1, x2, y1, x2, y2, x1, y2]
        fillColor: "rgba(229, 0, 0, 0.3)", // რა ფერი გახდება ჰოვერზე
        strokeColor: "rgba(0, 0, 0, 0, 0)", // ბორდერის ფერი
        lineWidth: 0, // ბორდერის სისქე
        preFillColor: "#5da0d02e", // ჰოვერამდე ფერის მინიჭება
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

      <h1>{displayMessage ? displayMessage : null}</h1>
      <h2>{coordinatesMessage ? coordinatesMessage : null}</h2>
    </div>
  );
};

export default App;
