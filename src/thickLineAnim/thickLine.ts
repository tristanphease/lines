import { addPoints, multiplyPoint, normalisePoint, orthogonalPoint, Point, roundPointInteger, subtractPoints } from "../util/point.ts";

type CallbackFunction = (point: Point) => Promise<void>;

export async function thickBresenhamMove(point1: Point, point2: Point, thickness: number, callback: CallbackFunction) {
    // calculate points for thickness
    const diffPoint = subtractPoints(point2, point1);
    const amountMove = Math.round(thickness / 2);
    const startPoint1 = offsetOrthogonal(point1, diffPoint, -amountMove);
    const endPoint1 = offsetOrthogonal(point1, diffPoint, amountMove);

    const deltaXAbs = Math.abs(endPoint1.x - startPoint1.x);
    const deltaYAbs = Math.abs(endPoint1.y - startPoint1.y);

    const mainAxis = deltaXAbs >= deltaYAbs ? "x" : "y";
    const subAxis = mainAxis === "x" ? "y" : "x";

    const deltaMainRaw = endPoint1[mainAxis] - startPoint1[mainAxis];
    const deltaSubRaw = endPoint1[subAxis] - startPoint1[subAxis];
    const deltaMain = Math.abs(deltaMainRaw);
    const deltaSub = Math.abs(deltaSubRaw);
    const mainSign = deltaMainRaw > 0 ? 1 : -1;
    const subSign = deltaSubRaw > 0 ? 1 : -1;
    const mainPositive = deltaMainRaw > 0 ? true : false;
    
    let currentMain = startPoint1[mainAxis];
    let currentSub = startPoint1[subAxis];
    const deltaAmount = deltaSub / deltaMain;
    let perpendicularError = 0;
    let error = 0;

    const subMoveInfo = generateMoveInfo(point1, point2);

    while ((mainPositive && currentMain <= endPoint1[mainAxis]) || (!mainPositive && currentMain >= endPoint1[mainAxis])) {
        const [currentPoint, currentPoint2] = calculatePoints(mainAxis, currentMain, currentSub, point1, point2);
        // console.log(`*** OUTER: currentpoint: ${debugPointString(currentPoint)}, perror: ${perpendicularError}, error: ${error}`);
        await bresenhamMove(currentPoint, currentPoint2, perpendicularError, subMoveInfo, callback);
        if (error >= 0.5) {
            currentSub += subSign;
            error -= 1;
            if (perpendicularError >= 0.5) {
                const [currentPoint, currentPoint2] = calculatePoints(mainAxis, currentMain, currentSub, point1, point2);
                await bresenhamMove(currentPoint, currentPoint2, perpendicularError + subMoveInfo.deltaAmount - 1, subMoveInfo, callback);
                perpendicularError -= 1;
            }
            perpendicularError += subMoveInfo.deltaAmount;
            // console.log(`*** OUTER: diagonal`);
        }
        error += deltaAmount;
        currentMain += mainSign;
    }
}

function calculatePoints(mainAxis: "x" | "y", currentMain: number, currentSub: number, point1: Point, point2: Point): [Point, Point] {
    const currentPoint = getCurrentPoint(mainAxis, currentMain, currentSub);
    const currentPointDiff = subtractPoints(currentPoint, point1);
    const currentPoint2 = addPoints(point2, currentPointDiff);

    return [currentPoint, currentPoint2];
}

function getCurrentPoint(mainAxis: "x" | "y", currentMain: number, currentSub: number): Point {
    return {
        x: mainAxis === "x" ? currentMain : currentSub,
        y: mainAxis === "y" ? currentMain : currentSub,
    };
}

async function bresenhamMove(point1: Point, point2: Point, error: number, moveInfo: MoveInfo, callback: CallbackFunction): Promise<void> {
    
    let currentMain = point1[moveInfo.mainAxis];
    let currentSub = point1[moveInfo.subAxis];
    error = -error;

    while ((moveInfo.mainSign === 1 && currentMain <= point2[moveInfo.mainAxis]) || 
        (moveInfo.mainSign === -1 && currentMain >= point2[moveInfo.mainAxis])) {
        const currentPoint = getCurrentPoint(moveInfo.mainAxis, currentMain, currentSub);
        // console.log(`INNER: currentpoint: ${debugPointString(currentPoint)}, error: ${error}`);
        if (error >= 0.5) {
            currentSub += moveInfo.subSign;
            error -= 1;
        }
        error += moveInfo.deltaAmount;
        currentMain += moveInfo.mainSign;

        await callback(currentPoint);
    }
} 

function offsetOrthogonal(point: Point, diffPoint: Point, amount: number): Point {
    return roundPointInteger(addPoints(point, multiplyPoint(orthogonalPoint(normalisePoint(diffPoint)), amount)));
}

interface MoveInfo {
    mainAxis: keyof Point,
    subAxis: keyof Point,
    deltaMain: number,
    deltaSub: number,
    mainSign: 1 | -1,
    subSign: 1 | -1,
    deltaAmount: number,
}

function generateMoveInfo(point1: Point, point2: Point): MoveInfo {
    const deltaXAbs = Math.abs(point2.x - point1.x);
    const deltaYAbs = Math.abs(point2.y - point1.y);

    const mainAxis = deltaXAbs >= deltaYAbs ? "x" : "y";
    const subAxis = mainAxis === "x" ? "y" : "x";

    const deltaMainRaw = point2[mainAxis] - point1[mainAxis];
    const deltaSubRaw = point2[subAxis] - point1[subAxis];
    const deltaMain = Math.abs(deltaMainRaw);
    const deltaSub = Math.abs(deltaSubRaw);
    const mainSign = deltaMainRaw > 0 ? 1 : -1;
    const subSign = deltaSubRaw > 0 ? 1 : -1;
    
    const deltaAmount = deltaSub / deltaMain;

    return {
        mainAxis,
        subAxis,
        deltaMain,
        deltaSub,
        mainSign,
        subSign,
        deltaAmount,
    };
}
