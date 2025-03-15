import { AnimManager, AnimMode, AnimModeEnum, AnimRunEvent, createAnim } from "@trawby/trawby";
import { PixelGrid } from "@trawby/trawby";
import { colorFromHex } from "@trawby/trawby";
import { constructBresenhamAnimationBuilder } from "./bresenhamAnim/mod.ts";
import { setupInput } from "./input.ts";
import { loadAnimTree, startNodeEventFunction, endNodeEventFunction, continueInteractiveAnim } from "./animTree.ts";

export const States = {
    Bresenham: "bresenham",
    BoxState: "boxState",
} as const;

export const CANVAS_ID: string = "canvas";

let animManager: AnimManager | null = null;
export let currentAnimMode: AnimModeEnum = AnimMode.Automatic;

export const CANVAS_WIDTH: number = 600;
export const CANVAS_HEIGHT: number = 400;

export const startManager = function(canvasId: string) {
    setupInput();

    const pixelGrid = new PixelGrid(0, 0, 600, 400, {
        defaultColor: colorFromHex("#000000")!,
        smooth: false
    });

    const mainBuilder = createAnim()
        .withDimensions(CANVAS_WIDTH, CANVAS_HEIGHT)
        .addAnimRunToState(States.Bresenham, constructBresenhamAnimationBuilder(pixelGrid));
        
    return function(animMode: AnimModeEnum) {
        currentAnimMode = animMode;
        mainBuilder.setAnimMode(animMode);
        mainBuilder.addEventListenerAll(AnimRunEvent.OnStart, startNodeEventFunction);
        mainBuilder.addEventListenerAll(AnimRunEvent.OnEnd, endNodeEventFunction);
        animManager = mainBuilder.build(canvasId);
        loadAnimTree(animManager);
        animManager.start();

        
    };
}(CANVAS_ID);

export function setSpeed(speed: number) {
    animManager?.setSpeed(speed);
}

export function togglePlay(): boolean {
    const interactiveContinue = continueInteractiveAnim();
    if (interactiveContinue) {
        return false;
    }
    if (animManager) {
        return animManager.togglePause();
    }
    
    return true;
}

export function changeState() {
    animManager?.setState(States.BoxState);
}

