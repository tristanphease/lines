import { AnimObject } from "@trawby/trawby";

/** Bundle of lines  */
export default class LineBundle implements AnimObject {

    lines: Set<Line>;

    constructor() {
        this.lines = new Set();
    }

    addLine(line: Line) {
        this.lines.add(line);
    }

    removeLine(line: Line) {
        this.lines.delete(line);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        // black
        ctx.strokeStyle = "#000000";
        for (const line of this.lines) {
            ctx.beginPath();
            ctx.moveTo(line.x1, line.y1);
            ctx.lineTo(line.x2, line.y2);
            ctx.stroke();
        }
    }

}

export interface Line {
    x1: number,
    y1: number,
    x2: number,
    y2: number,
};

export function createLine(x1: number, y1: number, x2: number, y2: number) {
    return {
        x1, x2, y1, y2
    };
}

export function createVerticalLine(x: number, y1: number, y2: number): Line {
    return createLine(x, y1, x, y2);
}

export function createHorizontalLine(x1: number, x2: number, y: number): Line {
    return createLine(x1, y, x2, y);
}
