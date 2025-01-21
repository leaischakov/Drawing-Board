import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer } from "react-konva";
import TopLeft from './topLeft';
import TopRight from './topRight';
import BottomLeft from './bottomLeft';
import BottomRight from './bottomRight';
// import Grid from '@mui/material/Grid'
import Grid from '@mui/material/Grid';


const Canvas = () => {
  const stageRef = useRef(null);

  const [stageSize, setStageSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setStageSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { width, height } = stageSize;

  const headerHeight = height * 0.1; // Header height is 10% of the screen
  const drawWidth = width;
  const drawHeight = height - headerHeight;

  return (
    <>
      <div
        style={{
          width: "100%",
          height: `${headerHeight}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Header shadow
          padding: "0 1rem", // Padding for extra spacing
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "calc(1.5rem + 1vw)", // Responsive font size (adjusts with screen width)
            color: "black",
            textAlign: "center", // Ensures text is centered
          }}
        >
          Interactive Drawing
        </h1>
      </div>

      <Stage ref={stageRef} width={drawWidth} height={drawHeight}>
        <Layer>
          <TopLeft
            x={0}
            y={0}
            width={drawWidth / 2}
            height={drawHeight / 2}
            color="#34495E" // Steel blue
          />
          <TopRight
            x={drawWidth / 2}
            y={0}
            width={drawWidth / 2}
            height={drawHeight / 2}
            color="#7F8C8D" // Smoky gray
          />
          <BottomLeft
            x={0}
            y={drawHeight / 2}
            width={drawWidth / 2}
            height={drawHeight / 2}
            color="#95A5A6" // Greenish gray
          />
          <BottomRight
            x={drawWidth / 2}
            y={drawHeight / 2}
            width={drawWidth / 2}
            height={drawHeight / 2}
            color="#BDC3C7" // Silver gray
          />
        </Layer>
      </Stage>

    </>
  );
};

export default Canvas;
