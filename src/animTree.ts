import { HtmlTree, Tree } from "@trawby/html-tree";
import { AnimManager, AnimMode, AnimRun, AnimRunType, AnimUtil } from "@trawby/trawby";
import { currentAnimMode } from "./mod.ts";
import { setPlayPauseButtonIcon, updateAnimRunButton } from "./input.ts";

const ANIM_TREE_WRAPPER_ID: string = "anim-tree-wrapper";

const HTML_NODE_CLASS_NAME: string = "animTreeNode";

let htmlTree: HtmlTree<AnimRun> | undefined;
let currentManager: AnimManager | undefined;
let waitingInteractive: boolean = false;

export function loadAnimTree(animManager: AnimManager) {
    const animTree: Tree<AnimRun> = animManager.exposeAsTree();

    const parentElement = document.getElementById(ANIM_TREE_WRAPPER_ID)!;

    htmlTree = HtmlTree.create(parentElement, animTree, {
        populateHtml,
        className: HTML_NODE_CLASS_NAME
    });

    animTree.children;

}

export function startNodeEventFunction(_animUtil: AnimUtil, node: AnimRun) {
    const htmlElement = htmlTree?.findHtmlByNode(node);
    switch (node.animRunType) {
        case AnimRunType.AnimManager:
            currentManager = node;
            console.log(currentManager);
            break;
        case AnimRunType.StateAnims:
            updateAnimRunButton(true);
    }
    if (htmlElement) {
        htmlElement.style.color = "green";
    }
}

export function endNodeEventFunction(_animUtil: AnimUtil, node: AnimRun) {
    const htmlElement = htmlTree?.findHtmlByNode(node);
    if (htmlElement) {
        htmlElement.style.color = "red";
    }

    if (currentAnimMode === AnimMode.Interactive) {
        // set to wait for next input
        updateAnimRunButton(false);
        waitingInteractive = true;
        setPlayPauseButtonIcon(true);
    }
}

export function continueInteractiveAnim(): boolean {
    if (currentAnimMode === AnimMode.Interactive && waitingInteractive) {
        currentManager?.nextState();
        waitingInteractive = false;
        return true;
    }
    return false;
}

function populateHtml(animRunTree: Tree<AnimRun>): string {
    switch (animRunTree.node.animRunType) {
        case AnimRunType.AnimManager:
            return "manager";
        case AnimRunType.StateAnims: {
            const parent = <AnimManager>animRunTree.parent!.node;
            return parent.stateAnimRuns.entries()
                .find(([_, stateAnims]) => stateAnims === animRunTree.node)?.[0]!;
        }
            
    }
}
