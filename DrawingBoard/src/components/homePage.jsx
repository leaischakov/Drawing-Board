import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Text } from "react-konva";
import TopLeft from './topLeft';
import TopRight from './topRight';
import BottomLeft from './bottomLeft';
import BottomRight from './bottomRight';

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

  const headerHeight = height * 0.1;//10%
  const drawWidth = width;
  const drawHeight = height - headerHeight;//גודל הלוח פחות הכותרת

  return (
    <>
      <div
        style={{
          width: "100%",
          height: `${headerHeight}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 1rem",
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
          {/* רבע עליון שמאל */}
          <TopLeft
            x={0}
            y={0}
            width={drawWidth / 2}
            height={drawHeight / 2}
            color="#34495E"
          />
          <Text
            x={drawWidth / 4} // ממקם את הטקסט באזור הרבע
            y={drawHeight / 4}
            text="Standart"
            fontSize={24}
            fontFamily="Arial"
            fill="#FFFFFF" // הצבע של הטקסט
            opacity={0.5} // שקיפות של הטקסט
          />

          {/* רבע עליון ימין */}
          <TopRight
            x={drawWidth / 2}
            y={0}
            width={drawWidth / 2}
            height={drawHeight / 2}
            color="#7F8C8D"
          />
          <Text
            x={drawWidth * 0.75} // ממקם את הטקסט באזור הרבע
            y={drawHeight / 4}
            text="Diley"
            fontSize={24}
            fontFamily="Arial"
            fill="#FFFFFF" // הצבע של הטקסט
            opacity={0.5} // שקיפות של הטקסט
          />

          {/* רבע תחתון שמאל */}
          <BottomLeft
            x={0}
            y={drawHeight / 2}
            width={drawWidth / 2}
            height={drawHeight / 2}
            color="#95A5A6"
          />
          <Text
            x={drawWidth / 4} // ממקם את הטקסט באזור הרבע
            y={drawHeight * 0.75}
            text="Mirror effect"
            fontSize={24}
            fontFamily="Arial"
            fill="#FFFFFF" // הצבע של הטקסט
            opacity={0.5} // שקיפות של הטקסט
          />

          {/* רבע תחתון ימין */}
          <BottomRight
            x={drawWidth / 2}
            y={drawHeight / 2}
            width={drawWidth / 2}
            height={drawHeight / 2}
            color="#BDC3C7"
          />
          <Text
            x={drawWidth * 0.75} // ממקם את הטקסט באזור הרבע
            y={drawHeight * 0.75}
            text="Fade effect"
            fontSize={24}
            fontFamily="Arial"
            fill="#FFFFFF" // הצבע של הטקסט
            opacity={0.5} // שקיפות של הטקסט
          />
        </Layer>
      </Stage>
    </>
  );
};

export default Canvas;