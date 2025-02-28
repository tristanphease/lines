import { AnimObject, AnimUtil, createKeyframes } from "@trawby/trawby";
import { Color } from "@trawby/trawby";
import { States } from "./mod.ts";

export default class TestBox implements AnimObject {
    public x: number;
    private y: number;
    private width: number;
    private height: number;
    private fillColor: Color;

    constructor(x: number, y: number, width: number, height: number, fillColor: Color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.fillColor = fillColor;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.fillColor.toHexString();
        ctx.fill();
    }
}

export const moveBox = async function(box: TestBox, animUtil: AnimUtil<States>): Promise<void> {
    /* const keyframes = createKeyframes(20, 90, 50);
    const promise1 = animUtil.interp(keyframes, 5000, (value: number) => {
        //box.x = value;
    }); */

    const zoomKeyframes = createKeyframes(1, 0.20);
    const promise2 = animUtil.interp(zoomKeyframes, 3000, (value: number) => {
        //animUtil.setZoomPoint(value, 10, 10);
    });
}
