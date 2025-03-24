import { AnimMode, AnimUtil, Color, colorFromHex, PixelGrid } from "@trawby/trawby";
import { setExplainText } from "../explainText.ts";
import PixelCoords from "../objects/pixelCoords.ts";
import { bresenhamAnim, bresenhamMove } from "../bresenhamAnim/bresenham.ts";
import { addPoints, multiplyPoint, normalisePoint, orthogonalPoint, Point, roundPointInteger, subtractPoints } from "../util/point.ts";
import { thickBresenhamMove } from "./thickLine.ts";
import { getTwoPoints } from "../util/helpers.ts";
import { currentAnimMode } from "../mod.ts";

/** Gets the perpendicular offset between the points by the amount */
function offset(point: Point, diffPoint: Point, amount: number): Point {
    return roundPointInteger(addPoints(point, multiplyPoint(orthogonalPoint(diffPoint), amount)));
}

const INITIAL_TEXT: string = `However, bresenham only draws a single pixel line. <br />
    What if we wanted to draw a thicker line?`;

const SECOND_INITIAL_TEXT: string = `Let's try by drawing two perpendicular lines`;

const THIRD_INITIAL_TEXT: string = `What if we use the red line but at each step instead of just drawing a pixel, we use the previous line 
    drawing method to draw a line parallel with the blue line, thus drawing a thicker line`;

const COMMON_THICKNESS: number = 10;
const COMMON_POINT_1 = { x: 10, y: 10 };
const COMMON_POINT_2 = { x: 50, y: 20, below: true };

export const initial = async function(animUtil: AnimUtil, pixelGrid: PixelGrid, pixelCoords: PixelCoords) {
    setExplainText(INITIAL_TEXT);

    pixelGrid.clearAll(Color.WHITE);
    animUtil.setZoomPoint(6, 0, 0);

    await animUtil.waitTime(2000);

    const thickness = COMMON_THICKNESS;
    const point1 = COMMON_POINT_1;
    const point2 = COMMON_POINT_2;

    pixelCoords.fontSize = 4;
    pixelCoords.addPixelCoords(point1, point2);

    const diffPoint = subtractPoints(point2, point1);
    const diffNormalisePoint = normalisePoint(diffPoint);
    const point1OrthogonalStart = offset(point1, diffNormalisePoint, -thickness/2);
    const point1OrthogonalEnd = offset(point1, diffNormalisePoint, thickness/2);
    
    const redColor = colorFromHex("#ff0000")!;
    const blueColor = colorFromHex("#0000ff")!;

    setExplainText(SECOND_INITIAL_TEXT);

    const firstLinePromise = bresenhamMove(point1OrthogonalStart, point1OrthogonalEnd, async (point) => {
        pixelGrid.setPixel(point.x, point.y, redColor);
        await animUtil.waitTime(1);
    });

    const secondLinePromise = await bresenhamMove(point1, point2, async (point) => {
        pixelGrid.setPixel(point.x, point.y, blueColor);
        await animUtil.waitTime(1);
    });

    await Promise.all([firstLinePromise, secondLinePromise]);

    setExplainText(THIRD_INITIAL_TEXT);

    if (currentAnimMode === AnimMode.Automatic) {
        await animUtil.waitTime(4000);
    }
}

const FIRST_TRY_TEXT: string = "Let's try to implement that.";

const CONCLUSION_FIRST_TRY_TEXT: string = `As you can see, this results in missing pixels because when we move diagonally, 
    the pixels move over one and end up missing some of them.`;

export const firstTry = async function(animUtil: AnimUtil, pixelGrid: PixelGrid, pixelCoords: PixelCoords) {
    setExplainText(FIRST_TRY_TEXT);

    pixelGrid.clearAll(Color.WHITE);
    animUtil.setZoomPoint(6, 0, 0);

    await animUtil.waitTime(1000);

    const thickness = COMMON_THICKNESS;
    const point1 = COMMON_POINT_1;
    const point2 = COMMON_POINT_2;

    pixelCoords.fontSize = 4;
    pixelCoords.addPixelCoords(point1, point2);

    const diffPoint = subtractPoints(point2, point1);
    const diffNormalisePoint = normalisePoint(diffPoint);
    const point1OrthogonalStart = offset(point1, diffNormalisePoint, -thickness/2);
    const point1OrthogonalEnd = offset(point1, diffNormalisePoint, thickness/2);

    let pixelCount = 0;
    await bresenhamMove(point1OrthogonalStart, point1OrthogonalEnd, async (point1Orthogonal) => {
        const point2Orthogonal = addPoints(point1Orthogonal, diffPoint);
        await bresenhamAnim(pixelGrid, point1Orthogonal, point2Orthogonal, async () => {
            if (pixelCount % 3 == 0) {
                await animUtil.waitTime(10);
            }
            pixelCount += 1;
        })
    });

    // alternative way of doing it
    /* for (let i = - thickness / 2; i < thickness / 2; i++) {
        
        const point1Adjusted = offset(point1, diffPoint, i);
        const point2Adjusted = offset(point2, diffPoint, i);
        await bresenhamAnim(pixelGrid, point1Adjusted, point2Adjusted, async () => {
            await animUtil.waitTime(10);
        });
    } */

    setExplainText(CONCLUSION_FIRST_TRY_TEXT);
    if (currentAnimMode === AnimMode.Automatic) {
        await animUtil.waitTime(5000);
    }
}

const SECOND_TEXT: string = `What we need to do is maintain the error in the first line and pass it through so that it 
    keeps track of the diagonal movements and doesn't miss the extra pixels`;

export const secondThickLine = async function(animUtil: AnimUtil, pixelGrid: PixelGrid, pixelCoords: PixelCoords) {
    setExplainText(SECOND_TEXT);

    pixelGrid.clearAll(Color.WHITE);
    animUtil.setZoomPoint(6, 0, 0);
    await animUtil.waitTime(500);

    const thickness = COMMON_THICKNESS;
    const point1 = COMMON_POINT_1;
    const point2 = COMMON_POINT_2;

    pixelCoords.fontSize = 4;
    pixelCoords.addPixelCoords(point1, point2);

    let pixelCount = 0;
    await thickBresenhamMove(point1, point2, thickness, async (point) => {
        pixelGrid.setPixel(point.x, point.y, Color.BLACK);
        if (pixelCount % 3 == 0) {
            await animUtil.waitTime(10);
        }
        pixelCount += 1;
    });
    
    if (currentAnimMode === AnimMode.Automatic) {
        await animUtil.waitTime(1000);
    }
}

export const customThickLineAnim = async function(animUtil: AnimUtil, pixelGrid: PixelGrid, pixelCoords: PixelCoords) {
    animUtil.setZoomPoint(1, 0, 0);
    pixelGrid.clearAll(Color.WHITE);
    pixelCoords.fontSize = 12;

    // animUtil.setZoomPoint(6, 500, 250);
    const [point1, point2] = await getTwoPoints(animUtil, pixelCoords);
    // const [point1, point2] = [{x: 500, y: 235}, {x: 453, y: 267}];

    let pixelCount = 0;
    await thickBresenhamMove(point1, point2, COMMON_THICKNESS, async (point) => {
        pixelGrid.setPixel(point.x, point.y, Color.BLACK);
        if (pixelCount % 5 == 0) {
            await animUtil.waitTime(10);
        }
        pixelCount += 1;
    });

    
}