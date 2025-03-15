import { createAnim, AnimObjectInfo, PixelGrid, AnimStateBuilder, createAnimForState, AnimBuilder } from "@trawby/trawby";
import { customLineAnim, initialGrid, pixelStart } from "./gridFunctions.ts";
import LineBundle from "../objects/lineBundle.ts";
import { drawLinesAnimFunction } from "./miscLines.ts";
import TextObject from "../objects/text.ts";
import PixelCoords from "../objects/pixelCoords.ts";

export const BresenhamStates = {
    /** Setup pixel grid, draw some lines */
    Initial: "Initial",
    /** Draw lines to show off */
    DrawLine: "Draw Line",
    /** Start bresenham anim with explanatory drawings */
    StartBresenham: "Start Bresenham",

    CustomLine: "Custom Line",
} as const;

export function constructBresenhamAnimationBuilder(pixelGrid: PixelGrid): AnimBuilder {
    return createAnim()
        .addAnimRunToState(
            BresenhamStates.Initial,
            constructInitialStateAnims(pixelGrid)
        )
        .addAnimRunToState(
            BresenhamStates.DrawLine,
            constructDrawLinesAnim()
        )
        .addAnimRunToState(
            BresenhamStates.StartBresenham,
            constructStartBresenhamAnim(pixelGrid)
        )
        .addAnimRunToState(
            BresenhamStates.CustomLine,
            constructCustomLineBresenhamAnim(pixelGrid)
        );
}

function constructInitialStateAnims(pixelGrid: PixelGrid): AnimStateBuilder {
    return createAnimForState()
        .addAnim(
            new AnimObjectInfo(pixelGrid)
                .withAnim(initialGrid)
        );
}

function constructDrawLinesAnim(): AnimStateBuilder {
    const drawLinesAnim = new AnimStateBuilder();
    drawLinesAnim.addAnim(
        new AnimObjectInfo(new LineBundle())
            .withAnim(drawLinesAnimFunction)
    );

    return drawLinesAnim;
}

function constructStartBresenhamAnim(pixelGrid: PixelGrid): AnimStateBuilder {
    const pixelDrawAnim = new AnimStateBuilder();
    pixelDrawAnim.addAnim(
        new AnimObjectInfo(pixelGrid, new TextObject(), new PixelCoords(pixelGrid))
            .withAnim(pixelStart)
    );

    return pixelDrawAnim;
}

function constructCustomLineBresenhamAnim(pixelGrid: PixelGrid): AnimStateBuilder {
    const customLineAnimBuilder = new AnimStateBuilder();
    customLineAnimBuilder.addAnim(new AnimObjectInfo(pixelGrid, new PixelCoords(pixelGrid)).withAnim(customLineAnim));

    return customLineAnimBuilder;
}