import { Color, PixelGrid } from "@trawby/trawby";
import { Point, subtractPoints } from "../util/point.ts";

function constructGreyColor(lightness: number): Color {
    const number = Math.floor((1.0 - lightness) * 255);
    return new Color(number, number, number);
}

export type CallbackFunction = (point: Point) => Promise<void>;

/**
 * Adapted from https://en.wikipedia.org/wiki/Xiaolin_Wu%27s_line_algorithm#Algorithm
 */
export const drawAntialiasLine = async function(point1: Point, point2: Point, pixelGrid: PixelGrid, callback: CallbackFunction) {
    const deltaPoint = subtractPoints(point2, point1);

    // the main axis is the one that has further to move. e.g. if dx > dy then x is the main axis
    const mainAxis: keyof Point = Math.abs(deltaPoint.y) > Math.abs(deltaPoint.x) ? "y" : "x";
    const subAxis = mainAxis === "x" ? "y" : "x";

    const drawPixel = async function(pointMain: number, pointSub: number, lightness: number) {
        const pointX = mainAxis === "x" ? pointMain : pointSub;
        const pointY = mainAxis === "y" ? pointMain : pointSub;
        pixelGrid.setPixel(pointX, pointY, constructGreyColor(lightness));
        await callback({ x: pointX, y: pointY });
    }

    // sign is whether we're moving upwards or downwards
    const mainSign = deltaPoint[mainAxis] > 0 ? 1 : -1;
    const subSign = deltaPoint[subAxis] > 0 ? 1 : -1;

    const gradient: number = subSign * Math.abs(deltaPoint[mainAxis] === 0 ? 1.0 : deltaPoint[subAxis] / deltaPoint[mainAxis]);

    // draw first endpoint
    let endMain = Math.round(point1[mainAxis]);
    let endSub = point1[subAxis] + gradient * (endMain - point1[mainAxis]);
    let gapMain = reverseFractionalPart(point1[mainAxis] + 0.5);
    const pixelMain1 = endMain;
    const pixelSub1 = Math.floor(endSub);

    await drawPixel(pixelMain1, pixelSub1, reverseFractionalPart(endSub) * gapMain);
    await drawPixel(pixelMain1, pixelSub1 + subSign, fractionalPart(endSub) * gapMain);
    let intersectionSub = endSub + gradient;

    // this will be used in the main loop
    endMain = Math.round(point2[mainAxis]);
    endSub = point2[subAxis] + gradient * (endMain - point2[mainAxis]);
    gapMain = fractionalPart(point2[mainAxis] + 0.5);

    const pixelMain2 = endMain; 
    const pixelSub2 = Math.floor(endSub);

    // draw main loop
    for (let mainValue = pixelMain1 + 1; (mainSign === 1 && mainValue <= pixelMain2 - 1) || (mainSign === -1 && mainValue >= pixelMain2 + 1); mainValue += mainSign) {
        await drawPixel(mainValue, Math.floor(intersectionSub), reverseFractionalPart(intersectionSub));
        await drawPixel(mainValue, Math.floor(intersectionSub) + 1, fractionalPart(intersectionSub));
        intersectionSub += gradient;
    }

    // draw final endpoint
    
    await drawPixel(pixelMain2, pixelSub2, reverseFractionalPart(endSub) * gapMain);
    await drawPixel(pixelMain2, pixelSub2 + 1, fractionalPart(endSub) * gapMain);
}

function fractionalPart(x: number) {
    return x - Math.floor(x);
}

function reverseFractionalPart(x: number) {
    return 1 - fractionalPart(x);
}
