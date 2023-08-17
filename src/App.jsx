import React from "react";
import ImageMapper from "react-img-mapper";

const App = () => {
  const imageMapperProps = {
    name: "Redberry",
    areas: [
      {
        name: "First floor",
        shape: "poly",
        coords: [46, 357, 928, 402, 928, 473, 47, 409],
        preFillColor: "#5da0d02e",
        lineWidth: 5,
        lineColor: "red",
      },
    ],
  };

  const onClickListener = (object) => {
    console.log(
      `You clicked on ${object.shape} at coords ${JSON.stringify(
        object.coords
      )}`
    );
  };

  return (
    <ImageMapper
      src="/src/assets/apartment.png"
      map={imageMapperProps}
      onClick={onClickListener}
    />
  );
};

export default App;
