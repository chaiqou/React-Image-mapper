import React from "react";
import paper from "paper";

const Paper = () => {
  let path;

  const handleStartDrawing = (event) => {
    if (!path) {
      path = new paper.Path({
        strokeColor: "green",
        strokeWidth: 2,
        closed: true,
        fullySelected: true,
      });
    }
    path.add(event.point);
  };

  const startDrawing = () => {
    paper.setup("canvas");
    paper.view.onClick = handleStartDrawing;
  };

  const stopDrawing = () => {
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
