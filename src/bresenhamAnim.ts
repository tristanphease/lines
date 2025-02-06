import Color from "./color.ts";
import { States } from "./mod.ts";
import PixelGrid from "./pixelGrid.ts";
import { AnimUtil } from "@trawby/canvas-demo";

export const createBresenhamAnim = async function (pixelGrid: PixelGrid, animUtil: AnimUtil<States>): Promise<void> {
    
    for (let y=0;y<pixelGrid.height;y++) {
        for (let x=0;x<pixelGrid.width;x++) {
            pixelGrid.setPixel(x, y, new Color("#ff0000"));
            await animUtil.waitTime(1);
        }
    }
}
