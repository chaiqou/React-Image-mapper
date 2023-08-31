import React, { useEffect } from "react";
import paper from "paper";

const Paper = () => {
  useEffect(() => {
    paper.setup("canvas");

    let path;

    const handleMouseClick = (event) => {
      if (!path) {
        path = new paper.Path({
          strokeColor: "black",
        });
      }
      path.add(event.point);
    };

    // Attach event listener to the Paper.js canvas
    paper.view.onClick = handleMouseClick;

    return () => {
      paper.view.onClick = null;
    };
  }, []);

  return <canvas style={{ width: "100%", height: "100%" }} id="canvas" />;
};

export default Paper;
