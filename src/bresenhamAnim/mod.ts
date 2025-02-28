import { createAnim, AnimObjectInfo, PixelGrid, AnimStateBuilder, AnimBuilderWithState, createAnimForState } from "@trawby/trawby";
import { initialGrid, pixelStart } from "./gridFunctions.ts";
import LineBundle from "../objects/lineBundle.ts";
import { drawLinesAnimFunction } from "./miscLines.ts";
import TextObject from "../objects/text.ts";
import PixelCoords from "../objects/pixelCoords.ts";

export enum BresenhamStates {
    /** Setup pixel grid, draw some lines */
    Initial,
    /** Draw lines to show off */
    DrawLine,
    /** Start bresenham anim with explanatory drawings */
    StartBresenham,
}

export function constructBresenhamAnimationBuilder(pixelGrid: PixelGrid): AnimBuilderWithState<BresenhamStates> {
    return createAnim()
        .withState(BresenhamStates.Initial)
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
        );
}

function constructInitialStateAnims(pixelGrid: PixelGrid): AnimStateBuilder<BresenhamStates> {
    return createAnimForState<BresenhamStates>()
        .addAnim<PixelGrid[]>(
            new AnimObjectInfo<BresenhamStates, PixelGrid[]>(pixelGrid)
                .withAnim(initialGrid)
        );
}

function constructDrawLinesAnim(): AnimStateBuilder<BresenhamStates> {
    const drawLinesAnim = new AnimStateBuilder<BresenhamStates>();
    drawLinesAnim.addAnim<LineBundle[]>(
        new AnimObjectInfo<BresenhamStates, LineBundle[]>(new LineBundle())
            .withAnim(drawLinesAnimFunction)
    );

    return drawLinesAnim;
}

function constructStartBresenhamAnim(pixelGrid: PixelGrid): AnimStateBuilder<BresenhamStates> {
    const pixelDrawAnim = new AnimStateBuilder<BresenhamStates>();
    pixelDrawAnim.addAnim<[PixelGrid, TextObject, PixelCoords]>(
        new AnimObjectInfo<BresenhamStates, [PixelGrid, TextObject, PixelCoords]>(pixelGrid, new TextObject(), new PixelCoords(pixelGrid))
            .withAnim(pixelStart)
    );

    return pixelDrawAnim;
}