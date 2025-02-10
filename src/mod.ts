import { createAnim, AnimStateBuilder, StateEventEnum } from "@trawby/canvas-demo";
import { AnimObjectInfo } from "@trawby/canvas-demo";
import { PixelGrid } from "@trawby/canvas-demo";
import { createBresenhamAnim } from "./bresenhamAnim.ts";
import TestBox, { moveBox } from "./testBox.ts";
import { colorFromHex } from "@trawby/canvas-demo";
import { setupButtons } from "./setupButtons.ts";
import AnimManager from "../../canvas-demo/lib/animManager.ts";

export enum States {
    Start = 0,
    BoxState = 1,
}

let animManager: AnimManager<States> | null = null;

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
    startStateAnims.addAnim(pixelGridAnim);
    startStateAnims.addEventListener(StateEventEnum.AnimsCompleted, (animUtil) => {
        animUtil.setState(States.BoxState);
    });

    const boxStateAnims = new AnimStateBuilder<States>(States.BoxState);
    boxStateAnims.addAnim(testBoxAnim);

    const builder = createAnim(canvasId)
        .withState<States>(States.Start)
        .withDimensions(1000, 800)
        .addStateAnims(startStateAnims)
        .addStateAnims(boxStateAnims);
        
    animManager = builder.build();
    animManager.start();

    // animObject.run();
}

export function changeState() {
    animManager?.setState(States.BoxState);
}

setupButtons();
start("canvas");

