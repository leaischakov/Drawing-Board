import React from "react";
import { Rect, Line } from "react-konva";
import useDrawingHandlers from "../hook/useDrawingHandlers";

const TopRight = ({ x, y, width, height, color }) => {

  const { lines, handleMouseDown, handleMouseMove, handleMouseUp, handleTouchStart, handleTouchMove, handleTouchEnd } =
    useDrawingHandlers({
      type: "diley",
    });

  return (
    <>

      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        cornerRadius={[0, 20, 0, 0]} // פינות מעוגלות
      />
      {lines.map((line, index) => (
        <Line
          key={index}
          points={line.points}
          stroke='bluck'
          strokeWidth={2}
        />
      ))}
    </>
  );
};

export default TopRight;