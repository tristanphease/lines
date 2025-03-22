export interface Point {
    x: number,
    y: number,
}

export function normalisePoint(point: Point): Point {
    const totalLength = Math.hypot(point.x, point.y);
    return {
        x: point.x / totalLength,
        y: point.y / totalLength,
    };
}

export function subtractPoints(point1: Point, point2: Point): Point {
    return {
        x: point1.x - point2.x,
        y: point1.y - point2.y,
    };
}

export function addPoints(point1: Point, point2: Point): Point {
    return {
        x: point1.x + point2.x,
        y: point1.y + point2.y,
    };
}

export function multiplyPoint(point: Point, amount: number): Point {
    return {
        x: point.x * amount,
        y: point.y * amount,
    };
}

export function roundPointInteger(point: Point): Point {
    return {
        x: Math.round(point.x),
        y: Math.round(point.y),
    };
}

export function orthogonalPoint(point: Point): Point {
    return {
        x: -point.y,
        y: point.x
    };
}

export function debugPointString(point: Point): string {
    return `{x: ${point.x}, y: ${point.y}}`;
}