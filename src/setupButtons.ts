import { changeState } from "./mod.ts";

export function setupButtons() {
    const button = document.getElementById("buttonOne");

    button?.addEventListener("click", () => {
        changeState();
    });
}