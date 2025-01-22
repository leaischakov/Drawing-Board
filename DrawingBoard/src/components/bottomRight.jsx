import React from "react";
import { Rect, Line } from "react-konva";
import useDrawingHandlers from "../hook/useDrawingHandlers";

const BottomRight = ({ x, y, width, height, color }) => {
    const {
        lines,
        handleMouseDown, handleMouseMove, handleMouseUp, handleTouchStart, handleTouchMove, handleTouchEnd
    } = useDrawingHandlers({
        type: "fade",
    });

    return (
        <>
            <Rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={color}
                //stroke="black"
                strokeWidth={2}
                onMouseDown={handleMouseDown} // התחלת ציור
                onMouseMove={handleMouseMove} // ציור תוך כדי תזוזת העכבר
                onMouseUp={handleMouseUp} // עצירת ציור
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                cornerRadius={[0, 0, 20, 0]}
            />
            {lines.map((line, index) => (
                <Line
                    key={index}
                    points={line.points}
                    stroke="black"
                    strokeWidth={2}
                    opacity={line.opacity}
                />
            ))}
        </>
    );
};

export default BottomRight;