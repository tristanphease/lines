import { AnimFunction, AnimUtil, createKeyframes } from "@trawby/trawby";
import LineBundle, { createHorizontalLine, createLine, createVerticalLine } from "../objects/lineBundle.ts";
import { setExplainText } from "../explainText.ts";

const LINE_TEXT: string = "We can draw vertical or horizontal lines easily one pixel at a time";
const LINE_TEXT_2: string = "<br />but lines on an angle are more difficult";

export const drawLinesAnimFunction: AnimFunction<LineBundle[]> = async function(animUtil: AnimUtil, lineBundle: LineBundle) {
    setExplainText(LINE_TEXT);
    
    animUtil.setZoomPoint(4, 0, 0);
    const firstLine = createVerticalLine(50, 10, 50);
    const secondLine = createHorizontalLine(10, 50, 30);
    lineBundle.addLine(firstLine);
    await animUtil.waitTime(1000);
    lineBundle.addLine(secondLine);

    await animUtil.waitTime(500);

    setExplainText(LINE_TEXT + LINE_TEXT_2);

    lineBundle.removeLine(firstLine);
    lineBundle.removeLine(secondLine);

    await animUtil.waitTime(500);

    const thirdLine = createLine(10, 10, 50, 10);
    lineBundle.addLine(thirdLine);

    const angleKeyframes = createKeyframes(0, Math.PI / 2.0);
    await animUtil.interp(angleKeyframes, 2000, (angle) => {
        thirdLine.x2 = Math.cos(angle) * 40 + 10
        thirdLine.y2 = Math.sin(angle) * 40 + 10
    });

    animUtil.setZoomPoint(1, 0, 0);
}