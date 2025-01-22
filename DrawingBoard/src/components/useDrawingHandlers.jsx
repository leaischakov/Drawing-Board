
import { useState, useEffect } from "react";

const useDrawingHandlers = ({ type }) => {
    const [lines, setLines] = useState([]); // שמירת הקווים
    const [isDrawing, setIsDrawing] = useState(false);//אם המשתמש התחיל לצייר 
    const [stageSize, setStageSize] = useState({//גודל מסך
        width: window.innerWidth / 4, // 25% מהרוחב של המסך
        height: window.innerHeight / 4, // 25% מהגובה של המסך
    });
    //למניעת גלילה
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
    //טיפול בשינוי גודל המסך
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
    //טיפול בשינוי גודל המסך
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
    //בעת לחיצה על העכבר
    const handleMouseDown = (event) => {
        setIsDrawing(true);//משתנה המסמל על מצב הציור  = TRUE
        const stage = event.target.getStage();
        const pointerPosition = stage.getPointerPosition();//מיקום הנקודה

        let newPoint = [
            (pointerPosition.x / window.innerWidth) * stageSize.width,
            (pointerPosition.y / window.innerHeight) * stageSize.height,
        ];
        const lineId = Date.now();
        setLines([...lines, { id: lineId, points: newPoint }]);
    };
    //בעת מגע
    const handleTouchStart = (event) => {
        setIsDrawing(true);//משתנה המסמל על מצב הציור  = TRUE
        const stage = event.target.getStage();
        const pointerPosition = stage.getPointerPosition();//מיקום הנקודה

        let newPoint = [
            (pointerPosition.x / window.innerWidth) * stageSize.width,
            (pointerPosition.y / window.innerHeight) * stageSize.height,
        ];
        const lineId = Date.now();
        setLines([...lines, { id: lineId, points: newPoint }]);

    }
    //בעת הזזת העכבר
    const handleMouseMove = (event) => {
        if (!isDrawing) return;// אם המשנה הוא false אז RETURN
        const stage = event.target.getStage();
        const pointerPosition = stage.getPointerPosition();

        let newPoint = [
            (pointerPosition.x / window.innerWidth) * stageSize.width,
            (pointerPosition.y / window.innerHeight) * stageSize.height,
        ];
        // במקרה אחר: דיליי או ברירת מחדל
        if (type === "diley") {
            setTimeout(() => {
                updateLines(newPoint);
            }, 200); // דיליי של 200ms
        } else {
            updateLines(newPoint); // ברירת מחדל
        }
    };
    //בעת הזזת מגע
    const handleTouchMove = (event) => {
        if (!isDrawing) return;// אם המשנה הוא false אז RETURN
        const stage = event.target.getStage();
        const pointerPosition = stage.getPointerPosition();

        let newPoint = [
            (pointerPosition.x / window.innerWidth) * stageSize.width,
            (pointerPosition.y / window.innerHeight) * stageSize.height,
        ];
        // במקרה אחר: דיליי או ברירת מחדל
        if (type === "diley") {
            setTimeout(() => {
                updateLines(newPoint);
            }, 200); // דיליי של 200ms
        } else {
            updateLines(newPoint); // ברירת מחדל
        }
    };
    //בעת שחרור העכבר
    const handleMouseUp = () => {
        setIsDrawing(false);// החזרת המשתנה ל FALSE
        const lastLineId = lines[lines.length - 1]?.id;
        //הפעלת הדהייה לאחר שחרור העכבר
        if (type === "fade" && lastLineId) {
            setTimeout(() => fadeOut(lastLineId), 0);
        }
    };
    //בעת שחרור המגע
    const handleTouchEnd = () => {
        setIsDrawing(false);// החזרת המשתנה ל FALSE
        const lastLineId = lines[lines.length - 1]?.id;
        if (type === "fade" && lastLineId) {
            setTimeout(() => fadeOut(lastLineId), 0);
        }
    };

    // פונקציה שמעדכנת את הקווים
    const updateLines = (newPoint) => {
        setLines((prevLines) => { // מעדכן את המצב של הקווים הקיימים
            if (prevLines.length === 0) return prevLines; // אם אין קווים, מחזיר את הרשימה הנוכחית

            const lastLine = prevLines[prevLines.length - 1]; // מוצא את הקו האחרון שנוסף
            const points = Array.isArray(lastLine.points) ? lastLine.points : []; // מוודא שהנקודות בקו הן מערך
            const updatedLastLine = { // מעדכן את הקו האחרון עם הנקודות החדשות
                ...lastLine, // שומר על שאר המאפיינים של הקו
                points: [...points, ...newPoint], // מוסיף את הנקודות החדשות למערך הנקודות הקיים
                opacity: points.length > 0 ? 1 : undefined, // מגדיר שקיפות לקו אם כבר יש בו נקודות//FADE
            };

            return [...prevLines.slice(0, -1), updatedLastLine]; // מחזיר את כל הקווים, כולל הקו האחרון המעודכן
        });
    };

    // פונקציה שמבצעת דהייה 
    const fadeOut = (lineId) => {
        const fadeStep = 0.003; // הגדרת כמות הדהייה בכל שלב
        const intervalTime = 10; // הזמן בין שלב לשלב בדהייה 

        const interval = setInterval(() => { // קובע אינטרוול לדהייה הדרגתית
            setLines((prevLines) => { // מעדכן את הקווים במצב
                const updatedLines = [...prevLines]; // יוצר עותק של מערך הקווים
                const lineIndex = updatedLines.findIndex((l) => l.id === lineId); // מוצא את הקו שרוצים לדהות לפי ה-ID

                if (lineIndex === -1) { // אם לא נמצא קו עם ה-ID הזה
                    clearInterval(interval); // מפסיק את האינטרוול
                    return prevLines; // מחזיר את המצב הנוכחי
                }

                const line = updatedLines[lineIndex]; // מוצא את הקו שרוצים לזהות
                if (Math.round(line.opacity * 1000) / 1000 <= 0) { // אם השקיפות של הקו הגיעה ל-0 או פחות
                    updatedLines.splice(lineIndex, 1); // מסיר את הקו ממערך הקווים
                } else {
                    updatedLines[lineIndex] = { // מעדכן את הקו עם רמת שקיפות חדשה
                        ...line, // שומר על שאר המאפיינים של הקו
                        opacity: Math.max(0, line.opacity - fadeStep), // מוריד את רמת השקיפות עד 0
                    };
                }

                return updatedLines; // מחזיר את מערך הקווים המעודכן
            });
        }, intervalTime); //10
    };

    return {
        lines: lines.map((line) => ({ // עובר על כל הקווים במערך lines.
            ...line, // משכפל את כל המאפיינים של הקו.
            points: line.points.map((point, index) => // עובר על כל הנקודות של הקו ומעדכן אותן.
                index % 2 === 0 // בודק אם האינדקס הוא זוגי (x) או אי-זוגי (y).
                    ? (point / stageSize.width) * window.innerWidth // מחשב מחדש את ערך ה-x לפי רוחב המסך החדש.
                    : (point / stageSize.height) * window.innerHeight // מחשב מחדש את ערך ה-y לפי גובה המסך החדש.
            ),
        })), // 
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