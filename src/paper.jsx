import React, { useRef, useEffect } from "react";
import paper from "paper";

function Paper() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Setup Paper.js on the canvas
    paper.setup(canvasRef.current);

    // Store the current drawing path
    let currentPath;

    // Mouse down event handler
    function onMouseDown(event) {
      currentPath = new paper.Path();
      currentPath.strokeColor = "black";
      currentPath.add(event.point);
    }

    // Mouse drag event handler
    function onMouseDrag(event) {
      if (currentPath) {
        currentPath.add(event.point);
      }
    }

    // Mouse up event handler
    function onMouseUp() {
      currentPath = null;
    }

    // Attach event listeners
    canvasRef.current.addEventListener("mousedown", onMouseDown);
    canvasRef.current.addEventListener("mousemove", onMouseDrag);
    canvasRef.current.addEventListener("mouseup", onMouseUp);

    return () => {
      // Clean up event listeners
      canvasRef.current.removeEventListener("mousedown", onMouseDown);
      canvasRef.current.removeEventListener("mousemove", onMouseDrag);
      canvasRef.current.removeEventListener("mouseup", onMouseUp);

      paper.remove();
    };
  }, []);

  return <canvas ref={canvasRef} />;
}

export default Paper;
