import { AnimObject, Color, PixelGrid } from "@trawby/trawby";

export type PixelCoord = {
    x: number,
    y: number,
    below?: boolean
};

export default class PixelCoords implements AnimObject {
    pixelGrid: PixelGrid;

    pixelCoords: Set<PixelCoord>;
    fontSize: number;

    public constructor(pixelGrid: PixelGrid) {
        this.pixelGrid = pixelGrid;
        this.pixelCoords = new Set();
        this.fontSize = 4;
    }

    addPixelCoord(pixelCoord: PixelCoord) {
        this.pixelGrid.setPixel(pixelCoord.x, pixelCoord.y, Color.BLACK);
        this.pixelCoords.add(pixelCoord);
    }

    removePixelCoord(pixelCoord: PixelCoord) {
        this.pixelCoords.delete(pixelCoord);
    }
    
    draw(ctx: CanvasRenderingContext2D): void {
        for (const pixelCoord of this.pixelCoords) {
            const coordText = `(${pixelCoord.x}, ${pixelCoord.y})`;
            ctx.font = `${this.fontSize}px Verdana`;
            const measuredText = ctx.measureText(coordText);

            const y = pixelCoord.y + (pixelCoord.below ? this.fontSize + 1 : -1);

            ctx.fillText(coordText, pixelCoord.x - measuredText.width / 2, y);
        }
    }


}