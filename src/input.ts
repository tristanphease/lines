import { AnimMode } from "@trawby/trawby";
import { setSpeed, startManager, togglePlay } from "./mod.ts";
import { continueInteractiveAnim } from "./animTree.ts";

const SPEED_INPUT_ID: string = "speed-input";
const PLAY_PAUSE_BUTTON_ID: string = "play-pause-button";
const ANIM_RUN_BUTTON_ID: string = "anim-run-button";
const CANVAS_OVERLAY_ID: string = "canvas-overlay";
const HIDDEN_CSS_CLASS: string = "hidden";

export function setupInput() {
    // setup speed range input
    const speedInput = <HTMLInputElement>document.getElementById(SPEED_INPUT_ID);

    speedInput.addEventListener("input", () => {
        const speedValue = parseFloat(speedInput.value);
        const speedLabel = document.getElementById("speed-label")!;
        speedLabel.innerHTML = `Speed: ${speedValue.toFixed(1)}`;
        setSpeed(speedValue);
    });

    // setup play / pause button 
    const playButton = <HTMLButtonElement>document.getElementById(PLAY_PAUSE_BUTTON_ID);

    playButton.addEventListener("click", () => {
        const paused = togglePlay();

        setPlayPauseButtonIcon(paused);
    });

    // setup start buttons
    const automaticButton = <HTMLButtonElement>document.getElementById("canvas-automatic-button");

    automaticButton.addEventListener("click", () => {
        hideButtons();
        startManager(AnimMode.Automatic);
        updateAnimRunButton(true);
        setPlayPauseButtonIcon(false);
    });

    const interactiveButton = <HTMLButtonElement>document.getElementById("canvas-interactive-button");

    interactiveButton.addEventListener("click", () => {
        hideButtons();
        startManager(AnimMode.Interactive);
        updateAnimRunButton(true);
        setPlayPauseButtonIcon(false);
    });

    const animRunButton = <HTMLButtonElement>document.getElementById(ANIM_RUN_BUTTON_ID);
    animRunButton.addEventListener("click", () => {
        continueInteractiveAnim();
    });

    function hideButtons() {
        const overlayElement = document.getElementById(CANVAS_OVERLAY_ID)!;
        overlayElement.classList.add(HIDDEN_CSS_CLASS);
    }
}

export function setPlayPauseButtonIcon(play: boolean) {
    const playIcon = document.getElementById("play-icon")!;
    const pauseIcon = document.getElementById("pause-icon")!;

    if (play) {
        pauseIcon.classList.add(HIDDEN_CSS_CLASS);
        playIcon.classList.remove(HIDDEN_CSS_CLASS);
    } else {
        pauseIcon.classList.remove(HIDDEN_CSS_CLASS);
        playIcon.classList.add(HIDDEN_CSS_CLASS);
    }
}


const ANIM_RUNNING_TEXT: string = "Anim running";
const ANIM_READY_TEXT: string = "Click to continue";

export function updateAnimRunButton(animStart: boolean) {
    const animButton = <HTMLButtonElement>document.getElementById(ANIM_RUN_BUTTON_ID)!;
    if (animStart) {
        animButton.disabled = true;
        animButton.innerHTML = ANIM_RUNNING_TEXT;
    } else {
        animButton.disabled = false;
        animButton.innerHTML = ANIM_READY_TEXT;
    }
}
