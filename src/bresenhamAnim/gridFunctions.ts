import { AnimMode, AnimUtil, Color, PixelGrid } from "@trawby/trawby";
import { setExplainText } from "../explainText.ts";
import TextObject from "../objects/text.ts";
import PixelCoords from "../objects/pixelCoords.ts";
import { bresenhamAnim } from "./bresenham.ts";
import { Point } from "../util/point.ts";
import { getTwoPoints } from "../util/helpers.ts";
import { currentAnimMode } from "../mod.ts";

const INITIAL_EXPLAIN_TEXT: string = "Welcome to a simple animation explaining how to draw a line using a neat little animation library I created.";

/** Sets up the initial grid with some fun anims */
export const initialGrid = async function(animUtil: AnimUtil, pixelGrid: PixelGrid): Promise<void> {
    
    animUtil.setZoomPoint(2, 0, 0);

    setExplainText(INITIAL_EXPLAIN_TEXT);

    const SQUARE_SIZE: number = 10; 

    // fill in squares from top left to bottom right
    const x_end = pixelGrid.width + pixelGrid.height;
    for (let x = SQUARE_SIZE / 2; x < x_end; x += 2 * SQUARE_SIZE) {
        
        let x_val = x;
        for (let y = SQUARE_SIZE / 2; x_val >= 0; y += 2 * SQUARE_SIZE, x_val -= 2 * SQUARE_SIZE) {
            if (x_val < pixelGrid.width) {
                fillSquare(pixelGrid, x_val, y, SQUARE_SIZE, Color.WHITE);
            }
        }
        await animUtil.waitTime(10);
    }
    if (currentAnimMode === AnimMode.Automatic) {
        await animUtil.waitTime(1000);
    }
}

// Could move this onto the pixel grid but don't want to fill it up with every shape
function fillSquare(pixelGrid: PixelGrid, x: number, y: number, size: number, color: Color) {
    const max_x = Math.min(x + size, pixelGrid.width - 1);
    const max_y = Math.min(y + size, pixelGrid.height - 1);
    for (let x_val = x; x_val < max_x; x_val++) {
        for (let y_val = y; y_val < max_y; y_val++) {
            pixelGrid.setPixel(x_val, y_val, color);
        }
    }
}

const BRESENHAM_INIT_1: string = "The main concept behind bresenham is to keep track of how far off from the pixel the line is.<br />" +
    "Let's start by showing it from a pixel to another";

const BRESENHAM_INIT_2: string = "As we move across the axis which is the longer one (x in this case) one pixel at a time, we calculate the error on each movement which is Δy/Δx." + 
    "Once this passes a threshold we change y to move towards the desired point"; 

export const pixelStart = async function name(
    animUtil: AnimUtil, pixelGrid: PixelGrid, textObject: TextObject, pixelCoords: PixelCoords
): Promise<void> {
    pixelGrid.clearAll(Color.WHITE);
    animUtil.setZoomPoint(8, 0, 0);

    const COORD_1 = { x: 10, y: 20};
    const COORD_2 = { x: 50, y: 30, below: true};
    
    setExplainText(BRESENHAM_INIT_1);

    pixelCoords.addPixelCoords(COORD_1, COORD_2);

    await animUtil.waitTime(1000);

    setExplainText(BRESENHAM_INIT_2);
    
    await bresenhamAnim(pixelGrid, COORD_1, COORD_2, async (_pointAdded, errorAmount) => {
        textObject.setText(`Error:\n${errorAmount}`);
        textObject.setCoords(5, 5);
        await animUtil.waitTime(200);
    });

}

export const customLineAnim = async function(animUtil: AnimUtil, pixelGrid: PixelGrid, pixelCoords: PixelCoords) {
    animUtil.setZoomPoint(1, 0, 0);
    pixelGrid.clearAll(Color.WHITE);
    pixelCoords.fontSize = 12;
    const [point1, point2] = await getTwoPoints(animUtil, pixelCoords);

    await bresenhamAnim(pixelGrid, point1, point2, async (_pointAdded: Point, _error: number) => {
        await animUtil.waitTime(50);
    });
}
