import { AnimUtil, Color, PixelGrid } from "@trawby/trawby";
import { setExplainText } from "../explainText.ts";
import { drawAntialiasLine } from "./antialiasedLine.ts";
import { getTwoPoints } from "../util/helpers.ts";
import PixelCoords, { PixelCoord } from "../objects/pixelCoords.ts";
import { bresenhamAnim } from "../bresenhamAnim/bresenham.ts";
import { addPoints } from "../util/point.ts";

const INITIAL_EXPLAIN_TEXT: string = `What if we wanted to draw lines but use intermediate colours to smooth it out.
So for example we could use grey on near pixels to make it look smoother. This is called antialiasing`;

export const initialAnim = async function(animUtil: AnimUtil, pixelGrid: PixelGrid) {
    setExplainText(INITIAL_EXPLAIN_TEXT);
    animUtil.setZoomPoint(6, 0, 0);
    pixelGrid.clearAll(Color.WHITE);

    const point1 = { x: 10, y: 10 };
    const point2 = { x: 60, y: 30, below: true };

    await drawAntialiasLine(point1, point2, pixelGrid, async (_point) => {
        await animUtil.waitTime(10);
    });
}

const COMPARISON_EXPLAIN_TEXT: string = "If you look closely, the antialiased line is slightly smoother than the non antialiased one";

export const comparisonBresenhamAntialiasLines = async function(animUtil: AnimUtil, pixelGrid: PixelGrid, pixelCoords: PixelCoords) {
    animUtil.setZoomPoint(1, 0, 0);
    pixelGrid.clearAll(Color.WHITE);
    pixelCoords.fontSize = 12;
    setExplainText(COMPARISON_EXPLAIN_TEXT);

    const firstPoint = { x: 50, y: 50 };
    const secondPoint = { x: 350, y: 200, below: true };
    pixelCoords.addPixelCoords(firstPoint, secondPoint);

    let pixelCount = 0;
    await bresenhamAnim(pixelGrid, firstPoint, secondPoint, async () => {
        if (pixelCount % 4 === 0) {
            await animUtil.waitTime(10);
        }
        pixelCount += 1;
    });

    const offsetPoint = { x: 0, y: 50 };

    const firstPoint2 = addPoints(firstPoint, offsetPoint);
    const secondPoint2: PixelCoord = addPoints(secondPoint, offsetPoint);
    secondPoint2.below = true;

    pixelCoords.addPixelCoords(firstPoint2, secondPoint2);

    pixelCount = 0;
    await drawAntialiasLine(firstPoint2, secondPoint2, pixelGrid, async () => {
        if (pixelCount % 4 === 0) {
            await animUtil.waitTime(10);
        }
        pixelCount += 1;
    });
}

export const customAntialiasLine = async function(animUtil: AnimUtil, pixelGrid: PixelGrid, pixelCoords: PixelCoords) {
    animUtil.setZoomPoint(1, 0, 0);
    pixelGrid.clearAll(Color.WHITE);
    pixelCoords.fontSize = 12;

    const [point1, point2] = await getTwoPoints(animUtil, pixelCoords);

    let pixelCount = 0;
    await drawAntialiasLine(point1, point2, pixelGrid, async (_point) => {
        if (pixelCount % 3 == 0) {
            await animUtil.waitTime(10);
        }
        pixelCount += 1;
    });
}