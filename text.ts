namespace SpriteKind {
    //% isKind
    export const Text = SpriteKind.create();
}

function getFontForTextAndHeight(text: string, maxHeight: number): image.Font {
    const baseFont = image.getFontForText(text)
    const hasUnicode = baseFont.charHeight === 12  // this is a hack
    const availableFonts: image.Font[] = hasUnicode 
        ? [baseFont] 
        : [image.font8, image.font5] // 8 and 5 are generally better fonts than 12
    const remainders = availableFonts.map(s => maxHeight % s.charHeight)
    const fontIdx = remainders.reduce((p, n, i) => remainders[p] <= n ? p : i, 99)
    const font = availableFonts[fontIdx]
    return image.scaledFont(font, maxHeight / font.charHeight)
}

//% blockNamespace="textsprite"
//% blockGap=8
class TextSprite extends Sprite {
    constructor(
        public text: string,
        public bg: number,
        public fg: number,
        public maxFontHeight: number,
        public borderWidth: number,
        public borderColor: number,
        public padding: number,
        public icon: Image = null,
    ) {
        super(image.create(0,0));
        this.setKind(SpriteKind.Text);
        this.update()
    }

    public update() {
        const iconWidth = this.icon ? this.icon.width : 0;
        const iconHeight = this.icon ? this.icon.height : 0;
        const borderAndPadding = this.borderWidth + this.padding;
        const font = getFontForTextAndHeight(this.text, this.maxFontHeight);        
        const width = iconWidth + font.charWidth * this.text.length + 2 * borderAndPadding;
        const height = Math.max(iconHeight, font.charHeight) + 2 * borderAndPadding;
        const img = image.create(width, height);
        img.fill(this.borderColor);
        img.fillRect(this.borderWidth, this.borderWidth, width - this.borderWidth * 2, height - this.borderWidth * 2, this.bg)
        if (this.icon) {
            const iconHeightOffset = (height - iconHeight) / 2
            renderScaledImage(this.icon, img, borderAndPadding, iconHeightOffset)
        }
        const textHeightOffset = (height - font.charHeight) / 2
        img.print(this.text, iconWidth + borderAndPadding, textHeightOffset, this.fg, font);
        this.setImage(img)        
    }

    //% block="set $this(textSprite) max font height $height"
    public setMaxFontHeight(height: number) {
        this.maxFontHeight = height
        this.update();
    }

    //% block="set $this(textSprite) icon $icon=screen_image_picker"
    public setIcon(icon: Image) {
        this.icon = icon
        this.update()
    }

    //% block="set $this(textSprite) text $text"
    public setText(text: string) {
        this.text = text || ""
        this.update()
    }

    //% block="set $this(textSprite) border $width $color=colorindexpicker || and padding $padding"
    public setBorder(width: number, color: number, padding: number = 0) {
        this.borderWidth = Math.max(width, 0);
        this.borderColor = color;
        this.padding = Math.max(padding, 0);
        this.update()
    }
}

// TODO: downscale and upscale icons?
function renderScaledImage(source: Image, destination: Image, x: number, y: number, downScalePowerOfTwo: number = 0) {
    const scale = downScalePowerOfTwo;
    const tile = source
    for (let i = 0; i < source.width; i += 1 << scale) {
        for (let j = 0; j < source.height; j += 1 << scale) {
            if (source.getPixel(i, j) != 0) {
                destination.setPixel(x + (i >> scale), y + (j >> scale), source.getPixel(i, j))
            }
        }
    }
}

//% color=#3e99de
//% icon="\uf031"
//% blockGap=8 block="Text Sprite"
//% groups='["Create"]'
namespace textsprite {

    //% block="text sprite $text || as $fg on $bg"
    //% blockId="textsprite_create"
    //% blockSetVariable="textSprite"
    //% expandableArgumentMode="toggle"
    //% bg.defl=0
    //% bg.shadow="colorindexpicker"
    //% fg.defl=1
    //% fg.shadow="colorindexpicker"
    //% group="Create"
    //% weight=100
    export function create(
        text: string,
        bg: number = 0,
        fg: number = 1,
    ): TextSprite {
        const sprite = new TextSprite(text, bg, fg, 12, 0, 0, 0);
        return sprite;
    }
}