import { createAnim, AnimStateBuilder } from "@trawby/canvas-demo";
import { AnimObjectInfo } from "@trawby/canvas-demo";
import { PixelGrid } from "@trawby/canvas-demo";
import { createBresenhamAnim } from "./bresenhamAnim.ts";
import TestBox, { moveBox } from "./testBox.ts";
import { colorFromHex } from "@trawby/canvas-demo";

export enum States {
    Start = 0,
    BoxState = 1,
}

function start(canvasId: string) {

    const pixelGrid = new PixelGrid(0, 0, 200, 200, {
        defaultColor: colorFromHex("#ffaa00")
    });
    const pixelGridAnim = new AnimObjectInfo(pixelGrid);
    pixelGridAnim.withAnim(createBresenhamAnim);

    const testBox = new TestBox(50, 10, 20, 20, colorFromHex("#ff0000")!);
    const testBoxAnim = new AnimObjectInfo(testBox);
    // testBoxAnim.withAnim(moveBox);

    const startStateAnims = new AnimStateBuilder<States>(States.Start);

    startStateAnims.addAnim(pixelGridAnim)
        .addAnim(testBoxAnim);

    const builder = createAnim(canvasId)
        .withState<States>(States.Start)
        .withDimensions(1000, 800)
        .addStateAnims(startStateAnims);
        
    const animManager = builder.build();
    animManager.start();

    // animObject.run();
}

start("canvas");

