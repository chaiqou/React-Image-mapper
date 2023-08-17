import React, { useState } from "react";
import ImageMapper from "react-img-mapper"; // Make sure to import the correct package

const URL = "https://c1.staticflickr.com/5/4052/4503898393_303cfbc9fd_b.jpg";

const App = () => {
  const map = {
    name: "Redberry",
    areas: [
      {
        name: "1",
        shape: "poly",
        coords: [25, 33, 27, 300, 128, 240, 128, 94],
        preFillColor: "#5da0d02e",
        lineWidth: 5,
        lineColor: "red",
      },
      {
        name: "2",
        shape: "poly",
        coords: [219, 118, 220, 210, 283, 210, 284, 119],
        lineWidth: 2,
        strokeColor: "rgb(255, 99, 71)",
        preFillColor: "#d05db74d",
        fillColor: "yellow",
      },
      {
        name: "3",
        shape: "poly",
        coords: [381, 241, 383, 94, 462, 53, 457, 282],
        fillColor: "yellow",
      },
      {
        name: "4",
        shape: "poly",
        coords: [245, 285, 290, 285, 274, 239, 249, 238],
        preFillColor: "red",
      },
      { name: "5", shape: "circle", coords: [170, 100, 25] },
    ],
  };

  return <ImageMapper src={URL} map={map} width={500} />;
};

export default App;
