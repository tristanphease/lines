

export function setExplainText(text: string) {
    const explainTextElem = document.getElementById("explain-text");
    explainTextElem!.innerHTML = text;
}