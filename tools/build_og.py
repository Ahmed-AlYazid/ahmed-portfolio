"""Build the social preview card with Pillow."""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "og-card.png"
W, H = 1200, 630


def font(size: int, bold: bool = False):
    name = "segoeuib.ttf" if bold else "segoeui.ttf"
    return ImageFont.truetype(str(Path("C:/Windows/Fonts") / name), size)


image = Image.new("RGB", (W, H), "#07070b")
draw = ImageDraw.Draw(image)

for x in range(0, W, 42):
    draw.line((x, 0, x, H), fill="#14131a", width=1)
for y in range(0, H, 42):
    draw.line((0, y, W, y), fill="#14131a", width=1)

glow = Image.new("RGBA", image.size, (0, 0, 0, 0))
pixels = glow.load()
for y in range(H):
    for x in range(W):
        distance = ((x - 1010) ** 2 + (y - 120) ** 2) ** 0.5
        alpha = max(0, int(70 * (1 - distance / 500)))
        pixels[x, y] = (114, 71, 235, alpha)
image = Image.alpha_composite(image.convert("RGBA"), glow)
draw = ImageDraw.Draw(image)

draw.rounded_rectangle((64, 50, 1136, 580), radius=34, fill="#0d0c14dd", outline="#2e293a", width=2)
draw.rounded_rectangle((94, 83, 146, 135), radius=14, fill="#a78bfa")
draw.text((106, 94), "AY", font=font(18, True), fill="#09060f")
draw.text((165, 95), "AHMED SAEED AL YAZID", font=font(16, True), fill="#aaa5ba")

draw.text((94, 180), "Artificial Intelligence", font=font(60, True), fill="#f7f5ff")
draw.text((94, 250), "Machine Learning · Data Science", font=font(43, True), fill="#a78bfa")
draw.text((94, 307), "Computer Vision", font=font(43, True), fill="#67e8f9")
draw.text((96, 390), "RESEARCH  ·  PRODUCTION SYSTEMS  ·  INTERACTIVE MODELS", font=font(17, True), fill="#aaa5ba")

cards = [(96, 462, 340, 536, "96.3%", "RESEARCH ACCURACY"),
         (356, 462, 600, 536, "0.996", "AUC-ROC"),
         (616, 462, 1104, 536, "LIVE", "ARABIC EDUCATIONAL PLATFORM")]
for left, top, right, bottom, value, label in cards:
    draw.rounded_rectangle((left, top, right, bottom), radius=15, fill="#171422", outline="#3c3450", width=1)
    draw.text((left + 17, top + 12), value, font=font(25, True), fill="#67e8f9")
    draw.text((left + 17, top + 46), label, font=font(10, True), fill="#aaa5ba")

image.convert("RGB").save(OUT, optimize=True)
print("assets/og-card.png")
