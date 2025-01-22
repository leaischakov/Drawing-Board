import React, { useState, useEffect } from "react";
import { Rect, Line } from "react-konva";
import useDrawingHandlers from "../hook/useDrawingHandlers";

const TopLeft = ({ x, y, width, height, color }) => {
  //קריאה ל HOOK 
  const { lines, handleMouseDown, handleMouseMove, handleMouseUp, handleTouchStart, handleTouchMove, handleTouchEnd } =
    useDrawingHandlers({
      type: "default",
    });

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
        cornerRadius={[20, 0, 0, 0]}

      />

      {lines.map((line, index) => (
        <Line
          key={index}
          points={line.points}
          stroke="black"
          strokeWidth={2}
        />
      ))}
    </>
  );
};
export default TopLeft;