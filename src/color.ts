class Color {
    private colorString: string;

    constructor(colorString: string) {
        this.colorString = colorString;
    }

    public getColorString(): string {
        return this.colorString;
    }
}

export default Color;