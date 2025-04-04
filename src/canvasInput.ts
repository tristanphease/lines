import { CANVAS_ID } from "./mod.ts";
import { Point } from "./util/point.ts";

export function waitForPointOnCanvas(): Promise<Point> {
    const canvasElement = document.getElementById(CANVAS_ID)!;

    return new Promise((resolve, _reject) => {
        const callbackFunction = (e: MouseEvent) => {
            canvasElement.removeEventListener("click", callbackFunction);
            resolve({
                x: e.offsetX,
                y: e.offsetY,
            });
        };
        canvasElement.addEventListener("click", callbackFunction);
    });
    
}