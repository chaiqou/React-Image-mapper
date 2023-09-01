import React, { useState, useRef } from "react";
import paper from "paper";

const Paper = () => {
  const [drawing, setDrawing] = useState(false);
  const [paths, setPaths] = useState([]);
  const currentPathRef = useRef(null);

  const handleStartDrawing = (event) => {
    if (!currentPathRef.current) {
      currentPathRef.current = new paper.Path({
        strokeColor: "green",
        strokeWidth: 2,
        closed: true,
        fullySelected: true,
      });
    }
    currentPathRef.current.add(event.point);
  };

  const startDrawing = () => {
    setDrawing(true);
    paper.setup("canvas");
    paper.view.onClick = handleStartDrawing;
  };

  const stopDrawing = () => {
    setDrawing(false);
    paper.view.onClick = null;
  };

  return (
    <>
      <canvas style={{ width: "100%", height: "100%" }} id="canvas" />
      <button onClick={startDrawing}>Start Drawing</button>
      <button onClick={stopDrawing}>Stop Drawing</button>
    </>
  );
};

export default Paper;
