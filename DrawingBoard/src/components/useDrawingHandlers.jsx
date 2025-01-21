
import { useState, useEffect } from "react";
const useDrawingHandlers = ({ beforeAddPoint, afterAddPoint, type }) => {
    const [lines, setLines] = useState([]); // שמירת הקווים
    const [isDrawing, setIsDrawing] = useState(false);
    const [stageSize, setStageSize] = useState({
        width: window.innerWidth / 4, // 25% מהרוחב של המסך
        height: window.innerHeight / 4, // 25% מהגובה של המסך
    });

    useEffect(() => {
        const disableScroll = () => {
            document.body.style.overflow = 'hidden';
        };

        const enableScroll = () => {
            document.body.style.overflow = '';
        };

        disableScroll(); // מניעת גלילה בהתחלה

        return () => enableScroll(); // החזרת הגלילה כאשר הקומפוננטה מתנקה
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const newSize = { width: window.innerWidth / 4, height: window.innerHeight / 4 }; // תמיד 25% מהמסך
            updateLinesOnResize(newSize);
            setStageSize(newSize);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [lines, stageSize]);

    const updateLinesOnResize = (newSize) => {
        const scaleX = newSize.width / stageSize.width;
        const scaleY = newSize.height / stageSize.height;

        const updatedLines = lines.map((line) => {
            const adjustedPoints = line.points.map((point, index) =>
                index % 2 === 0 ? point * scaleX : point * scaleY
            );
            return { ...line, points: adjustedPoints };
        });

        setLines(updatedLines);
    };

    const handleMouseDown = (event) => {
        setIsDrawing(true);
        const stage = event.target.getStage();
        const pointerPosition = stage.getPointerPosition();

        let newPoint = [
            (pointerPosition.x / window.innerWidth) * stageSize.width,
            (pointerPosition.y / window.innerHeight) * stageSize.height,
        ];
        const lineId = Date.now();
        setLines([...lines, { id: lineId, points: newPoint }]);
    };

    const handleTouchStart = (event) => {
        setIsDrawing(true);
        const stage = event.target.getStage();
        const pointerPosition = stage.getPointerPosition();

        let newPoint = [
            (pointerPosition.x / window.innerWidth) * stageSize.width,
            (pointerPosition.y / window.innerHeight) * stageSize.height,
        ];
        const lineId = Date.now();
        setLines([...lines, { id: lineId, points: newPoint }]);

    }

    const handleMouseMove = (event) => {
        if (!isDrawing) return;
        const stage = event.target.getStage();
        const pointerPosition = stage.getPointerPosition();

        let newPoint = [
            (pointerPosition.x / window.innerWidth) * stageSize.width,
            (pointerPosition.y / window.innerHeight) * stageSize.height,
        ];

        // אם יש צורך במראה (Mirror Effect)
        if (type === 'mirror') {
            console.log("type", type);

            // מראה בציר ה־X (הפוך את ה-X)
            const mirroredPoint = [
                stageSize.width - newPoint[0], // היפוך ציר ה-X
                newPoint[1] // שמור את ה־Y
            ];

            // עדכון הקווים
            setLines((prevLines) => {
                const lastLine = { ...prevLines[prevLines.length - 1] };
                lastLine.points = [...lastLine.points, ...newPoint, ...mirroredPoint];
                return [...prevLines.slice(0, -1), lastLine];
            });
        }

        // במקרה אחר: דיליי או ברירת מחדל
        if (type === "diley") {
            setTimeout(() => {
                updateLines(newPoint);
            }, 2000); // דיליי של 200ms
        } else {
            updateLines(newPoint); // ברירת מחדל
        }
    };

    const handleTouchMove = (event) => {
        if (!isDrawing) return;
        const stage = event.target.getStage();
        const pointerPosition = stage.getPointerPosition();

        let newPoint = [
            (pointerPosition.x / window.innerWidth) * stageSize.width,
            (pointerPosition.y / window.innerHeight) * stageSize.height,
        ];
        if (type === "diley") {
            setTimeout(() => {
                updateLines(newPoint);
            }, 200); // דיליי של 200ms
        } else {
            updateLines(newPoint); // ברירת מחדל
        }
    };


    const handleMouseUp = () => {
        setIsDrawing(false);
        const lastLineId = lines[lines.length - 1]?.id;
        if (type === "fade" && lastLineId) {
            setTimeout(() => fadeOut(lastLineId), 0);
        }
    };

    const handleTouchEnd = () => {
        setIsDrawing(false);
        const lastLineId = lines[lines.length - 1]?.id;
        if (type === "fade" && lastLineId) {
            setTimeout(() => fadeOut(lastLineId), 0);
        }
    };

    const updateLines = (newPoint) => {
        setLines((prevLines) => {
            if (prevLines.length === 0) return prevLines;

            const lastLine = prevLines[prevLines.length - 1];
            const points = Array.isArray(lastLine.points) ? lastLine.points : [];

            const updatedLastLine = {
                ...lastLine,
                points: [...points, ...newPoint],
                opacity: points.length > 0 ? 1 : undefined,
            };

            return [...prevLines.slice(0, -1), updatedLastLine];
        });
    };

    const fadeOut = (lineId) => {
        const fadeStep = 0.003;
        const intervalTime = 10;

        setTimeout(() => {
            const interval = setInterval(() => {
                setLines((prevLines) => {
                    const updatedLines = [...prevLines];
                    const lineIndex = updatedLines.findIndex((l) => l.id === lineId);

                    if (lineIndex === -1) {
                        clearInterval(interval);
                        return prevLines;
                    }

                    const line = updatedLines[lineIndex];
                    if (Math.round(line.opacity * 1000) / 1000 <= 0) {
                        updatedLines.splice(lineIndex, 1);
                    } else {
                        updatedLines[lineIndex] = {
                            ...line,
                            opacity: Math.max(0, line.opacity - fadeStep),
                        };
                    }

                    return updatedLines;
                });
            }, intervalTime);
        }, 0);
    };

    return {
        lines: lines.map((line) => ({
            ...line,
            points: line.points.map((point, index) =>
                index % 2 === 0
                    ? (point / stageSize.width) * window.innerWidth
                    : (point / stageSize.height) * window.innerHeight
            ),
        })),
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        stageSize,
    };
};

export default useDrawingHandlers;



















