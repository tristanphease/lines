import { AnimObject } from "@trawby/trawby";

export type TextOptions = {
    font: string;
};

export default class TextObject implements AnimObject {
    private textLines: Array<string>;
    private x: number;
    private y: number;
    private fontSize: number;
    private font: string;

    constructor() {
        this.textLines = [];
        this.x = 0;
        this.y = 0;
        this.fontSize = 3;
        this.font = "Verdana";
    }

    setText(text: string) {
        this.textLines = text.split("\n");
    }

    setCoords(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.font = `${this.fontSize}px ${this.font}`;
        for (let index = 0; index < this.textLines.length; index ++) {
            const yVal = this.y + index * this.fontSize;
            ctx.fillText(this.textLines[index], this.x, yVal);
        }
        
    }
}
