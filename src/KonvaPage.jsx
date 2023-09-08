import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Rect, Line, Image, Group } from "react-konva";

const KonvaPage = () => {
  const [points, setPoints] = useState([]);
  const [cursorMousePosition, setCursorMousePosition] = useState([0, 0]);
  const [isMouseOverStartPoint, setIsMouseOverStartPoint] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [image] = useState({
    imageObj: new window.Image(),
    imageUrl: "../src/assets/apartment.png",
  });
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [floors, setFloors] = useState([]);

  const stageRef = useRef();

  useEffect(() => {
    image.imageObj.src = image.imageUrl;
  }, []);

  const getMousePosition = () => {
    return [
      stageRef.current.getPointerPosition().x,
      stageRef.current.getPointerPosition().y,
    ];
  };

  const handleClick = () => {
    const mousePos = getMousePosition();

    if (isMouseOverStartPoint && points.length >= 3) {
      setIsFinished(true);
    } else if (isDrawing) {
      setPoints([...points, mousePos]);
    }
  };

  const handleMouseMove = () => {
    const mousePosition = getMousePosition();
    setCursorMousePosition(mousePosition);
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

  const handleDragMovePoint = (event) => {
    const index = event.target.index - 1;
    const position = [event.target.attrs.x, event.target.attrs.y];
    setPoints((previousPoints) => [
      ...previousPoints.slice(0, index),
      position,
      ...previousPoints.slice(index + 1),
    ]);
  };

  const toggleDrawingMode = () => {
    setIsDrawing(!isDrawing);
    setIsEditing(false);
    if (points.length > 0) {
      setFloors([...floors, points]);
    }
    setPoints([]);
  };

  const toggleEditingMode = () => {
    setIsEditing(!isEditing);
    if (points.length > 0) {
      setFloors([points]);
    }
  };

  // [ [a, b], [c, d], ... ] to [ a, b, c, d, ...]
  const flattenedPoints = points
    .concat(isFinished ? [] : cursorMousePosition)
    .reduce((a, b) => a.concat(b), []);

  return (
    <>
      <button onClick={toggleDrawingMode}>
        {isDrawing ? "Stop Drawing" : "Start Drawing"}
      </button>
      {isDrawing && (
        <button onClick={toggleEditingMode}>
          {isEditing ? "Stop Editing" : "Start Editing"}
        </button>
      )}
      <h1>{flattenedPoints}</h1>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleClick}
        onMouseMove={handleMouseMove}
        ref={stageRef}
        style={{ cursor: isDrawing ? "crosshair" : "default" }}
      >
        <Layer>
          <Image
            image={image.imageObj}
            width={window.innerWidth}
            height={window.innerHeight}
          />
          <Group>
            <Line
              points={flattenedPoints}
              stroke="black"
              lineJoin="round"
              strokeWidth={5}
              closed={isFinished}
            />
            {points.map((point, index) => {
              const width = 6;
              const x = point[0] - width / 2.5;
              const y = point[1] - width / 2.5;
              const startPointerAttributes =
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
                  fill="red"
                  stroke="red"
                  strokeWidth={3}
                  onDragMove={handleDragMovePoint}
                  draggable={isEditing}
                  {...startPointerAttributes}
                />
              );
            })}
            {floors.map((floorPoints, index) => (
              <Line
                key={`floor-${index}`}
                points={floorPoints.reduce((a, b) => a.concat(b), [])}
                fill="blue"
                lineJoin="round"
                opacity={0.5}
                closed={true}
              />
            ))}
          </Group>
        </Layer>
      </Stage>
    </>
  );
};

export default KonvaPage;
