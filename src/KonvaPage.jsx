import React, { useState, useRef } from "react";
import { Stage, Layer, Rect, Line } from "react-konva";

const KonvaPage = () => {
  const [points, setPoints] = useState([]);
  const [cursorMousePosition, setCursorMousePosition] = useState([0, 0]);
  const [isMouseOverStartPoint, setIsMouseOverStartPoint] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const stageRef = useRef();

  const getMousePosition = () => {
    return [
      stageRef.current.getPointerPosition().x,
      stageRef.current.getPointerPosition().y,
    ];
  };

  const handleClick = (event) => {
    const mousePos = getMousePosition();

    if (isFinished) {
      return;
    }

    if (isMouseOverStartPoint && points.length >= 3) {
      setIsFinished(true);
    } else {
      setPoints([...points, mousePos]);
    }
  };

  const handleMouseMove = (event) => {
    const mousePos = getMousePosition();
    setCursorMousePosition(mousePos);
  };

  const handleMouseOverStartPoint = (event) => {
    if (isFinished || points.length < 3) return;
    event.target.scale({ x: 2, y: 2 });
    setIsMouseOverStartPoint(true);
  };

  const handleMouseOutStartPoint = (event) => {
    event.target.scale({ x: 1, y: 1 });
    setIsMouseOverStartPoint(false);
  };

  const handleDragStartPoint = (event) => {
    console.log("start", event);
  };

  const handleDragMovePoint = (event) => {
    const index = event.target.index - 1;
    const pos = [event.target.attrs.x, event.target.attrs.y];
    setPoints((prevPoints) => [
      ...prevPoints.slice(0, index),
      pos,
      ...prevPoints.slice(index + 1),
    ]);
  };

  const handleDragEndPoint = (event) => {
    console.log("end", event);
  };

  // [ [a, b], [c, d], ... ] to [ a, b, c, d, ...]
  const flattenedPoints = points
    .concat(isFinished ? [] : cursorMousePosition)
    .reduce((a, b) => a.concat(b), []);

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleClick}
      onMouseMove={handleMouseMove}
      ref={stageRef}
    >
      <Layer>
        <Line
          points={flattenedPoints}
          stroke="black"
          strokeWidth={5}
          closed={isFinished}
        />
        {points.map((point, index) => {
          const width = 6;
          const x = point[0] - width / 2;
          const y = point[1] - width / 2;
          const startPointAttr =
            index === 0
              ? {
                  hitStrokeWidth: 12,
                  onMouseOver: handleMouseOverStartPoint,
                  onMouseOut: handleMouseOutStartPoint,
                }
              : null;
          return (
            <Rect
              key={index}
              x={x}
              y={y}
              width={width}
              height={width}
              fill="white"
              stroke="black"
              strokeWidth={3}
              onDragStart={handleDragStartPoint}
              onDragMove={handleDragMovePoint}
              onDragEnd={handleDragEndPoint}
              draggable
              {...startPointAttr}
            />
          );
        })}
      </Layer>
    </Stage>
  );
};

export default KonvaPage;
