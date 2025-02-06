import { AnimObject, AnimUtil, createKeyframes } from "@trawby/canvas-demo";
import Color from "./color.ts";
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
        ctx.fillStyle = this.fillColor.getColorString();
        ctx.fill();
    }
}

export async function moveBox(box: TestBox, animUtil: AnimUtil<States>): Promise<void> {
    const keyframes = createKeyframes(20, 90, 50);
    await animUtil.interp(keyframes, 5000, (value: number) => {
        box.x = value;
    });
}
