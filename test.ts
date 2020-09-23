// tests go here; this will not be compiled when this package is used as an extension.
let s3: TextSprite = null
let s2: TextSprite = null
let s1: TextSprite = null
info.setScore(99999)
info.setLife(5)
let heights = [5, 8, 12, 24]
let y = 24
for (let h of heights) {
    s1 = textsprite.create("水", 9, 8)
    s1.setBorder(1, 6, 1)
    s1.setMaxFontHeight(h)
    s1.setOutline(1, 1)
    s1.left = 2
    s1.top = y
    s2 = textsprite.create("h" + h)
    s2.setMaxFontHeight(h)
    s2.setOutline(1, 6)
    s2.left = 36
    s2.top = y
    s3 = textsprite.create("x" + "99", 1, 3)
    s3.setBorder(1, 3, 1)
    s3.setMaxFontHeight(h)
    s3.setIcon(img`
        . . 8 . .
        . . 8 . .
        . 8 8 8 .
        8 8 9 8 .
        8 9 1 8 .
        8 9 1 9 8
        8 8 9 9 8
        . 8 8 8 .
    `)
    s3.left = 92
    s3.top = y
    y += Math.max(s1.height, s2.height) + 2
}
