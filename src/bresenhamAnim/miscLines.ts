import { AnimFunction, AnimUtil, createKeyframes } from "@trawby/trawby";
import LineBundle, { createHorizontalLine, createLine, createVerticalLine, Line } from "../objects/lineBundle.ts";
import { setExplainText } from "../explainText.ts";

const LINE_TEXT: string = "We can draw vertical or horizontal lines easily one pixel at a time iterating over the axis";
const LINE_TEXT_2: string = "However, lines on an angle are a bit trickier";

export const drawLinesAnimFunction: AnimFunction<LineBundle[]> = async function(animUtil: AnimUtil, lineBundle: LineBundle) {
    setExplainText(LINE_TEXT);
    
    animUtil.setZoomPoint(4, 0, 0);
    const firstLine = createVerticalLine(10, 10, 10);
    const secondLine = createHorizontalLine(10, 10, 10);
    lineBundle.addLine(firstLine);
    await animUtil.interp(createKeyframes(10, 50), 2000, (yValue) => {
        firstLine.y2 = yValue;
    });
    
    lineBundle.addLine(secondLine);
    await animUtil.interp(createKeyframes(10, 50), 2000, (xValue) => {
        secondLine.x2 = xValue;
    });

    setExplainText(LINE_TEXT_2);

    lineBundle.removeLine(firstLine);
    lineBundle.removeLine(secondLine);

    await animUtil.waitTime(500);

    const numDiagonalLines = 5;

    const lineInfos: Array<{line: Line, angle: number}> = [];
    const firstPoint = { x: 10, y: 10 };
    for (let i = 0; i <= numDiagonalLines; i++ ) {
        const angle = (i / numDiagonalLines - 1) * Math.PI / 2 + Math.PI / 2;

        const [secondX, secondY] = getPointFromAngle(angle, 0);

        const line = createLine(firstPoint.x, firstPoint.y, secondX, secondY);
        lineBundle.addLine(line);

        lineInfos.push({
            line,
            angle,
        });
    }

    await animUtil.interp(createKeyframes(0, 50), 4000, (distance) => {
        for(const lineInfo of lineInfos) {
            const [secondX, secondY] = getPointFromAngle(lineInfo.angle, distance);
            lineInfo.line.x2 = secondX + firstPoint.x;
            lineInfo.line.y2 = secondY + firstPoint.y;
        }
    });
}

function getPointFromAngle(angle: number, distance: number): [number, number] {
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    return [x, y];
}