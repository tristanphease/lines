import { AnimObject } from "@trawby/canvas-demo";
import Color from "./color.ts";



const DEFAULT_COLOUR: Color = new Color("#000000");

class PixelGrid implements AnimObject {

    private values: Array<Color>;
    private _width: number;
    private _height: number;
    private defaultColor: Color;

    constructor() {
        this.values = [];
        this._width = 500;
        this._height = 300;
        this.defaultColor = DEFAULT_COLOUR;
        this.populateValues();
    }

    private populateValues() {
        this.values = [];
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.values.push(this.defaultColor);
            }
        }
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

    public setPixel(x: number, y: number, color: Color) {
        if (y >= this.height || y < 0) {
            throw new Error(`Invalid y: ${y} when drawing pixel`);
        }
        if (x >= this.width || x < 0) {
            throw new Error(`Invalid x: ${x} when drawing pixel`);
        }
        const index = y * this.width + x;
        this.values[index] = color;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.rect(0, 0, this.width, this.height);
        ctx.fillStyle = this.defaultColor.getColorString();
        ctx.fill();

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const index = y * this.width + x;

                if (this.values[index] !== this.defaultColor) {
                    ctx.beginPath();
                    ctx.rect(x, y, 1, 1);
                    ctx.fillStyle = this.values[index].getColorString();
                    ctx.fill();
                }
            }
        } 
    }
}


export default PixelGrid;