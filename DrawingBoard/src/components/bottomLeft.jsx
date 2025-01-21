//////////////////////טובבבבבבבבבבבבבבבבבבבבב

import React, { useState, useEffect } from "react";
import { Rect, Line } from "react-konva";
import useDrawingHandlers from "./useDrawingHandlers";
// const { lines, handleMouseDown, handleMouseMove, handleMouseUp } =
//   useDrawingHandlers({
//     type: "mirror",
//   });


const BottomLeft = ({ x, y, width, height, color }) => {


  const [lines, setLines] = useState([]); // שמירת הקווים
  const [isDrawing, setIsDrawing] = useState(false);

  // אחסון גודל המסך הנוכחי
  const [stageSize, setStageSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });



  useEffect(() => {
    const handleResize = () => {
      const newSize = { width: window.innerWidth, height: window.innerHeight };
      updateLinesOnResize(newSize);
      setStageSize(newSize);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [lines, stageSize]);


  const updateLinesOnResize = (newSize) => {
    const scaleX = newSize.width / stageSize.width;
    const scaleY = newSize.height / stageSize.height;

    const updatedLines = lines.map((line) => {
      const adjustedPoints = line.points.map((point, index) =>
        index % 2 === 0 ? point * scaleX : point * scaleY
      );
      return { points: adjustedPoints };
    });

    setLines(updatedLines);
  };

  const handleMouseDown = (event) => {
    setIsDrawing(true);
    const stage = event.target.getStage();
    const pointerPosition = stage.getPointerPosition();

    setLines([
      ...lines,
      {
        points: [
          pointerPosition.x / stageSize.width,
          pointerPosition.y / stageSize.height,
        ],
      },
    ]);
  };
  const handleTouchStart = (event) => {
    setIsDrawing(true);
    const stage = event.target.getStage();
    const pointerPosition = stage.getPointerPosition();

    setLines([
      ...lines,
      {
        points: [
          pointerPosition.x / stageSize.width,
          pointerPosition.y / stageSize.height,
        ],
      },
    ]);
  };

  const handleMouseMove = (event) => {
    if (!isDrawing) return;

    const stage = event.target.getStage();
    const pointerPosition = stage.getPointerPosition();

    setLines((prevLines) => {
      const lastLine = { ...prevLines[prevLines.length - 1] };
      lastLine.points = [
        ...lastLine.points,
        pointerPosition.x / stageSize.width,
        pointerPosition.y / stageSize.height,
      ];
      return [...prevLines.slice(0, -1), lastLine];
    });
  };

  const handleTouchMove = (event) => {
    if (!isDrawing) return;

    const stage = event.target.getStage();
    const pointerPosition = stage.getPointerPosition();

    setLines((prevLines) => {
      const lastLine = { ...prevLines[prevLines.length - 1] };
      lastLine.points = [
        ...lastLine.points,
        pointerPosition.x / stageSize.width,
        pointerPosition.y / stageSize.height,
      ];
      return [...prevLines.slice(0, -1), lastLine];
    });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };
  const handleTouchEnd = () => {
    setIsDrawing(false);
  };



  return (
    <>
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        stroke="black"
        strokeWidth={2}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        cornerRadius={[0, 0, 0, 20]}
      />

      {lines.map((line, index) => (
        <React.Fragment key={index}>
          <Line
            points={line.points.map((point, idx) =>
              idx % 2 === 0
                ? point * stageSize.width
                : point * stageSize.height
            )}
            //points={line.points}
            stroke="black"
            strokeWidth={2}
            tension={0.5}
            lineCap="round"
          />

          <Line
            points={line.points.map((point, idx) =>
              idx % 2 === 0
                ? x + width - (point * window.innerWidth - x)
                : point * window.innerHeight
            )}
            stroke="red"
            strokeWidth={2}
            tension={0.5}
            lineCap="round"
          />
        </React.Fragment>
      ))}
    </>
  );
};

export default BottomLeft;



