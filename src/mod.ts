import { createAnim } from "@trawby/canvas-demo";
import { AnimObjectInfo } from "@trawby/canvas-demo";
import PixelGrid from "./pixelGrid.ts";
import { createBresenhamAnim } from "./bresenhamAnim.ts";
import TestBox, { moveBox } from "./testBox.ts";
import Color from "./color.ts";

export enum States {
    Start = 0,
    Two = 1,
}

function start(canvasId: string) {

    const pixelGridAnim = new AnimObjectInfo(new PixelGrid());
    pixelGridAnim.withAnim(createBresenhamAnim);

    const testBox = new TestBox(10, 10, 20, 20, new Color("#00ff00"));
    const testBoxAnim = new AnimObjectInfo(testBox);
    testBoxAnim.withAnim(moveBox);

    const builder = createAnim(canvasId)
        .withState<States>(States.Start)
        .withDimensions(1000, 800)
        .addAnim(pixelGridAnim)
        .addAnim(testBoxAnim);
    const animManager = builder.build();
    animManager.start();

    // animObject.run();
}

start("canvas");

