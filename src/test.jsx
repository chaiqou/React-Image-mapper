import React from "react";

export const test = () => {
  const handleMouseMoveOnCanvas = (event) => {
    if (!isDrawing && selectedPointIndexRef.current !== -1) {
      // Check if we have a selected point for drag-and-drop
      const { point } = event.event; // Get the mouse cursor position
      const selectedPoint =
        draggablePointsRef.current[selectedPointIndexRef.current];

      // Update the selected point's position when dragging
      selectedPoint.x = point.x;
      selectedPoint.y = point.y;

      // Update the canvas
      paper.view.draw();
    }
  };

  const handleMouseUpOnCanvas = () => {
    // Clear the selected point index when the mouse button is released
    selectedPointIndexRef.current = -1;
  };

  return (
    <div
      onMouseMove={handleMouseMoveOnCanvas}
      onMouseUp={handleMouseUpOnCanvas}
    >
      test
    </div>
  );
};
