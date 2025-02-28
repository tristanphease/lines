import { AnimManager, createAnim } from "@trawby/trawby";
import { PixelGrid } from "@trawby/trawby";
import { colorFromHex } from "@trawby/trawby";
import { constructBresenhamAnimationBuilder } from "./bresenhamAnim/mod.ts";

export enum States {
    Bresenham,
    BoxState = 1,
}

let animManager: AnimManager<States> | null = null;

function start(canvasId: string) {


    const pixelGrid = new PixelGrid(0, 0, 600, 400, {
        defaultColor: colorFromHex("#000000")!,
        smooth: false
    });

    const mainBuilder = createAnim()
        .withState(States.Bresenham)
        .withDimensions(600, 400)
        .addAnimRunToState(States.Bresenham, constructBresenhamAnimationBuilder(pixelGrid));
        
    animManager = mainBuilder.build(canvasId);
    animManager.start();

    // animObject.run();
}

export function changeState() {
    animManager?.setState(States.BoxState);
}

start("canvas");

