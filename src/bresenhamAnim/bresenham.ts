import { PixelGrid } from "@trawby/trawby";
import Color from "../../../trawby/lib/util/color.ts";

interface Point {
    x: number,
    y: number,
}

type onChangeFunction = (pointAdded: Point, error: number) => Promise<void>;

/**
 * Bresenham animation implemented for the pixelgrid.
 * 
 * Useful links:\
 * [wikipedia article](https://en.wikipedia.org/wiki/Bresenham's_line_algorithm)\
 * [More detailed pdf](https://www.ercankoclar.com/wp-content/uploads/2016/12/Bresenhams-Algorithm.pdf)
 * 
 * @param pixelGrid 
 * @param point1 
 * @param point2 
 * @param onChangeFunction 
 */
export async function bresenhamAnim(pixelGrid: PixelGrid, point1: Point, point2: Point, onChangeFunction: onChangeFunction): Promise<void> {
    const deltaXAbs = Math.abs(point2.x - point1.x);
    const deltaYAbs = Math.abs(point2.y - point1.y);

    const mainAxis = deltaXAbs >= deltaYAbs ? "x" : "y";
    const subAxis = mainAxis === "x" ? "y" : "x";

    const deltaMainRaw = point2[mainAxis] - point1[mainAxis];
    const deltaSubRaw = point2[subAxis] - point1[subAxis];
    const deltaMain = Math.abs(deltaMainRaw);
    const deltaSub = Math.abs(deltaSubRaw);
    const mainSign = deltaMainRaw > 0 ? 1 : -1;
    const subSign = deltaSubRaw > 0 ? 1 : -1;
    
    let currentMain = point1[mainAxis];
    let currentSub = point1[subAxis];
    const deltaAmount = deltaSub / deltaMain;
    let error = deltaAmount - 1;

    while ((mainSign === 1 && currentMain <= point2[mainAxis]) || (mainSign === -1 && currentMain >= point2[mainAxis])) {
        const xValue = mainAxis === "x" ? currentMain : currentSub;
        const yValue = mainAxis === "y" ? currentMain : currentSub;
        pixelGrid.setPixel(xValue, yValue, Color.BLACK);

        if (error >= 0) {
            currentSub += subSign;
            error -= 1;
        }

        error += deltaAmount;
        currentMain += mainSign;

        await onChangeFunction({ x: xValue, y: yValue }, error);
    }

}

