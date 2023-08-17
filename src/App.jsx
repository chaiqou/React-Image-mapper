import React, { useState } from "react";
import ImageMapper from "react-img-mapper";
import "./app.css";

const App = () => {
  const [displayMessage, setDisplayMessage] = useState("");
  const [coordinatesMessage, setCoordinatesMessage] = useState("");
  const [hoveredArea, setHoveredArea] = useState(null);

  const imageMapperProps = {
    name: "Redberry",
    areas: [
      {
        name: "First floor",
        shape: "poly", // ფორმა (rect,poly,circ)
        coords: [46, 357, 928, 402, 928, 473, 47, 409], // ფორმის კოორდინატები
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

  const onClickEventHandler = (object) => {
    setDisplayMessage(
      `You clicked on ${object.shape} at coordinant ${JSON.stringify(
        object.coords
      )}`
    );
  };

  const onImageLoadEventHandler = () => {
    setDisplayMessage("Load first!");
  };

  const onMouseMoveEventHandler = (object, _, event) => {
    console.log(event);
    const coords = { x: event.nativeEvent.layerX, y: event.nativeEvent.layerY };
    setCoordinatesMessage(
      `You moved on the image at coordinant ${JSON.stringify(coords)} !`
    );
  };

  const onMouseEnterEventHandler = (object) => {
    setHoveredArea(object);
    setCoordinatesMessage(
      `You entered ${object.shape} ${
        object.name
      } at coordinant ${JSON.stringify(object.coords)} !`
    );
  };

  const onMouseLeaveEventHandler = (object) => {
    setHoveredArea(null);
    setCoordinatesMessage(
      `You leaved ${object.shape} ${object.name} at coordinant ${JSON.stringify(
        object.coords
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
      />

      <h1>{displayMessage ? displayMessage : null}</h1>
      <h2>{coordinatesMessage ? coordinatesMessage : null}</h2>
    </div>
  );
};

export default App;
