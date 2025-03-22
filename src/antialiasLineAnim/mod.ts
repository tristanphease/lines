import { AnimObjectInfo, AnimStateBuilder, createAnim, PixelGrid } from "@trawby/trawby";
import { comparisonBresenhamAntialiasLines, customAntialiasLine, initialAnim } from "./gridFunctions.ts";
import PixelCoords from "../objects/pixelCoords.ts";

const AntiAliasLineStates = {
    /** The initial state explaining the reasoning */
    Initial: "Initial",

    /** Compare between bresenham and antialias */
    Comparison: "Comparison",

    /** Draw a custom line */
    CustomLine: "Custom Line",
} as const;

export function constructAntialiasLineBuilder(pixelGrid: PixelGrid) {
    return createAnim()
        .addAnimRunToState(
            AntiAliasLineStates.Initial,
            new AnimStateBuilder()
                .addAnim(new AnimObjectInfo(pixelGrid)
                    .withAnim(initialAnim)
                )
        )
        .addAnimRunToState(
            AntiAliasLineStates.Comparison,
            new AnimStateBuilder()
                .addAnim(new AnimObjectInfo(pixelGrid, new PixelCoords(pixelGrid))
                    .withAnim(comparisonBresenhamAntialiasLines)
                )
        )
        .addAnimRunToState(
            AntiAliasLineStates.CustomLine,
            new AnimStateBuilder()
                .addAnim(new AnimObjectInfo(pixelGrid, new PixelCoords(pixelGrid))
                    .withAnim(customAntialiasLine)
                )
        );
}