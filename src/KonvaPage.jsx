import { useState, useRef, useEffect } from "react";
import { Stage, Layer, Rect, Line, Image, Group } from "react-konva";

const KonvaPage = () => {
  const [points, setPoints] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [image] = useState({
    imageObj: new window.Image(),
    imageUrl: "../src/assets/apartment.png",
  });

  const [cursorMousePosition, setCursorMousePosition] = useState([0, 0]);
  const [isMouseOverStartPoint, setIsMouseOverStartPoint] = useState(false);

  const [isFinished, setIsFinished] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [stageWidth, setStageWidth] = useState(window.innerWidth);
  const [stageHeight, setStageHeight] = useState(window.innerHeight);

  const stageRef = useRef();

  useEffect(() => {
    image.imageObj.src = image.imageUrl;
  }, [image.imageObj, image.imageUrl]);

  useEffect(() => {
    const handleResize = () => {
      setStageWidth(window.innerWidth);
      setStageHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getMousePosition = () => {
    return [
      stageRef.current.getPointerPosition().x,
      stageRef.current.getPointerPosition().y,
    ];
  };

  const handleClick = () => {
    const mousePosition = getMousePosition();

    if (isEditing) {
      return;
    }

    if (isMouseOverStartPoint && points.length >= 3) {
      setIsFinished(true);
    } else if (isDrawing) {
      setPoints([...points, mousePosition]);
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
    updatePointPositionInEditMode(index, position);
  };

  const toggleDrawingMode = () => {
    setIsDrawing(!isDrawing);
    setIsEditing(false);
    if (points.length > 0) {
      setShapes([...shapes, points]);
    }
    setPoints([]);
  };

  const toggleEditingMode = () => {
    setIsEditing(!isEditing);
  };

  const updatePointPositionInEditMode = (index, position) => {
    setPoints((previousPoints) => [
      ...previousPoints.slice(0, index),
      position,
      ...previousPoints.slice(index + 1),
    ]);
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
      <Stage
        width={stageWidth}
        height={stageHeight}
        onMouseDown={handleClick}
        onMouseMove={handleMouseMove}
        ref={stageRef}
        style={{ cursor: isDrawing ? "crosshair" : "default" }}
      >
        <Layer>
          <Image
            image={image.imageObj}
            width={stageWidth}
            height={stageHeight}
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
            {shapes.map((floorPoints, index) => (
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
