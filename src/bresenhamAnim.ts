import { States } from "./mod.ts";
import { PixelGrid } from "@trawby/canvas-demo";
import { AnimUtil } from "@trawby/canvas-demo";
import { colorFromHex } from "@trawby/canvas-demo";

export const createBresenhamAnim = async function (pixelGrid: PixelGrid, animUtil: AnimUtil<States>): Promise<void> {
    
    /* for (let y=0;y<pixelGrid.height;y++) {
        for (let x=0;x<pixelGrid.width;x++) {
            pixelGrid.setPixel(x, y, colorFromHex("#00ff00"));
            
        }
        await animUtil.waitTime(1);
    } */

    let distance = 0;

    const maxDistance = Math.max(pixelGrid.width, pixelGrid.height);

    while (distance < maxDistance) {
        
        for (let val = 0; val <= distance; val++) {
            const x = Math.min(distance - val, pixelGrid.width - 1);
            const y = Math.min(val, pixelGrid.height - 1);

            pixelGrid.setPixel(x, y, colorFromHex("#00ffff")!);
        }
        
        distance += 1;
        await animUtil.waitTime(1);
    }
}
