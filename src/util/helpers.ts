import { AnimMode, AnimUtil } from "@trawby/trawby";
import { CANVAS_HEIGHT, CANVAS_WIDTH, currentAnimMode } from "../mod.ts";
import PixelCoords, { PixelCoord } from "../objects/pixelCoords.ts";
import { Point } from "./point.ts";
import { setExplainText } from "../explainText.ts";
import { getRandomPointInSquare } from "../bresenhamAnim/bresenham.ts";
import { waitForPointOnCanvas } from "../canvasInput.ts";

const INTERACTIVE_CUSTOM_LINE_TEXT: string = "Click on the canvas to pick two points to draw a line";
const AUTOMATIC_CUSTOM_LINE_TEXT: string = "Picking two random points and drawing a line between them";

const getRandomPoint = function(): Point {
    const OFFSET: number = 50;
    return getRandomPointInSquare(OFFSET, OFFSET, CANVAS_WIDTH - OFFSET, CANVAS_HEIGHT - OFFSET);
}

export async function getTwoPoints(animUtil: AnimUtil, pixelCoords: PixelCoords): Promise<[Point, Point]> {
    let point1: PixelCoord | null = null;
    let point2: PixelCoord | null = null;
    switch (currentAnimMode) {
        case AnimMode.Automatic: {
            setExplainText(AUTOMATIC_CUSTOM_LINE_TEXT);
            await animUtil.waitTime(1000);
            point1 = getRandomPoint();
            point2 = getRandomPoint();
            if (point1.y < point2.y) {
                point2.below = true;
            } else {
                point1.below = true;
            }
            pixelCoords.addPixelCoord(point1);
            await animUtil.waitTime(1000);
            
            pixelCoords.addPixelCoord(point2);
            await animUtil.waitTime(1000);
            break;
        }
        case AnimMode.Interactive: {
            setExplainText(INTERACTIVE_CUSTOM_LINE_TEXT);
            point1 = await waitForPointOnCanvas();
            pixelCoords.addPixelCoord(point1);
            point2 = await waitForPointOnCanvas();

            if (point1.y < point2.y) {
                point2.below = true;
            } else {
                point1.below = true;
            }
            pixelCoords.addPixelCoord(point2);

            break;
        }
    }

    return [point1, point2];
}