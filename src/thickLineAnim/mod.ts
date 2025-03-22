/**
 * http://kt8216.unixcab.org/murphy/index.html
 */

import { AnimBuilder, AnimObjectInfo, AnimStateBuilder, createAnim, PixelGrid } from "@trawby/trawby";
import { customThickLineAnim, firstTry, initial, secondThickLine } from "./gridFunctions.ts";
import PixelCoords from "../objects/pixelCoords.ts";

const ThickLineStates = {
    /** Intro to thick lines */
    Initial: "Initial",
    /** First attempt at drawing thick lines */
    FirstTry: "First try",
    /** A second try at thick lines */
    SecondTry: "Second try",
    /** Custom thick line */
    CustomThickLine: "Custom Line"
} as const;

export function constructThickLineAnimBuilder(pixelGrid: PixelGrid): AnimBuilder {
    return createAnim()
        .addAnimRunToState(
            ThickLineStates.Initial,
            new AnimStateBuilder()
                .addAnim(new AnimObjectInfo(pixelGrid, new PixelCoords(pixelGrid))
                    .withAnim(initial))
        )
        .addAnimRunToState(
            ThickLineStates.FirstTry,
            new AnimStateBuilder()
                .addAnim(new AnimObjectInfo(pixelGrid, new PixelCoords(pixelGrid))
                    .withAnim(firstTry))
        )
        .addAnimRunToState(
            ThickLineStates.SecondTry,
            new AnimStateBuilder()
                .addAnim(new AnimObjectInfo(pixelGrid, new PixelCoords(pixelGrid))
                    .withAnim(secondThickLine))
        )
        .addAnimRunToState(
            ThickLineStates.CustomThickLine,
            new AnimStateBuilder()
                .addAnim(new AnimObjectInfo(pixelGrid, new PixelCoords(pixelGrid))
                    .withAnim(customThickLineAnim))
        );
}
